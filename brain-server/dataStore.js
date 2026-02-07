// In-Memory Data Store
import { v4 as uuidv4 } from 'uuid';

export class DataStore {
  constructor() {
    this.clients = new Map(); // clientId -> ClientData
    this.logs = []; // DecisionLog array
    this.maxLogs = 1000;
  }

  /**
   * Register or update a client
   */
  upsertClient(clientId, metrics) {
    const existing = this.clients.get(clientId);
    
    const clientData = {
      clientId,
      metrics,
      currentTier: existing?.currentTier || 'A',
      lastSeen: Date.now(),
      connectedAt: existing?.connectedAt || Date.now(),
      updateCount: (existing?.updateCount || 0) + 1
    };

    this.clients.set(clientId, clientData);
    return clientData;
  }

  /**
   * Update client's tier
   */
  updateClientTier(clientId, tier, decision) {
    const client = this.clients.get(clientId);
    if (client) {
      const previousTier = client.currentTier;
      client.currentTier = tier;
      client.lastDecision = decision;
      
      // Log the decision if tier changed
      if (previousTier !== tier) {
        this.addLog(clientId, client.metrics, decision, previousTier);
      }
    }
  }

  /**
   * Get a specific client
   */
  getClient(clientId) {
    return this.clients.get(clientId);
  }

  /**
   * Get all clients
   */
  getAllClients() {
    return Array.from(this.clients.values());
  }

  /**
   * Remove a client
   */
  removeClient(clientId) {
    this.clients.delete(clientId);
  }

  /**
   * Add a decision log entry
   */
  addLog(clientId, metrics, decision, previousTier = null) {
    const log = {
      id: uuidv4(),
      clientId,
      metrics: { ...metrics },
      decision: { ...decision },
      previousTier,
      timestamp: Date.now(),
      displayTime: new Date().toISOString()
    };

    this.logs.push(log);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    return log;
  }

  /**
   * Get all logs
   */
  getLogs(limit = 100) {
    return this.logs.slice(-limit).reverse();
  }

  /**
   * Get logs for a specific client
   */
  getClientLogs(clientId, limit = 50) {
    return this.logs
      .filter(log => log.clientId === clientId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get statistics
   */
  getStats() {
    const clients = this.getAllClients();
    const tierCounts = { A: 0, B: 0, C: 0, D: 0 };
    
    clients.forEach(client => {
      tierCounts[client.currentTier] = (tierCounts[client.currentTier] || 0) + 1;
    });

    return {
      totalClients: clients.length,
      activeClients: clients.filter(c => Date.now() - c.lastSeen < 30000).length,
      tierDistribution: tierCounts,
      totalDecisions: this.logs.length,
      recentDecisions: this.logs.slice(-10).length
    };
  }

  /**
   * Clear all data
   */
  clear() {
    this.clients.clear();
    this.logs = [];
  }
}

// Singleton instance
export const dataStore = new DataStore();
