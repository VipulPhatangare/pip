// Brain Server Client - WebSocket Communication
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const BRAIN_SERVER_URL = import.meta.env.VITE_BRAIN_SERVER_URL || 'http://localhost:3001';

export class BrainClient {
  constructor() {
    this.socket = null;
    this.clientId = this.getOrCreateClientId();
    this.connected = false;
    this.tierListeners = new Set();
    this.connectionListeners = new Set();
  }

  /**
   * Get or create a unique client ID
   */
  getOrCreateClientId() {
    let clientId = localStorage.getItem('protean_client_id');
    if (!clientId) {
      clientId = uuidv4();
      localStorage.setItem('protean_client_id', clientId);
    }
    return clientId;
  }

  /**
   * Connect to brain server
   */
  connect() {
    if (this.socket) {
      return;
    }

    console.log('Connecting to brain server:', BRAIN_SERVER_URL);

    this.socket = io(BRAIN_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Connected to brain server');
      this.connected = true;
      
      // Identify ourselves
      this.socket.emit('identify', { clientId: this.clientId });
      
      this.notifyConnectionListeners(true);
    });

    this.socket.on('identified', (data) => {
      console.log('Identified as:', data.clientId);
    });

    this.socket.on('tierDecision', (decision) => {
      console.log('Received tier decision:', decision);
      this.notifyTierListeners(decision);
    });

    this.socket.on('tierOverride', (override) => {
      console.log('Tier override:', override);
      if (override.auto) {
        this.notifyTierListeners({ auto: true });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from brain server');
      this.connected = false;
      this.notifyConnectionListeners(false);
    });

    this.socket.on('error', (error) => {
      console.error('Brain server error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connected = false;
      this.notifyConnectionListeners(false);
    });
  }

  /**
   * Disconnect from brain server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Send metrics to brain server
   */
  sendMetrics(metrics, route = '/') {
    if (!this.socket || !this.connected) {
      console.warn('Not connected to brain server');
      return;
    }

    console.log('📤 Sending metrics to brain server:', {
      fps: metrics.fps,
      battery: metrics.battery,
      charging: metrics.batteryCharging,
      online: metrics.online,
      networkType: metrics.networkType,
      cpuScore: metrics.cpuScore,
      route
    });

    this.socket.emit('metrics', {
      clientId: this.clientId,
      metrics,
      route, // Include current route/view
      timestamp: Date.now()
    });
  }

  /**
   * Subscribe to tier decision updates
   */
  onTierDecision(callback) {
    this.tierListeners.add(callback);
    return () => this.tierListeners.delete(callback);
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionChange(callback) {
    this.connectionListeners.add(callback);
    // Immediately call with current status
    callback(this.connected);
    return () => this.connectionListeners.delete(callback);
  }

  /**
   * Notify all tier listeners
   */
  notifyTierListeners(decision) {
    this.tierListeners.forEach(callback => callback(decision));
  }

  /**
   * Notify all connection listeners
   */
  notifyConnectionListeners(connected) {
    this.connectionListeners.forEach(callback => callback(connected));
  }

  /**
   * Get connection status
   */
  isConnected() {
    return this.connected;
  }

  /**
   * Get client ID
   */
  getClientId() {
    return this.clientId;
  }
}

// Singleton instance
export const brainClient = new BrainClient();
