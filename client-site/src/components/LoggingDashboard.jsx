// Logging Dashboard - Real-time decision and event logging
import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, Download } from 'lucide-react';
import { useLogStore, LOG_TYPES } from '../store/logStore';

const LoggingDashboard = () => {
  const { logs, clearLogs, getLogStats } = useLogStore();
  const logContainerRef = useRef(null);
  const stats = getLogStats();

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case LOG_TYPES.TIER_CHANGE:
        return 'border-yellow-500 text-yellow-300';
      case LOG_TYPES.METRIC_CHANGE:
        return 'border-blue-500 text-blue-300';
      case LOG_TYPES.INTENT_CHANGE:
        return 'border-purple-500 text-purple-300';
      case LOG_TYPES.WARNING:
        return 'border-orange-500 text-orange-300';
      case LOG_TYPES.ERROR:
        return 'border-red-500 text-red-300';
      default:
        return 'border-green-500 text-green-300';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case LOG_TYPES.TIER_CHANGE:
        return '🔄';
      case LOG_TYPES.METRIC_CHANGE:
        return '📊';
      case LOG_TYPES.INTENT_CHANGE:
        return '🎯';
      case LOG_TYPES.WARNING:
        return '⚠️';
      case LOG_TYPES.ERROR:
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protean-logs-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Event Log</h3>
          <span className="px-2 py-1 bg-cyan-900 text-cyan-300 text-xs rounded-full">
            {logs.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-1 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700 transition"
            title="Export logs"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearLogs}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 bg-yellow-900/30 border border-yellow-700 rounded text-center">
          <div className="text-xs text-yellow-400">Tier Changes</div>
          <div className="text-lg font-bold text-white">{stats.byType.tierChange}</div>
        </div>
        <div className="p-2 bg-blue-900/30 border border-blue-700 rounded text-center">
          <div className="text-xs text-blue-400">Metrics</div>
          <div className="text-lg font-bold text-white">{stats.byType.metricChange}</div>
        </div>
        <div className="p-2 bg-red-900/30 border border-red-700 rounded text-center">
          <div className="text-xs text-red-400">Errors</div>
          <div className="text-lg font-bold text-white">{stats.byType.error}</div>
        </div>
      </div>

      {/* Log Entries */}
      <div
        ref={logContainerRef}
        className="h-64 overflow-y-auto bg-gray-900 rounded border border-gray-700 p-2 space-y-1 font-mono"
      >
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No logs yet. Events will appear here.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`log-entry ${getLogColor(log.type)} text-xs`}
            >
              <span className="text-gray-500">[{log.displayTime}]</span>
              <span className="ml-2">{getLogIcon(log.type)}</span>
              <span className="ml-2">{log.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Live indicator */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live monitoring active</span>
        </div>
        <div>Total: {stats.total} events</div>
      </div>
    </div>
  );
};

export default LoggingDashboard;
