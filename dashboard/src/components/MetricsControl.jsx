// Metrics Control Component - Manual override for testing
import React, { useState } from 'react';
import { Sliders, Zap, Battery, Cpu, Activity, Wifi, RefreshCw } from 'lucide-react';

const MetricsControl = ({ client, onMetricsOverride }) => {
  const [overriding, setOverriding] = useState(false);
  const [metrics, setMetrics] = useState({
    battery: 100,
    batteryCharging: true,
    cpuScore: 100,
    fps: 60,
    memory: 4096,
    memoryUsed: 1024,
    networkType: '4g',
    online: true
  });

  const handleMetricChange = (key, value) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyOverride = async () => {
    if (!client) {
      alert('Please select a client first');
      return;
    }

    setOverriding(true);
    try {
      await onMetricsOverride(client.clientId, metrics);
      alert('✅ Metrics override applied successfully!');
    } catch (error) {
      alert('❌ Failed to apply metrics override');
    } finally {
      setOverriding(false);
    }
  };

  const handleReset = async () => {
    if (!client) {
      alert('Please select a client first');
      return;
    }

    if (!confirm('Reset all metrics to automatic detection?')) {
      return;
    }

    setOverriding(true);
    try {
      await onMetricsOverride(client.clientId, null); // null = reset
      alert('✅ Metrics reset to automatic detection');
    } catch (error) {
      alert('❌ Failed to reset metrics');
    } finally {
      setOverriding(false);
    }
  };

  const presets = [
    {
      name: 'High-End Device',
      icon: '🚀',
      metrics: { battery: 90, batteryCharging: false, cpuScore: 95, fps: 60, memory: 8192, memoryUsed: 2048, networkType: '5g', online: true }
    },
    {
      name: 'Mid-Range Device',
      icon: '📱',
      metrics: { battery: 60, batteryCharging: false, cpuScore: 60, fps: 45, memory: 4096, memoryUsed: 2048, networkType: '4g', online: true }
    },
    {
      name: 'Low-End Device',
      icon: '📉',
      metrics: { battery: 30, batteryCharging: false, cpuScore: 30, fps: 25, memory: 2048, memoryUsed: 1536, networkType: '3g', online: true }
    },
    {
      name: 'Critical Battery',
      icon: '🔋',
      metrics: { battery: 8, batteryCharging: false, cpuScore: 50, fps: 40, memory: 4096, memoryUsed: 2048, networkType: '4g', online: true }
    },
    {
      name: 'Offline Mode',
      icon: '✈️',
      metrics: { battery: 50, batteryCharging: false, cpuScore: 60, fps: 45, memory: 4096, memoryUsed: 2048, networkType: 'offline', online: false }
    },
    {
      name: 'Charging',
      icon: '⚡',
      metrics: { battery: 45, batteryCharging: true, cpuScore: 80, fps: 60, memory: 4096, memoryUsed: 2048, networkType: '4g', online: true }
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Sliders className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold">Metrics Control</h2>
      </div>

      {!client ? (
        <div className="text-center py-8 text-gray-500">
          <Sliders className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a client to control metrics</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Presets */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-semibold">Quick Presets:</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setMetrics(preset.metrics)}
                  disabled={overriding}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{preset.icon}</span>
                    <span className="text-white">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Battery Controls */}
          <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Battery className="w-5 h-5" />
              <span className="font-semibold">Battery</span>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-gray-400">Level:</label>
                <span className="text-white font-bold">{metrics.battery}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={metrics.battery}
                onChange={(e) => handleMetricChange('battery', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Charging:</label>
              <button
                onClick={() => handleMetricChange('batteryCharging', !metrics.batteryCharging)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  metrics.batteryCharging
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {metrics.batteryCharging ? '⚡ Charging' : '🔌 Not Charging'}
              </button>
            </div>
          </div>

          {/* CPU Score */}
          <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Cpu className="w-5 h-5" />
              <span className="font-semibold">CPU Performance</span>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-gray-400">CPU Score:</label>
                <span className="text-white font-bold">{metrics.cpuScore}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={metrics.cpuScore}
                onChange={(e) => handleMetricChange('cpuScore', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* FPS */}
          <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Activity className="w-5 h-5" />
              <span className="font-semibold">Frame Rate</span>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-gray-400">FPS:</label>
                <span className="text-white font-bold">{metrics.fps}</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={metrics.fps}
                onChange={(e) => handleMetricChange('fps', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Memory */}
          <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Memory</span>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-gray-400">Total:</label>
                <span className="text-white">{metrics.memory} MB</span>
              </div>
              <input
                type="range"
                min="1024"
                max="16384"
                step="1024"
                value={metrics.memory}
                onChange={(e) => handleMetricChange('memory', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-gray-400">Used:</label>
                <span className="text-white">{metrics.memoryUsed} MB ({Math.round((metrics.memoryUsed / metrics.memory) * 100)}%)</span>
              </div>
              <input
                type="range"
                min="512"
                max={metrics.memory}
                step="256"
                value={metrics.memoryUsed}
                onChange={(e) => handleMetricChange('memoryUsed', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Network */}
          <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Wifi className="w-5 h-5" />
              <span className="font-semibold">Network</span>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Type:</label>
              <div className="grid grid-cols-3 gap-2">
                {['5g', '4g', '3g', '2g', 'slow-2g', 'offline'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleMetricChange('networkType', type)}
                    className={`py-2 rounded-lg text-xs font-bold transition ${
                      metrics.networkType === type
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Online Status:</label>
              <button
                onClick={() => handleMetricChange('online', !metrics.online)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  metrics.online
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {metrics.online ? '🟢 Online' : '🔴 Offline'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleApplyOverride}
              disabled={overriding}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                overriding
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {overriding ? 'Applying...' : '✅ Apply Override'}
            </button>

            <button
              onClick={handleReset}
              disabled={overriding}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                overriding
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title="Reset to automatic detection"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Warning */}
          <div className="p-3 bg-orange-900/20 border border-orange-600 rounded-lg">
            <div className="text-xs text-orange-300">
              ⚠️ <strong>Manual Override:</strong> These settings will override real device metrics until you reset to automatic detection.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsControl;
