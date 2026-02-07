// Clients List Component
import React from 'react';
import { Users, Circle } from 'lucide-react';

const ClientsList = ({ clients, selectedClient, onSelectClient }) => {
  const getTierColor = (tier) => {
    const colors = {
      'A': 'text-indigo-400 bg-indigo-900/30 border-indigo-600',
      'B': 'text-purple-400 bg-purple-900/30 border-purple-600',
      'C': 'text-pink-400 bg-pink-900/30 border-pink-600',
      'D': 'text-red-400 bg-red-900/30 border-red-600'
    };
    return colors[tier] || colors['A'];
  };

  const isActive = (client) => {
    return Date.now() - client.lastSeen < 10000;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold">Connected Clients</h2>
        <span className="ml-auto bg-cyan-900/50 text-cyan-300 px-3 py-1 rounded-full text-sm font-semibold">
          {clients.length}
        </span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {clients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No clients connected</p>
            <p className="text-sm mt-1">Waiting for client connections...</p>
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.clientId}
              onClick={() => onSelectClient(client.clientId)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedClient === client.clientId
                  ? 'bg-cyan-900/30 border-cyan-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Circle 
                      className={`w-2 h-2 ${isActive(client) ? 'text-green-400 fill-green-400' : 'text-gray-600 fill-gray-600'}`}
                    />
                    <span className="font-mono text-sm text-gray-300">
                      {client.clientId.substring(0, 12)}...
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {isActive(client) ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className={`tier-badge ${getTierColor(client.currentTier)}`}>
                  Tier {client.currentTier}
                </div>
              </div>

              {client.metrics && (
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <div className="text-gray-400">Battery</div>
                    <div className="font-bold">{client.metrics.battery}%</div>
                  </div>
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <div className="text-gray-400">FPS</div>
                    <div className="font-bold">{client.metrics.fps}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <div className="text-gray-400">Network</div>
                    <div className="font-bold uppercase text-xs">{client.metrics.networkType}</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientsList;
