// Tier Context - Provides current tier to all components
import React, { createContext, useContext, useState, useEffect } from 'react';

const TierContext = createContext({
  currentTier: 'A',
  setCurrentTier: () => {},
  tierHistory: [],
  previousTier: null
});

export function TierProvider({ children, tier, previousTier, tierHistory }) {
  const [currentTier, setCurrentTier] = useState(tier || 'A');

  // Update current tier when prop changes
  useEffect(() => {
    if (tier) {
      setCurrentTier(tier);
    }
  }, [tier]);

  return (
    <TierContext.Provider value={{
      currentTier,
      setCurrentTier,
      tierHistory: tierHistory || [currentTier],
      previousTier: previousTier || null
    }}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  const context = useContext(TierContext);
  if (!context) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
}
