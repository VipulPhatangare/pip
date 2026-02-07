// Main Brain Server
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import { tierEngine } from './tierEngine.js';
import { dataStore } from './dataStore.js';
import { TIERS, TIER_INFO } from './config.js';
import authRoutes from './authRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';
import paymentRoutes from './paymentRoutes.js';

// Load environment variables
dotenv.config();

// Silent logger for production
const isProd = process.env.NODE_ENV === 'production';
const log = {
  info: (...args) => !isProd && console.log(...args),
  error: (...args) => console.error(...args),
  warn: (...args) => !isProd && console.warn(...args)
};

// Connect to MongoDB
connectDatabase();

const app = express();
const httpServer = createServer(app);

// CORS origins from environment or defaults
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware - CORS
log.info(`CORS allowed origins: ${corsOrigins.join(', ')}`);

// Manual CORS headers (backup)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && corsOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoints
app.get('/', (req, res) => {
  res.json({
    service: 'Protean Brain Server',
    version: '1.0.0',
    status: 'running',
    clients: dataStore.getAllClients().length,
    uptime: process.uptime()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Protean Brain Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// REST API Routes

/**
 * POST /api/analyze - Analyze metrics and get tier decision
 */
app.post('/api/analyze', (req, res) => {
  try {
    const { clientId, metrics } = req.body;

    if (!clientId || !metrics) {
      return res.status(400).json({ error: 'Missing clientId or metrics' });
    }

    // Update client data
    dataStore.upsertClient(clientId, metrics);

    // Decide tier
    const decision = tierEngine.decideTier(metrics, clientId);

    // Update client tier
    dataStore.updateClientTier(clientId, decision.tier, decision);

    res.json({
      clientId,
      decision,
      tierInfo: TIER_INFO[decision.tier]
    });
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tier/:clientId - Get current tier for client
 */
app.get('/api/tier/:clientId', (req, res) => {
  try {
    const { clientId } = req.params;
    const client = dataStore.getClient(clientId);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      clientId,
      tier: client.currentTier,
      lastDecision: client.lastDecision,
      tierInfo: TIER_INFO[client.currentTier]
    });
  } catch (error) {
    console.error('Error in /api/tier:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/logs - Get decision logs
 */
app.get('/api/logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const clientId = req.query.clientId;

    const logs = clientId
      ? dataStore.getClientLogs(clientId, limit)
      : dataStore.getLogs(limit);

    res.json({ logs, count: logs.length });
  } catch (error) {
    console.error('Error in /api/logs:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/metrics/:clientId - Get client metrics summary
 */
app.get('/api/metrics/:clientId', (req, res) => {
  try {
    const { clientId } = req.params;
    const client = dataStore.getClient(clientId);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      clientId,
      metrics: client.metrics,
      currentTier: client.currentTier,
      lastSeen: client.lastSeen,
      connectedAt: client.connectedAt,
      updateCount: client.updateCount
    });
  } catch (error) {
    console.error('Error in /api/metrics:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/override - Force tier override (admin)
 */
app.post('/api/override', (req, res) => {
  try {
    const { clientId, tier } = req.body;

    if (!clientId) {
      return res.status(400).json({ error: 'Missing clientId' });
    }

    if (tier === null || tier === 'auto') {
      // Clear override
      tierEngine.clearOverride(clientId);
      
      // Broadcast to client
      io.to(clientId).emit('tierOverride', { tier: null, auto: true });
      
      return res.json({ message: 'Override cleared', clientId, mode: 'auto' });
    }

    if (!Object.values(TIERS).includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    // Set override
    tierEngine.setOverride(clientId, tier);

    // Create override decision
    const decision = {
      tier,
      reason: 'Dashboard manual override',
      confidence: 100,
      uiConstraints: TIER_INFO[tier].constraints,
      timestamp: Date.now(),
      isOverride: true
    };

    // Update client
    dataStore.updateClientTier(clientId, tier, decision);

    // Broadcast to client
    io.to(clientId).emit('tierDecision', decision);

    res.json({ message: 'Override applied', clientId, tier, decision });
  } catch (error) {
    console.error('Error in /api/override:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/metrics-override - Override client metrics for testing
 */
app.post('/api/metrics-override', (req, res) => {
  try {
    const { clientId, metrics } = req.body;

    if (!clientId) {
      return res.status(400).json({ error: 'Missing clientId' });
    }

    if (metrics === null) {
      // Clear metrics override - reset to automatic
      if (dataStore.clients.has(clientId)) {
        const client = dataStore.clients.get(clientId);
        if (client.metricsOverride) {
          delete client.metricsOverride;
          dataStore.clients.set(clientId, client);
        }
      }

      // Notify client to resume normal metric collection
      io.to(clientId).emit('metricsOverrideCleared');

      return res.json({ message: 'Metrics override cleared', clientId, mode: 'auto' });
    }

    // Validate metrics
    if (!metrics || typeof metrics !== 'object') {
      return res.status(400).json({ error: 'Invalid metrics object' });
    }

    // Store metrics override
    if (dataStore.clients.has(clientId)) {
      const client = dataStore.clients.get(clientId);
      client.metricsOverride = metrics;
      dataStore.clients.set(clientId, client);
    } else {
      dataStore.clients.set(clientId, {
        clientId,
        metricsOverride: metrics,
        lastSeen: Date.now()
      });
    }

    // Force new tier decision with overridden metrics
    const decision = tierEngine.decideTier(metrics, clientId);
    
    // Update client tier
    dataStore.updateClientTier(clientId, decision.tier, decision);

    // Broadcast overridden metrics to client
    io.to(clientId).emit('metricsOverride', { metrics, decision });

    // Log the action
    dataStore.addLog({
      timestamp: Date.now(),
      type: 'METRICS_OVERRIDE',
      clientId,
      message: `Metrics overridden: Battery ${metrics.battery}%, CPU ${metrics.cpuScore}, FPS ${metrics.fps}`,
      data: { metrics, resultingTier: decision.tier }
    });

    res.json({ 
      message: 'Metrics override applied', 
      clientId, 
      metrics, 
      decision 
    });
  } catch (error) {
    console.error('Error in /api/metrics-override:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/consent - Record user consent for battery optimization
 */
app.post('/api/consent', (req, res) => {
  try {
    const { clientId, consent } = req.body;

    if (!clientId || !consent) {
      return res.status(400).json({ error: 'Missing clientId or consent' });
    }

    const validConsents = ['accept', 'deny', 'always-optimize', 'never-optimize'];
    if (!validConsents.includes(consent)) {
      return res.status(400).json({ error: 'Invalid consent type' });
    }

    // Record user consent
    tierEngine.recordUserConsent(clientId, consent);

    // If accepted, re-evaluate tier and switch
    if (consent === 'accept' || consent === 'always-optimize') {
      const client = dataStore.getClient(clientId);
      if (client) {
        const decision = tierEngine.decideTier(client.metrics, clientId);
        
        // Update data store
        dataStore.updateClientTier(clientId, decision.tier, decision);
        
        // Log decision with consent info
        dataStore.addLog({
          clientId,
          metrics: client.metrics,
          decision,
          previousTier: client.currentTier,
          userConsent: consent,
          timestamp: Date.now()
        });
        
        // Send tier decision to client
        io.to(clientId).emit('tierDecision', decision);
        
        return res.json({ 
          message: 'Consent recorded and tier updated', 
          clientId, 
          consent,
          newTier: decision.tier,
          decision 
        });
      }
    }

    res.json({ message: 'Consent recorded', clientId, consent });
  } catch (error) {
    console.error('Error in /api/consent:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/clients - List all connected clients
 */
app.get('/api/clients', (req, res) => {
  try {
    const clients = dataStore.getAllClients();
    const stats = dataStore.getStats();

    res.json({ clients, stats });
  } catch (error) {
    console.error('Error in /api/clients:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stats - Get system statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    const stats = dataStore.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error in /api/stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket Connection Handling
io.on('connection', (socket) => {
  log.info('Client connected:', socket.id);

  // Client identification
  socket.on('identify', (data) => {
    const clientId = data.clientId || socket.id;
    socket.clientId = clientId;
    socket.join(clientId); // Join room for targeted messages
    
    log.info(`Client identified as: ${clientId}`);
    
    // Reset tier engine state to allow fresh decision (prevents stale tier D from previous session)
    tierEngine.resetClientState(clientId);
    
    // Send acknowledgment
    socket.emit('identified', { clientId, socketId: socket.id });

    // Broadcast to dashboard
    io.emit('clientConnected', {
      clientId,
      timestamp: Date.now()
    });
  });

  // Receive metrics from client
  socket.on('metrics', (data) => {
    const clientId = socket.clientId || socket.id;
    const { metrics, route = '/' } = data;

    try {
      // Get previous state
      const client = dataStore.getClient(clientId);
      const previousTier = client?.currentTier;
      const previousDecision = client?.lastDecision;

      // Store metrics
      dataStore.upsertClient(clientId, metrics);

      // Decide tier with route context
      const decision = tierEngine.decideTier(metrics, clientId, route);

      // Update client tier
      dataStore.updateClientTier(clientId, decision.tier, decision);

      // Determine if we should send this decision to client
      const shouldSendDecision = 
        !previousTier || // First connection
        decision.tier !== previousTier || // Tier changed
        decision.requiresConsent || // User consent needed
        decision.emergency || // Emergency situation
        decision.isOverride || // Manual override
        decision.isFirstConnection; // First connection optimistic tier

      // Only send decision if meaningful change occurred
      if (shouldSendDecision) {
        socket.emit('tierDecision', decision);
        log.info(`Client ${clientId} [${route}]: Tier ${decision.tier} - ${decision.reason}`);
      }

      // Always broadcast to dashboard (but less frequently for stable conditions)
      const shouldBroadcastDashboard = 
        shouldSendDecision || 
        !previousDecision ||
        Date.now() - previousDecision.timestamp > 5000; // Every 5 seconds for stable conditions

      if (shouldBroadcastDashboard) {
        io.emit('metricsUpdate', {
          clientId,
          metrics,
          decision,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error processing metrics:', error);
      socket.emit('error', { message: error.message });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const clientId = socket.clientId || socket.id;
    log.info('Client disconnected:', clientId);

    // Keep client data for a while (they might reconnect)
    setTimeout(() => {
      const client = dataStore.getClient(clientId);
      if (client && Date.now() - client.lastSeen > 60000) {
        dataStore.removeClient(clientId);
      }
    }, 60000);

    // Broadcast to dashboard
    io.emit('clientDisconnected', {
      clientId,
      timestamp: Date.now()
    });
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  log.info(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🧠 PROTEAN BRAIN SERVER                            ║
║                                                       ║
║   Central Decision Engine + MongoDB                  ║
║   Version: 2.0.0                                     ║
║                                                       ║
║   Server running on: http://localhost:${PORT}        ║
║   WebSocket ready: ws://localhost:${PORT}            ║
║   MongoDB Connected ✅                               ║
║                                                       ║
║   API Endpoints:                                     ║
║   - /api/auth          (Authentication)              ║
║   - /api/properties    (Real Estate Listings)        ║
║   - /api/bookings      (Visit Appointments)          ║
║   - /api/inquiries     (Contact Requests)            ║
║   - /api/payments      (Payment Processing)          ║
║                                                       ║
║   Ready to receive client metrics...                 ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    log.info('HTTP server closed');
  });
});
