// System Statistics Component
import React from 'react';
import { Activity, TrendingUp, Zap } from 'lucide-react';

const SystemStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Clients',
      value: stats.totalClients,
      icon: Activity,
      color: 'text-cyan-400 bg-cyan-900/30',
      border: 'border-cyan-600'
    },
    {
      label: 'Active Clients',
      value: stats.activeClients,
      icon: Zap,
      color: 'text-green-400 bg-green-900/30',
      border: 'border-green-600'
    },
    {
      label: 'Total Decisions',
      value: stats.totalDecisions,
      icon: TrendingUp,
      color: 'text-purple-400 bg-purple-900/30',
      border: 'border-purple-600'
    }
  ];

  const tierDistribution = stats.tierDistribution || { A: 0, B: 0, C: 0, D: 0 };
  const totalInTiers = Object.values(tierDistribution).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.color} rounded-xl p-6 border-2 ${stat.border}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-75 mb-1">{stat.label}</div>
                  <div className="text-4xl font-bold">{stat.value}</div>
                </div>
                <Icon className="w-12 h-12 opacity-50" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier Distribution */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Tier Distribution
        </h3>
        
        <div className="grid grid-cols-4 gap-4">
          {['A', 'B', 'C', 'D'].map((tier) => {
            const count = tierDistribution[tier] || 0;
            const percent = totalInTiers > 0 ? (count / totalInTiers * 100).toFixed(0) : 0;
            const colors = {
              'A': 'bg-indigo-600 text-indigo-100 border-indigo-500',
              'B': 'bg-purple-600 text-purple-100 border-purple-500',
              'C': 'bg-pink-600 text-pink-100 border-pink-500',
              'D': 'bg-red-600 text-red-100 border-red-500'
            };

            return (
              <div
                key={tier}
                className={`${colors[tier]} rounded-lg p-4 border-2 text-center`}
              >
                <div className="text-3xl font-bold mb-1">{count}</div>
                <div className="text-sm opacity-90 mb-2">Tier {tier}</div>
                <div className="text-xs opacity-75">{percent}%</div>
              </div>
            );
          })}
        </div>

        {/* Visual Bar */}
        {totalInTiers > 0 && (
          <div className="mt-4 h-4 bg-gray-800 rounded-full overflow-hidden flex">
            {['A', 'B', 'C', 'D'].map((tier) => {
              const count = tierDistribution[tier] || 0;
              const percent = (count / totalInTiers * 100);
              const bgColors = {
                'A': 'bg-indigo-500',
                'B': 'bg-purple-500',
                'C': 'bg-pink-500',
                'D': 'bg-red-500'
              };

              return percent > 0 ? (
                <div
                  key={tier}
                  className={`${bgColors[tier]} h-full transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                />
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStats;
