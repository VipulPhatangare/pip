// Tier-aware Book Visit Page with Code Splitting
import React, { lazy, Suspense } from 'react';
import { useTier } from '../../context/TierContext';

// Lazy load tier-specific components for code splitting
const BookVisitA = lazy(() => import('../tiers/TierA/BookVisitA'));
const BookVisitB = lazy(() => import('../tiers/TierB/BookVisitB'));
const BookVisitC = lazy(() => import('../tiers/TierC/BookVisitC'));
const BookVisitD = lazy(() => import('../tiers/TierD/BookVisitD'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <div className="text-white text-sm">Loading...</div>
    </div>
  </div>
);

export default function BookVisitPage() {
  const { currentTier } = useTier();

  const getTierComponent = () => {
    switch(currentTier) {
      case 'A': return BookVisitA;
      case 'B': return BookVisitB;
      case 'C': return BookVisitC;
      case 'D':
      default: return BookVisitD;
    }
  };

  const TierComponent = getTierComponent();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TierComponent />
    </Suspense>
  );
}
