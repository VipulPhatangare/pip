// Tier Control Component
import React, { useState } from 'react';
import { Sliders, Power, RotateCcw } from 'lucide-react';

const TierControl = ({ client, onTierOverride }) => {
  const [overriding, setOverriding] = useState(false);

  const tiers = [
    { id: 'A', name: 'Tier A', color: 'bg-indigo-600 hover:bg-indigo-700', desc: 'Full Features' },
    { id: 'B', name: 'Tier B', color: 'bg-purple-600 hover:bg-purple-700', desc: 'Optimized' },
    { id: 'C', name: 'Tier C', color: 'bg-pink-600 hover:bg-pink-700', desc: 'Minimal' },
    { id: 'D', name: 'Tier D', color: 'bg-red-600 hover:bg-red-700', desc: 'Survival' }
  ];

  const handleOverride = async (tier) => {
    if (!client) {
      alert('Please select a client first');
      return;
    }

    setOverriding(true);
    try {
      await onTierOverride(client.clientId, tier);
    } finally {
      setOverriding(false);
    }
  };

  const handleResetToAuto = async () => {
    if (!client) {
      alert('Please select a client first');
      return;
    }

    setOverriding(true);
    try {
      await onTierOverride(client.clientId, 'auto');
    } finally {
      setOverriding(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Sliders className="w-6 h-6 text-orange-400" />
        <h2 className="text-xl font-bold">Tier Control</h2>
      </div>

      {!client ? (
        <div className="text-center py-8 text-gray-500">
          <Power className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a client to control tier</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current Tier Display */}
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Current Tier</div>
            <div className={`text-4xl font-bold text-center py-2 ${
              client.currentTier === 'A' ? 'text-indigo-400' :
              client.currentTier === 'B' ? 'text-purple-400' :
              client.currentTier === 'C' ? 'text-pink-400' :
              'text-red-400'
            }`}>
              {client.currentTier}
            </div>
          </div>

          {/* Auto Mode Reset */}
          <button
            onClick={handleResetToAuto}
            disabled={overriding}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              overriding
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Auto Detection
          </button>

          {/* Manual Tier Override Buttons */}
          <div className="space-y-2">
            <div className="text-sm text-gray-400 mb-2">Force Specific Tier:</div>
            <div className="grid grid-cols-2 gap-2">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => handleOverride(tier.id)}
                  disabled={overriding}
                  className={`py-3 px-4 rounded-lg font-semibold transition ${
                    overriding
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : tier.color + ' text-white'
                  } ${client.currentTier === tier.id ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  <div className="text-sm">{tier.name}</div>
                  <div className="text-xs opacity-75">{tier.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-orange-900/20 border border-orange-600 rounded-lg">
            <div className="text-xs text-orange-300">
              ⚠️ <strong>Override Mode:</strong> Manual tier selection will override automatic tier decisions until you reset to auto mode.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TierControl;
