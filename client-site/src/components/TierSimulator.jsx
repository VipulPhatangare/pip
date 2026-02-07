// Tier Simulator Component - Manual tier control for demo
import React, { useState, useEffect } from 'react';
import { Power, Radio } from 'lucide-react';
import { tierAdapter, TIERS } from '../core/tierAdapter';
import { useLogStore } from '../store/logStore';

const TierSimulator = ({ currentTier }) => {
  const [autoMode, setAutoMode] = useState(true);
  const { logInfo } = useLogStore();

  const handleTierChange = (tier) => {
    if (tier === 'auto') {
      setAutoMode(true);
      tierAdapter.clearManualOverride();
      logInfo('Tier simulator: Auto mode enabled');
    } else {
      setAutoMode(false);
      tierAdapter.setManualOverride(tier);
      logInfo(`Tier simulator: Manual override to Tier ${tier}`);
    }
  };

  const tiers = [
    { id: TIERS.A, name: 'Tier A', color: 'bg-indigo-600', desc: 'Abundance' },
    { id: TIERS.B, name: 'Tier B', color: 'bg-purple-600', desc: 'Constraint' },
    { id: TIERS.C, name: 'Tier C', color: 'bg-pink-600', desc: 'Minimal' },
    { id: TIERS.D, name: 'Tier D', color: 'bg-red-600', desc: 'Survival' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">Tier Simulator</h3>
        <span className="text-xs text-gray-400">(Demo Control)</span>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleTierChange('auto')}
          className={`w-full py-2 px-3 rounded-lg font-semibold transition ${
            autoMode
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Power className="w-4 h-4" />
            Auto Detection {autoMode && '✓'}
          </div>
        </button>

        <div className="grid grid-cols-2 gap-2">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => handleTierChange(tier.id)}
              className={`py-2 px-3 rounded-lg font-semibold transition ${
                !autoMode && currentTier === tier.id
                  ? `${tier.color} text-white ring-2 ring-yellow-400`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-sm">{tier.name}</div>
              <div className="text-xs opacity-75">{tier.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
        <div className="text-xs text-gray-400 mb-1">Current Active Tier:</div>
        <div className="text-xl font-bold text-white">
          Tier {currentTier}
          {autoMode && <span className="text-sm text-green-400 ml-2">(Auto)</span>}
        </div>
      </div>
    </div>
  );
};

export default TierSimulator;
