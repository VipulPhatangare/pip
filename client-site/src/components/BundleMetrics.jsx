// Bundle Metrics Dashboard - Shows estimated bundle sizes per tier
import React from 'react';
import { Package, TrendingDown, Zap } from 'lucide-react';
import { TIERS } from '../core/tierAdapter';

const BundleMetrics = ({ currentTier }) => {
  const bundles = [
    { tier: TIERS.A, size: 500, color: 'bg-indigo-500', label: 'Tier A (Full)' },
    { tier: TIERS.B, size: 250, color: 'bg-purple-500', label: 'Tier B (Light)' },
    { tier: TIERS.C, size: 100, color: 'bg-pink-500', label: 'Tier C (Minimal)' },
    { tier: TIERS.D, size: 30, color: 'bg-red-500', label: 'Tier D (Survival)' }
  ];

  const maxSize = 500;
  const currentBundle = bundles.find(b => b.tier === currentTier);
  const savings = maxSize - (currentBundle?.size || maxSize);
  const savingsPercent = ((savings / maxSize) * 100).toFixed(0);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-bold text-white">Bundle Metrics</h3>
      </div>

      <div className="space-y-3">
        {bundles.map((bundle) => {
          const isActive = bundle.tier === currentTier;
          const widthPercent = (bundle.size / maxSize) * 100;

          return (
            <div key={bundle.tier} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {bundle.label}
                  {isActive && <span className="ml-2 text-green-400">●</span>}
                </span>
                <span className={isActive ? 'text-white' : 'text-gray-500'}>
                  {bundle.size} KB
                </span>
              </div>
              <div className="h-6 bg-gray-700 rounded-lg overflow-hidden">
                <div
                  className={`h-full ${bundle.color} ${isActive ? 'opacity-100' : 'opacity-30'} transition-all duration-500`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Savings</span>
          </div>
          <div className="text-2xl font-bold text-white">{savingsPercent}%</div>
          <div className="text-xs text-green-300">{savings} KB less</div>
        </div>

        <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400">Current</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentBundle?.size} KB</div>
          <div className="text-xs text-blue-300">Active bundle</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
        <div className="text-xs text-gray-400 mb-2">Resource Optimization:</div>
        <div className="text-sm text-gray-300">
          {currentTier === TIERS.A && "Full resources - all features loaded"}
          {currentTier === TIERS.B && "Optimized build - reduced animations"}
          {currentTier === TIERS.C && "Minimal bundle - core features only"}
          {currentTier === TIERS.D && "Survival mode - basic HTML only"}
        </div>
      </div>
    </div>
  );
};

export default BundleMetrics;
