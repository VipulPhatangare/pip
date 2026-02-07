// Tier Adapter - Decides which UI tier to use based on environment metrics

export const TIERS = {
  A: 'A', // Abundance Mode - Full featured
  B: 'B', // Constraint Mode - Optimized
  C: 'C', // Minimal Mode - Core features only
  D: 'D'  // Survival Mode - Plain HTML fallback
};

export const TIER_THRESHOLDS = {
  // Tier A: Optimal conditions
  A: {
    battery: 50,
    batteryCharging: null, // Any charging state
    networkType: ['4g', '5g'],
    fps: 45,
    cpuScore: 60,
    memoryUsagePercent: 75,
    online: true
  },
  
  // Tier B: Moderate constraints
  B: {
    battery: 25,
    fps: 30,
    cpuScore: 40,
    memoryUsagePercent: 85,
    online: true
  },
  
  // Tier C: Severe constraints
  C: {
    battery: 10,
    fps: 15,
    cpuScore: 20,
    memoryUsagePercent: 95,
    online: true
  },
  
  // Tier D: Survival mode (any condition that doesn't meet C)
  D: {
    battery: 0,
    fps: 0,
    cpuScore: 0,
    online: null // Works offline too
  }
};

export class TierAdapter {
  constructor() {
    this.currentTier = TIERS.A;
    this.manualOverride = null;
    this.listeners = new Set();
    this.decisionHistory = [];
  }

  // Determine appropriate tier based on metrics
  decideTier(metrics) {
    // If manual override is set, use it
    if (this.manualOverride) {
      return this.manualOverride;
    }

    // Calculate memory usage percentage
    const memoryUsagePercent = (metrics.memoryUsed / metrics.memory) * 100;

    // Check for offline mode - immediate Tier D
    if (!metrics.online) {
      this.logDecision('Offline detected', TIERS.D, metrics);
      return TIERS.D;
    }

    // Check Tier D conditions (survival mode)
    if (metrics.battery < 5 || metrics.fps < 10) {
      this.logDecision('Critical resource shortage', TIERS.D, metrics);
      return TIERS.D;
    }

    // Check Tier C conditions (minimal mode)
    if (
      metrics.battery < TIER_THRESHOLDS.C.battery ||
      metrics.fps < TIER_THRESHOLDS.C.fps ||
      metrics.cpuScore < TIER_THRESHOLDS.C.cpuScore ||
      memoryUsagePercent > TIER_THRESHOLDS.C.memoryUsagePercent ||
      metrics.networkType === 'slow-2g' ||
      metrics.networkType === '2g'
    ) {
      this.logDecision('Severe constraints detected', TIERS.C, metrics);
      return TIERS.C;
    }

    // Check Tier B conditions (constraint mode)
    if (
      metrics.battery < TIER_THRESHOLDS.B.battery ||
      metrics.fps < TIER_THRESHOLDS.B.fps ||
      metrics.cpuScore < TIER_THRESHOLDS.B.cpuScore ||
      memoryUsagePercent > TIER_THRESHOLDS.B.memoryUsagePercent ||
      metrics.networkType === '3g'
    ) {
      this.logDecision('Moderate constraints detected', TIERS.B, metrics);
      return TIERS.B;
    }

    // Default to Tier A (abundance mode)
    this.logDecision('Optimal conditions', TIERS.A, metrics);
    return TIERS.A;
  }

  // Update tier based on new metrics
  updateTier(metrics) {
    const newTier = this.decideTier(metrics);
    
    if (newTier !== this.currentTier) {
      const oldTier = this.currentTier;
      this.currentTier = newTier;
      this.notifyListeners(newTier, oldTier);
    }
  }

  // Set manual override for demo purposes
  setManualOverride(tier) {
    this.manualOverride = tier;
    const oldTier = this.currentTier;
    this.currentTier = tier || this.currentTier;
    this.logDecision(`Manual override to Tier ${tier || 'Auto'}`, this.currentTier, {});
    this.notifyListeners(this.currentTier, oldTier);
  }

  // Clear manual override
  clearManualOverride() {
    this.manualOverride = null;
  }

  // Log decision with reasoning
  logDecision(reason, tier, metrics) {
    const decision = {
      timestamp: new Date().toISOString(),
      reason,
      tier,
      metrics: { ...metrics }
    };
    
    this.decisionHistory.push(decision);
    
    // Keep only last 50 decisions
    if (this.decisionHistory.length > 50) {
      this.decisionHistory.shift();
    }
  }

  // Get decision history
  getDecisionHistory() {
    return [...this.decisionHistory];
  }

  // Subscribe to tier changes
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.currentTier, null);
    
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners(newTier, oldTier) {
    this.listeners.forEach(callback => callback(newTier, oldTier));
  }

  // Get current tier
  getCurrentTier() {
    return this.currentTier;
  }

  // Get tier info
  getTierInfo(tier) {
    const tierInfo = {
      [TIERS.A]: {
        name: 'Abundance Mode',
        description: 'Full-featured rich UI with animations',
        bundleSize: '500 KB',
        color: 'tier-a'
      },
      [TIERS.B]: {
        name: 'Constraint Mode',
        description: 'Optimized lightweight UI',
        bundleSize: '250 KB',
        color: 'tier-b'
      },
      [TIERS.C]: {
        name: 'Minimal Mode',
        description: 'Core functionality only',
        bundleSize: '100 KB',
        color: 'tier-c'
      },
      [TIERS.D]: {
        name: 'Survival Mode',
        description: 'Plain HTML fallback',
        bundleSize: '30 KB',
        color: 'tier-d'
      }
    };

    return tierInfo[tier] || tierInfo[TIERS.A];
  }
}

// Singleton instance
export const tierAdapter = new TierAdapter();
