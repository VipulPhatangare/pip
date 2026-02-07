// Smooth Tier Transition Component - Cross-fade between tiers
import React, { useState, useEffect } from 'react';

export const TierTransition = ({ children, tierKey, onTransitionComplete }) => {
  const [displayTier, setDisplayTier] = useState(tierKey);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousContent, setPreviousContent] = useState(null);

  useEffect(() => {
    if (tierKey !== displayTier) {
      // Start transition
      setIsTransitioning(true);
      setPreviousContent(children);

      // Cross-fade duration
      const timer = setTimeout(() => {
        setDisplayTier(tierKey);
        setIsTransitioning(false);
        setPreviousContent(null);
        
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }, 600); // 600ms smooth transition

      return () => clearTimeout(timer);
    }
  }, [tierKey, displayTier, children, onTransitionComplete]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* Previous tier - fading out */}
      {isTransitioning && previousContent && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0,
            animation: 'fadeOut 600ms ease-in-out forwards',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {previousContent}
        </div>
      )}

      {/* Current tier - fading in */}
      <div
        style={{
          opacity: isTransitioning ? 0 : 1,
          animation: isTransitioning ? 'fadeIn 600ms ease-in-out forwards' : 'none',
          zIndex: 2,
          position: 'relative'
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TierTransition;
