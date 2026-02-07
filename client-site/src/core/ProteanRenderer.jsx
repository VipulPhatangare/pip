// Protean Renderer - Core renderer that switches between tiers
import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIERS } from './tierAdapter';

// Lazy load tier components for code splitting
const TierA = lazy(() => import('../tiers/TierA'));
const TierB = lazy(() => import('../tiers/TierB'));
const TierC = lazy(() => import('../tiers/TierC'));
const TierD = lazy(() => import('../tiers/TierD'));

const ProteanRenderer = ({ tier, intent, metrics, previousTier }) => {
  // Select appropriate tier component
  const getTierComponent = () => {
    switch (tier) {
      case TIERS.A:
        return TierA;
      case TIERS.B:
        return TierB;
      case TIERS.C:
        return TierC;
      case TIERS.D:
        return TierD;
      default:
        return TierA;
    }
  };

  const TierComponent = getTierComponent();

  // Loading fallback for lazy-loaded components
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-lg">Loading Tier {tier}...</div>
      </div>
    </div>
  );

  // Tier transition animations
  const getTransitionAnimation = () => {
    // More dramatic animation when degrading to lower tiers
    if (previousTier && tier > previousTier) {
      return {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 1.1, y: -20 }
      };
    }
    // Smoother animation when upgrading to higher tiers
    return {
      initial: { opacity: 0, scale: 1.05, y: -20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 }
    };
  };

  const animation = getTransitionAnimation();

  return (
    <div className="protean-renderer">
      {/* Tier indicator badge */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          key={tier}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`px-4 py-2 rounded-full font-bold text-white shadow-lg ${
            tier === TIERS.A ? 'bg-indigo-600' :
            tier === TIERS.B ? 'bg-purple-600' :
            tier === TIERS.C ? 'bg-pink-600' :
            'bg-red-600'
          }`}
        >
          Tier {tier}
        </motion.div>
      </div>

      {/* Animated tier rendering with code splitting */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tier}
          initial={animation.initial}
          animate={animation.animate}
          exit={animation.exit}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="tier-container"
        >
          <Suspense fallback={<LoadingFallback />}>
            <TierComponent intent={intent} metrics={metrics} />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProteanRenderer;
