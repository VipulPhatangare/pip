// Tier-aware Property Details Page with Code Splitting
import React, { lazy, Suspense } from 'react';
import { useTier } from '../../context/TierContext';

// Lazy load tier-specific components for code splitting
const PropertyDetailsA = lazy(() => import('../tiers/TierA/PropertyDetailsA'));
const PropertyDetailsB = lazy(() => import('../tiers/TierB/PropertyDetailsB'));
const PropertyDetailsC = lazy(() => import('../tiers/TierC/PropertyDetailsC'));
const PropertyDetailsD = lazy(() => import('../tiers/TierD/PropertyDetailsD'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <div className="text-white text-sm">Loading...</div>
    </div>
  </div>
);

export default function PropertyDetailsPage() {
  const { currentTier } = useTier();

  const getTierComponent = () => {
    switch(currentTier) {
      case 'A': return PropertyDetailsA;
      case 'B': return PropertyDetailsB;
      case 'C': return PropertyDetailsC;
      case 'D':
      default: return PropertyDetailsD;
    }
  };

  const TierComponent = getTierComponent();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TierComponent />
    </Suspense>
  );
}
