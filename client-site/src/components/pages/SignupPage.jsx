// Tier-aware Signup Page with Code Splitting
import React, { lazy, Suspense } from 'react';
import { useTier } from '../../context/TierContext';

// Lazy load tier-specific components for code splitting
const SignupA = lazy(() => import('../tiers/TierA/SignupA'));
const SignupB = lazy(() => import('../tiers/TierB/SignupB'));
const SignupC = lazy(() => import('../tiers/TierC/SignupC'));
const SignupD = lazy(() => import('../tiers/TierD/SignupD'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <div className="text-white text-sm">Loading...</div>
    </div>
  </div>
);

export default function SignupPage() {
  const { currentTier } = useTier();

  const getTierComponent = () => {
    switch(currentTier) {
      case 'A': return SignupA;
      case 'B': return SignupB;
      case 'C': return SignupC;
      case 'D':
      default: return SignupD;
    }
  };

  const TierComponent = getTierComponent();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TierComponent />
    </Suspense>
  );
}
