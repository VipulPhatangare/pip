// Tier-aware Contact Agent Page with Code Splitting
import React, { lazy, Suspense } from 'react';
import { useTier } from '../../context/TierContext';

// Lazy load tier-specific components for code splitting
const ContactAgentA = lazy(() => import('../tiers/TierA/ContactAgentA'));
const ContactAgentB = lazy(() => import('../tiers/TierB/ContactAgentB'));
const ContactAgentC = lazy(() => import('../tiers/TierC/ContactAgentC'));
const ContactAgentD = lazy(() => import('../tiers/TierD/ContactAgentD'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <div className="text-white text-sm">Loading...</div>
    </div>
  </div>
);

export default function ContactAgentPage() {
  const { currentTier } = useTier();

  const getTierComponent = () => {
    switch(currentTier) {
      case 'A': return ContactAgentA;
      case 'B': return ContactAgentB;
      case 'C': return ContactAgentC;
      case 'D':
      default: return ContactAgentD;
    }
  };

  const TierComponent = getTierComponent();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TierComponent />
    </Suspense>
  );
}
