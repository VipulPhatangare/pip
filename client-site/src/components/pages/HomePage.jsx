// Tier-aware Home Page with Code Splitting
import React, { lazy, Suspense } from 'react';
import { useTier } from '../../context/TierContext';

// Lazy load tier-specific components for code splitting
const HomeA = lazy(() => import('../tiers/TierA/HomeA'));
const HomeB = lazy(() => import('../tiers/TierB/HomeB'));
const HomeC = lazy(() => import('../tiers/TierC/HomeC'));
const HomeD = lazy(() => import('../tiers/TierD/HomeD'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <div className="text-white text-sm">Loading...</div>
    </div>
  </div>
);

export default function HomePage() {
  const { currentTier } = useTier();

  const getTierComponent = () => {
    switch(currentTier) {
      case 'A': return HomeA;
      case 'B': return HomeB;
      case 'C': return HomeC;
      case 'D':
      default: return HomeD;
    }
  };

  const TierComponent = getTierComponent();
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TierComponent />
    </Suspense>
  );
}
