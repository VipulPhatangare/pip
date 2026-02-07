// Enhanced Tier Decision Engine with Directional Logic and User Consent
import { TIERS, THRESHOLDS, TIER_INFO, DECISION_WEIGHTS } from './config.js';
import { BatteryConsumptionTracker } from './batteryConsumption.js';

export class TierDecisionEngine {
  constructor() {
    this.manualOverrides = new Map(); // clientId -> tier
    this.consumptionTracker = new BatteryConsumptionTracker();
    this.clientStates = new Map(); // clientId -> { tier, lastSwitchTime }
    this.userConsents = new Map(); // clientId -> consent preference
    this.routeMemory = new Map(); // clientId -> { route: { tier, timestamp, locked } }
    this.MIN_SWITCH_INTERVAL = 10000; // 10 seconds minimum between switches
  }

  /**
   * Analyzes environment metrics and decides the appropriate tier
   * Enhanced with directional logic, battery consumption tracking, user consent, and route memory
   * @param {Object} metrics - Client environment metrics
   * @param {string} clientId - Unique client identifier
   * @param {string} route - Current route/view path
   * @returns {Object} Tier decision with reasoning
   */
  decideTier(metrics, clientId, route = '/') {
    // Check for manual override first
    if (this.manualOverrides.has(clientId)) {
      const overrideTier = this.manualOverrides.get(clientId);
      return {
        tier: overrideTier,
        reason: 'Manual override via dashboard',
        confidence: 100,
        uiConstraints: TIER_INFO[overrideTier].constraints,
        timestamp: Date.now(),
        isOverride: true,
        autoSwitch: true
      };
    }

    // Track battery consumption
    this.consumptionTracker.addReading(
      clientId,
      metrics.battery,
      metrics.batteryCharging,
      Date.now()
    );

    // Get current client state
    const isNewClient = !this.clientStates.has(clientId);
    const clientState = this.clientStates.get(clientId) || {
      tier: TIERS.A,
      lastSwitchTime: 0
    };
    const currentTier = clientState.tier;
    const timeSinceSwitch = Date.now() - clientState.lastSwitchTime;

    // Prevent flicker: minimum time between switches (skip for first connection)
    if (!isNewClient && timeSinceSwitch < this.MIN_SWITCH_INTERVAL) {
      return {
        tier: currentTier,
        reason: 'Too soon to switch (preventing flicker)',
        confidence: 100,
        uiConstraints: TIER_INFO[currentTier].constraints,
        timestamp: Date.now(),
        autoSwitch: false,
        skipSwitch: true
      };
    }

    // Get battery consumption analysis
    const consumption = this.consumptionTracker.getConsumptionRate(clientId);

    // For NEW clients, start optimistically with higher tier
    // Only downgrade if we detect actual problems
    if (isNewClient) {
      // Treat null/undefined/0 FPS as "not yet measured" - assume good performance
      // FPS=0 often means page was loaded in background/hidden tab
      const fps = (metrics.fps === null || metrics.fps === undefined || metrics.fps === 0) ? 60 : metrics.fps;
      
      // Excellent configuration: Start with Tier A
      if (fps >= 40 && metrics.battery > 40 && 
          (metrics.batteryCharging || consumption.isCharging)) {
        this.updateClientState(clientId, TIERS.A);
        console.log('🎉 NEW CLIENT - Tier A:', {
          fps: fps,
          fpsActual: metrics.fps,
          battery: metrics.battery,
          charging: metrics.batteryCharging,
          reason: 'Excellent configuration'
        });
        return {
          tier: TIERS.A,
          reason: 'New client with excellent configuration',
          confidence: 95,
          uiConstraints: TIER_INFO[TIERS.A].constraints,
          timestamp: Date.now(),
          autoSwitch: true,
          isFirstConnection: true
        };
      }
      
      // Good configuration: Start with Tier B
      if (fps >= 25 && metrics.battery > 30 && metrics.online) {
        this.updateClientState(clientId, TIERS.B);
        console.log('🎉 NEW CLIENT - Tier B:', {
          fps: fps,
          fpsActual: metrics.fps,
          battery: metrics.battery,
          online: metrics.online,
          reason: 'Good configuration'
        });
        return {
          tier: TIERS.B,
          reason: 'New client with good configuration',
          confidence: 90,
          uiConstraints: TIER_INFO[TIERS.B].constraints,
          timestamp: Date.now(),
          autoSwitch: true,
          isFirstConnection: true
        };
      }
      
      // Basic configuration: Start with Tier C
      if (metrics.online && fps >= 15) {
        this.updateClientState(clientId, TIERS.C);
        console.log('🎉 NEW CLIENT - Tier C:', {
          fps: fps,
          fpsActual: metrics.fps,
          online: metrics.online,
          reason: 'Basic configuration'
        });
        return {
          tier: TIERS.C,
          reason: 'New client with basic configuration',
          confidence: 85,
          uiConstraints: TIER_INFO[TIERS.C].constraints,
          timestamp: Date.now(),
          autoSwitch: true,
          isFirstConnection: true
        };
      }
      
      // Fallback for new clients with poor metrics
      this.updateClientState(clientId, TIERS.D);
      console.log('⚠️ NEW CLIENT - Tier D (Fallback):', {
        fps: fps,
        fpsActual: metrics.fps,
        battery: metrics.battery,
        online: metrics.online,
        reason: 'Poor configuration detected'
      });
      return {
        tier: TIERS.D,
        reason: 'New client with constrained resources',
        confidence: 80,
        uiConstraints: TIER_INFO[TIERS.D].constraints,
        timestamp: Date.now(),
        autoSwitch: true,
        isFirstConnection: true
      };
    }

    // CRITICAL EMERGENCY - Force Tier D (no consent needed)
    if (this.isCriticalEmergency(metrics, consumption)) {
      const decision = this.createEmergencyDecision(metrics, consumption);
      console.log('🚨 EMERGENCY TIER DECISION:', {
        fps: metrics.fps,
        battery: metrics.battery,
        online: metrics.online,
        critical: consumption.critical,
        decision: decision.tier,
        reason: decision.reason
      });
      return decision;
    }

    // Calculate ideal tiers from different perspectives
    const performanceTier = this.getPerformanceBasedTier(metrics);
    const consumptionTier = this.getConsumptionBasedTier(metrics, consumption);

    // Apply directional decision logic (upgrade eager, downgrade conservative)
    const decision = this.applyDirectionalLogic(
      currentTier,
      performanceTier,
      consumptionTier,
      metrics,
      consumption,
      clientId
    );

    // Apply route memory: prevent downgrade on revisited routes
    return this.applyRouteMemory(clientId, route, decision);
  }

  /**
   * Check if situation is critical emergency
   */
  isCriticalEmergency(metrics, consumption) {
    // Treat null/undefined/0 FPS as "not yet measured" or "page hidden" - not an emergency
    // Browsers throttle requestAnimationFrame when tab is hidden, causing FPS=0
    const fps = (metrics.fps === null || metrics.fps === undefined || metrics.fps === 0) ? 60 : metrics.fps;
    
    return (
      !metrics.online ||
      metrics.battery < 5 ||
      fps < 5 ||
      consumption.critical
    );
  }

  /**
   * Create emergency decision (forced Tier D)
   */
  createEmergencyDecision(metrics, consumption) {
    const reasons = [];
    if (!metrics.online) reasons.push('offline');
    if (metrics.battery < 5) reasons.push('critical battery');
    if (metrics.fps < 5) reasons.push('system unresponsive');
    if (consumption.critical) reasons.push(`battery depleting rapidly (${consumption.minutesRemaining}min left)`);

    return {
      tier: TIERS.D,
      reason: `EMERGENCY: ${reasons.join(', ')}`,
      confidence: 100,
      uiConstraints: TIER_INFO[TIERS.D].constraints,
      timestamp: Date.now(),
      autoSwitch: true,
      emergency: true,
      isOverride: false
    };
  }

  /**
   * Determine tier based on actual performance (FPS primary)
   */
  getPerformanceBasedTier(metrics) {
    // Treat null/undefined/0 FPS as "not yet measured" or "page hidden"
    const fps = (metrics.fps === null || metrics.fps === undefined || metrics.fps === 0) ? 60 : metrics.fps;
    const memoryUsagePercent = (metrics.memoryUsed / metrics.memory) * 100;

    // Performance-driven tier selection
    if (fps >= 45 && metrics.cpuScore >= 60) {
      return TIERS.A;
    }

    if (fps >= 30 && metrics.cpuScore >= 40) {
      return TIERS.B;
    }

    if (fps >= 15 && metrics.cpuScore >= 20) {
      return TIERS.C;
    }

    return TIERS.D;
  }

  /**
   * Determine tier based on battery consumption rate
   */
  getConsumptionBasedTier(metrics, consumption) {
    // If charging, no battery concerns
    if (consumption.isCharging) {
      return TIERS.A;
    }

    // Critical consumption
    if (consumption.critical || (consumption.minutesRemaining && consumption.minutesRemaining < 30)) {
      return TIERS.D;
    }

    // Less than 1 hour remaining
    if (consumption.minutesRemaining && consumption.minutesRemaining < 60) {
      return TIERS.C;
    }

    // High consumption rate
    if (consumption.trend === 'high') {
      return TIERS.B;
    }

    // Moderate consumption
    if (consumption.trend === 'moderate') {
      return TIERS.B;
    }

    // Normal or low consumption
    return TIERS.A;
  }

  /**
   * Apply directional logic: upgrade eager, downgrade conservative
   */
  applyDirectionalLogic(currentTier, perfTier, consTier, metrics, consumption, clientId) {
    const tierRank = { A: 4, B: 3, C: 2, D: 1 };

    // Determine best possible tier (for upgrading)
    const bestTier = [perfTier, consTier].sort((a, b) =>
      tierRank[b] - tierRank[a]
    )[0];

    // UPGRADING: Always eager (better experience)
    if (tierRank[bestTier] > tierRank[currentTier]) {
      this.updateClientState(clientId, bestTier);
      return {
        tier: bestTier,
        reason: `Conditions improved - upgrading to Tier ${bestTier}`,
        confidence: 90,
        uiConstraints: TIER_INFO[bestTier].constraints,
        timestamp: Date.now(),
        autoSwitch: true,
        direction: 'upgrade',
        isOverride: false
      };
    }

    // Determine worst necessary tier (for downgrading)
    const worstTier = [perfTier, consTier].sort((a, b) =>
      tierRank[a] - tierRank[b]
    )[0];

    // DOWNGRADING: Conservative approach
    if (tierRank[worstTier] < tierRank[currentTier]) {
      const batteryDriven = tierRank[consTier] < tierRank[currentTier];
      const performanceDriven = tierRank[perfTier] < tierRank[currentTier];

      // Performance-driven downgrade = auto switch (actual problem)
      if (performanceDriven && metrics.fps < 25) {
        this.updateClientState(clientId, worstTier);
        return {
          tier: worstTier,
          reason: `Performance degraded (FPS: ${metrics.fps}) - switching to Tier ${worstTier}`,
          confidence: 95,
          uiConstraints: TIER_INFO[worstTier].constraints,
          timestamp: Date.now(),
          autoSwitch: true,
          direction: 'downgrade',
          trigger: 'performance',
          isOverride: false
        };
      }

      // Battery consumption downgrade = ask user consent
      if (batteryDriven && !performanceDriven) {
        const userChoice = this.userConsents.get(clientId);

        // User previously chose "always optimize"
        if (userChoice === 'always-optimize') {
          this.updateClientState(clientId, worstTier);
          return {
            tier: worstTier,
            reason: `Battery optimization (user consent: ${consumption.trend} consumption)`,
            confidence: 85,
            uiConstraints: TIER_INFO[worstTier].constraints,
            timestamp: Date.now(),
            autoSwitch: true,
            direction: 'downgrade',
            trigger: 'battery-consent',
            isOverride: false
          };
        }

        // User previously chose "never optimize"
        if (userChoice === 'never-optimize') {
          return {
            tier: currentTier,
            reason: 'User prefers current tier (battery optimization declined)',
            confidence: 100,
            uiConstraints: TIER_INFO[currentTier].constraints,
            timestamp: Date.now(),
            autoSwitch: false,
            isOverride: false
          };
        }

        // No prior choice = request user consent
        return {
          tier: currentTier,
          suggestedTier: worstTier,
          reason: `High battery consumption detected (${consumption.rate.toFixed(2)}%/min)`,
          confidence: 75,
          uiConstraints: TIER_INFO[currentTier].constraints,
          timestamp: Date.now(),
          requiresConsent: true,
          autoSwitch: false,
          consumption: {
            rate: consumption.rate,
            trend: consumption.trend,
            minutesRemaining: consumption.minutesRemaining,
            currentBattery: metrics.battery
          },
          isOverride: false
        };
      }
    }

    // Stay in current tier - conditions stable
    return {
      tier: currentTier,
      reason: 'Conditions stable',
      confidence: 80,
      uiConstraints: TIER_INFO[currentTier].constraints,
      timestamp: Date.now(),
      autoSwitch: false,
      isOverride: false
    };
  }

  /**
   * Update client state after tier switch
   */
  updateClientState(clientId, tier) {
    this.clientStates.set(clientId, {
      tier,
      lastSwitchTime: Date.now()
    });
  }

  /**
   * Record user consent choice
   */
  recordUserConsent(clientId, consent) {
    // consent: 'accept', 'deny', 'always-optimize', 'never-optimize'
    this.userConsents.set(clientId, consent);
  }

  /**
   * Get current tier for a client
   */
  getCurrentTier(clientId) {
    const state = this.clientStates.get(clientId);
    return state ? state.tier : TIERS.A;
  }

  /**
   * Creates a standardized tier decision object
   */
  createDecision(tier, reason, confidence, metadata = {}) {
    return {
      tier,
      reason,
      confidence,
      uiConstraints: TIER_INFO[tier].constraints,
      timestamp: Date.now(),
      metadata,
      isOverride: false
    };
  }

  /**
   * Apply route memory: Prevent downgrades on revisited routes
   * @param {string} clientId - Client identifier
   * @param {string} route - Current route path
   * @param {Object} decision - Proposed tier decision
   * @returns {Object} Final tier decision with route memory applied
   */
  applyRouteMemory(clientId, route, decision) {
    // Emergency decisions always override route memory
    if (decision.emergency) {
      this.recordRouteVisit(clientId, route, decision.tier);
      return decision;
    }

    // Get route memory for this client
    const clientRoutes = this.routeMemory.get(clientId) || {};
    const routeData = clientRoutes[route];

    // First visit to this route - record and allow
    if (!routeData) {
      this.recordRouteVisit(clientId, route, decision.tier);
      console.log(`✨ First visit to "${route}" - Setting baseline at Tier ${decision.tier}`);
      return {
        ...decision,
        routeContext: {
          route,
          firstVisit: true,
          rememberedTier: null
        }
      };
    }

    // Route was visited before - always use the highest tier achieved
    const rememberedTier = routeData.tier;
    const proposedTier = decision.tier;

    // Compare tier ranks
    const rememberedRank = this.getTierRank(rememberedTier);
    const proposedRank = this.getTierRank(proposedTier);

    // If proposed tier is lower than remembered, MAINTAIN the remembered tier (prevent downgrade)
    // This ensures once a page loads in Tier A, it stays in Tier A for the session
    if (proposedRank < rememberedRank) {
      console.log(`🔒 Route Memory Active: "${route}" locked at Tier ${rememberedTier} (proposed: ${proposedTier})`);
      return {
        tier: rememberedTier,
        reason: `Route memory: Keeping ${rememberedTier} for ${route} (session locked)`,
        confidence: 100,
        uiConstraints: TIER_INFO[rememberedTier].constraints,
        timestamp: Date.now(),
        autoSwitch: true,
        skipSwitch: false,
        routeContext: {
          route,
          firstVisit: false,
          rememberedTier,
          proposedTier,
          preventedDowngrade: true,
          sessionLocked: true
        }
      };
    }

    // If proposed tier is same or higher, allow and update
    if (proposedRank >= rememberedRank) {
      if (proposedRank > rememberedRank) {
        console.log(`📈 Route Memory Update: "${route}" upgraded from ${rememberedTier} to ${proposedTier}`);
      }
      this.recordRouteVisit(clientId, route, proposedTier);
      return {
        ...decision,
        routeContext: {
          route,
          firstVisit: false,
          rememberedTier,
          upgradeAllowed: proposedRank > rememberedRank
        }
      };
    }

    return decision;
  }

  /**
   * Record a route visit with its tier
   */
  recordRouteVisit(clientId, route, tier) {
    const clientRoutes = this.routeMemory.get(clientId) || {};
    
    // Only record if new or higher tier
    const existing = clientRoutes[route];
    if (!existing || this.getTierRank(tier) >= this.getTierRank(existing.tier)) {
      clientRoutes[route] = {
        tier,
        timestamp: Date.now(),
        locked: true
      };
      this.routeMemory.set(clientId, clientRoutes);
    }
  }

  /**
   * Get tier rank for comparison
   */
  getTierRank(tier) {
    const ranks = { A: 4, B: 3, C: 2, D: 1 };
    return ranks[tier] || 0;
  }

  /**
   * Resets client state (called on reconnect to allow fresh tier decision)
   */
  resetClientState(clientId) {
    this.clientStates.delete(clientId);
    this.routeMemory.delete(clientId);
    console.log(`Reset tier engine state for client: ${clientId}`);
  }

  /**
   * Sets a manual tier override for a client
   */
  setOverride(clientId, tier) {
    if (!Object.values(TIERS).includes(tier)) {
      throw new Error(`Invalid tier: ${tier}`);
    }
    this.manualOverrides.set(clientId, tier);
  }

  /**
   * Clears manual override for a client
   */
  clearOverride(clientId) {
    this.manualOverrides.delete(clientId);
  }

  /**
   * Clears all overrides
   */
  clearAllOverrides() {
    this.manualOverrides.clear();
  }

  /**
   * Gets override status for a client
   */
  getOverride(clientId) {
    return this.manualOverrides.get(clientId) || null;
  }

  /**
   * Calculates confidence score based on metric stability
   */
  calculateConfidence(metrics, tier) {
    // This can be enhanced with ML models
    // For now, return a simple confidence based on how far from thresholds
    let score = 60;

    if (tier === TIERS.D && !metrics.online) score = 100;
    if (tier === TIERS.A && metrics.battery > 70) score += 20;
    if (metrics.fps > 50) score += 10;

    return Math.min(100, score);
  }
}

// Singleton instance
export const tierEngine = new TierDecisionEngine();
