// Metrics Charts Component
import React from 'react';
import { BarChart, Activity, Gauge } from 'lucide-react';

const MetricsCharts = ({ client }) => {
  if (!client || !client.metrics) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <BarChart className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">Client Metrics</h2>
        </div>
        <div className="text-center py-20 text-gray-500">
          <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Select a client to view metrics</p>
        </div>
      </div>
    );
  }

  const { metrics } = client;
  const memoryPercent = (metrics.memoryUsed / metrics.memory) * 100;

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'bg-green-500';
    if (value >= thresholds.warning) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const metricsArr = [
    {
      label: 'Battery Level',
      value: `${metrics.battery}%`,
      percent: metrics.battery,
      color: getStatusColor(metrics.battery, { good: 50, warning: 25 }),
      charging: metrics.batteryCharging
    },
    {
      label: 'CPU Score',
      value: metrics.cpuScore,
      percent: metrics.cpuScore,
      color: getStatusColor(metrics.cpuScore, { good: 60, warning: 40 }),
      cores: metrics.cpuCores
    },
    {
      label: 'FPS Performance',
      value: metrics.fps,
      percent: (metrics.fps / 60) * 100,
      color: getStatusColor(metrics.fps, { good: 45, warning: 30 })
    },
    {
      label: 'Memory Usage',
      value: `${metrics.memoryUsed} / ${metrics.memory} MB`,
      percent: memoryPercent,
      color: memoryPercent > 85 ? 'bg-red-500' : memoryPercent > 75 ? 'bg-yellow-500' : 'bg-green-500'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Gauge className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold">Environment Metrics</h2>
      </div>

      <div className="space-y-6">
        {metricsArr.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 font-medium">{metric.label}</span>
              <span className="text-white font-bold">
                {metric.value}
                {metric.charging && ' ⚡'}
                {metric.cores && ` (${metric.cores} cores)`}
              </span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${metric.color} transition-all duration-500`}
                style={{ width: `${Math.min(100, metric.percent)}%` }}
              />
            </div>
          </div>
        ))}

        {/* Network Info */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Network Type</div>
              <div className="font-bold text-lg uppercase">{metrics.networkType}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Status</div>
              <div className={`font-bold text-lg ${metrics.online ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.online ? '🟢 Online' : '🔴 Offline'}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Bandwidth</div>
              <div className="font-bold">{metrics.bandwidth} KB/s</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Downlink</div>
              <div className="font-bold">{metrics.networkDownlink} Mbps</div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Client ID:</span>
              <span className="font-mono text-gray-300">{client.clientId.substring(0, 16)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Update Count:</span>
              <span className="text-gray-300">{client.updateCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Seen:</span>
              <span className="text-gray-300">{new Date(client.lastSeen).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCharts;
