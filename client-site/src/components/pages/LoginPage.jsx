// Tier-aware Login Page with Code Splitting
import React, { lazy, Suspense } from 'react';
import { useTier } from '../../context/TierContext';

// Lazy load tier-specific components for code splitting
const LoginA = lazy(() => import('../tiers/TierA/LoginA'));
const LoginB = lazy(() => import('../tiers/TierB/LoginB'));
const LoginC = lazy(() => import('../tiers/TierC/LoginC'));
const LoginD = lazy(() => import('../tiers/TierD/LoginD'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <div className="text-white text-sm">Loading...</div>
    </div>
  </div>
);

export default function LoginPage() {
  const { currentTier } = useTier();

  const getTierComponent = () => {
    switch(currentTier) {
      case 'A': return LoginA;
      case 'B': return LoginB;
      case 'C': return LoginC;
      case 'D':
      default: return LoginD;
    }
  };

  const TierComponent = getTierComponent();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TierComponent />
    </Suspense>
  );
}
