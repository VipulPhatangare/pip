// Log Store using Zustand
// Tracks environment changes and tier decisions

import { create } from 'zustand';

export const LOG_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  TIER_CHANGE: 'tier-change',
  METRIC_CHANGE: 'metric-change',
  INTENT_CHANGE: 'intent-change'
};

export const useLogStore = create((set, get) => ({
  logs: [],
  maxLogs: 100,
  
  // Add a log entry
  addLog: (type, message, data = {}) => {
    const log = {
      id: Date.now() + Math.random(),
      type,
      message,
      data,
      timestamp: new Date().toISOString(),
      displayTime: new Date().toLocaleTimeString()
    };

    set((state) => ({
      logs: [...state.logs, log].slice(-state.maxLogs)
    }));
  },

  // Log tier change
  logTierChange: (oldTier, newTier, reason = '') => {
    get().addLog(
      LOG_TYPES.TIER_CHANGE,
      `Tier switched: ${oldTier} → ${newTier}${reason ? ` (${reason})` : ''}`,
      { oldTier, newTier, reason }
    );
  },

  // Log metric change
  logMetricChange: (metric, oldValue, newValue) => {
    get().addLog(
      LOG_TYPES.METRIC_CHANGE,
      `${metric}: ${oldValue} → ${newValue}`,
      { metric, oldValue, newValue }
    );
  },

  // Log intent change
  logIntentChange: (intentId, intentType) => {
    get().addLog(
      LOG_TYPES.INTENT_CHANGE,
      `Intent activated: ${intentType} (${intentId})`,
      { intentId, intentType }
    );
  },

  // Log info message
  logInfo: (message, data = {}) => {
    get().addLog(LOG_TYPES.INFO, message, data);
  },

  // Log warning message
  logWarning: (message, data = {}) => {
    get().addLog(LOG_TYPES.WARNING, message, data);
  },

  // Log error message
  logError: (message, data = {}) => {
    get().addLog(LOG_TYPES.ERROR, message, data);
  },

  // Clear all logs
  clearLogs: () => {
    set({ logs: [] });
  },

  // Get logs by type
  getLogsByType: (type) => {
    return get().logs.filter(log => log.type === type);
  },

  // Get recent logs
  getRecentLogs: (count = 10) => {
    return get().logs.slice(-count);
  },

  // Export logs
  exportLogs: () => {
    return get().logs;
  },

  // Get log statistics
  getLogStats: () => {
    const logs = get().logs;
    return {
      total: logs.length,
      byType: {
        info: logs.filter(l => l.type === LOG_TYPES.INFO).length,
        warning: logs.filter(l => l.type === LOG_TYPES.WARNING).length,
        error: logs.filter(l => l.type === LOG_TYPES.ERROR).length,
        tierChange: logs.filter(l => l.type === LOG_TYPES.TIER_CHANGE).length,
        metricChange: logs.filter(l => l.type === LOG_TYPES.METRIC_CHANGE).length,
        intentChange: logs.filter(l => l.type === LOG_TYPES.INTENT_CHANGE).length
      }
    };
  }
}));
