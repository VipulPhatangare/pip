// Tier Memory Context - Tracks tier decisions per route
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const TierMemoryContext = createContext(null);

export const TierMemoryProvider = ({ children }) => {
  // Track tier for each route path
  const [routeTiers, setRouteTiers] = useState({});
  
  // Track navigation history
  const navigationHistory = useRef([]);
  
  // Session tier floor (minimum tier for this session)
  const [sessionFloor, setSessionFloor] = useState(null);
  
  // Current route
  const [currentRoute, setCurrentRoute] = useState('/');

  /**
   * Record tier for a specific route
   */
  const recordRouteTier = useCallback((route, tier) => {
    setRouteTiers(prev => {
      const existing = prev[route];
      
      // Only update if new tier is higher or first time
      if (!existing || getTierRank(tier) >= getTierRank(existing.tier)) {
        return {
          ...prev,
          [route]: {
            tier,
            timestamp: Date.now(),
            locked: true
          }
        };
      }
      
      return prev;
    });

    // Update session floor if this is the first tier or higher
    setSessionFloor(currentFloor => {
      if (!currentFloor) return tier;
      return getTierRank(tier) > getTierRank(currentFloor) ? tier : currentFloor;
    });
  }, []);

  /**
   * Get remembered tier for a route (if exists)
   */
  const getRouteTier = useCallback((route) => {
    return routeTiers[route]?.tier || null;
  }, [routeTiers]);

  /**
   * Check if route was visited before
   */
  const isRouteVisited = useCallback((route) => {
    return !!routeTiers[route];
  }, [routeTiers]);

  /**
   * Record navigation to a route
   */
  const recordNavigation = useCallback((route) => {
    setCurrentRoute(route);
    if (!navigationHistory.current.includes(route)) {
      navigationHistory.current.push(route);
    }
  }, []);

  /**
   * Check if tier should be locked for a route (with adaptive decay)
   */
  const shouldLockTier = useCallback((route, proposedTier, currentBattery = 100) => {
    const existing = routeTiers[route];
    
    if (!existing) {
      return false; // New route, no lock
    }

    // Check age of memory
    const age = Date.now() - existing.timestamp;
    const MEMORY_FULL_DURATION = 10 * 60 * 1000; // 10 minutes
    const MEMORY_PARTIAL_DURATION = 5 * 60 * 1000; // 5 minutes
    
    const existingRank = getTierRank(existing.tier);
    const proposedRank = getTierRank(proposedTier);
    
    // Memory has expired completely (>10 minutes old)
    if (age > MEMORY_FULL_DURATION) {
      return false; // Allow any tier change
    }
    
    // Partial memory decay (5-10 minutes old)
    if (age > MEMORY_PARTIAL_DURATION) {
      // Allow 1-tier downgrade if battery is low
      if (currentBattery < 20 && existingRank - proposedRank === 1) {
        return false; // Allow A→B or B→C with low battery
      }
    }
    
    // Full memory active (<5 minutes)
    // Block any downgrade
    return proposedRank < existingRank;
  }, [routeTiers]);

  /**
   * Get minimum allowed tier for a route (with time decay)
   */
  const getMinimumTier = useCallback((route, currentBattery = 100) => {
    const routeTier = routeTiers[route];
    
    if (!routeTier) {
      return sessionFloor || 'D';
    }
    
    // Check if memory has expired
    const age = Date.now() - routeTier.timestamp;
    const MEMORY_FULL_DURATION = 10 * 60 * 1000;
    
    if (age > MEMORY_FULL_DURATION) {
      return sessionFloor || 'D'; // Memory expired, use session floor only
    }
    
    // Use the higher of: route-specific tier or session floor
    if (routeTier.tier && sessionFloor) {
      return getTierRank(routeTier.tier) > getTierRank(sessionFloor) 
        ? routeTier.tier 
        : sessionFloor;
    }
    
    return routeTier.tier || sessionFloor || 'D';
  }, [routeTiers, sessionFloor]);

  /**
   * Clear route memory (for testing or reset)
   * Now also cleans up expired memories automatically
   */
  const clearRouteMemory = useCallback((route = null) => {
    const MEMORY_EXPIRATION = 10 * 60 * 1000; // 10 minutes
    
    if (route) {
      // Clear specific route
      setRouteTiers(prev => {
        const updated = { ...prev };
        delete updated[route];
        return updated;
      });
    } else {
      // Clear all or just expired
      setRouteTiers(prev => {
        const now = Date.now();
        const cleaned = {};
        
        Object.entries(prev).forEach(([path, data]) => {
          const age = now - data.timestamp;
          if (age < MEMORY_EXPIRATION) {
            cleaned[path] = data; // Keep non-expired memories
          }
        });
        
        return cleaned;
      });
    }
  }, []);
  
  /**
   * Get memory status for a route (active/decaying/expired)
   */
  const getMemoryStatus = useCallback((route) => {
    const memory = routeTiers[route];
    if (!memory) return 'none';
    
    const age = Date.now() - memory.timestamp;
    const PARTIAL_DECAY = 5 * 60 * 1000;
    const FULL_DECAY = 10 * 60 * 1000;
    
    if (age < PARTIAL_DECAY) return 'active';
    if (age < FULL_DECAY) return 'decaying';
    return 'expired';
  }, [routeTiers]);

  const value = {
    routeTiers,
    sessionFloor,
    currentRoute,
    navigationHistory: navigationHistory.current,
    recordRouteTier,
    getRouteTier,
    isRouteVisited,
    recordNavigation,
    shouldLockTier,
    getMinimumTier,
    getMemoryStatus,
    clearRouteMemory
  };

  return (
    <TierMemoryContext.Provider value={value}>
      {children}
    </TierMemoryContext.Provider>
  );
};

/**
 * Hook to use tier memory
 */
export const useTierMemory = () => {
  const context = useContext(TierMemoryContext);
  if (!context) {
    throw new Error('useTierMemory must be used within TierMemoryProvider');
  }
  return context;
};

/**
 * Helper: Get numeric rank for tier comparison
 */
function getTierRank(tier) {
  const ranks = { A: 4, B: 3, C: 2, D: 1 };
  return ranks[tier] || 0;
}
