// Dashboard Main App
import React, { useState, useEffect } from 'react';
import { Monitor, Activity, Users, Zap } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import ClientsList from './components/ClientsList';
import MetricsCharts from './components/MetricsCharts';
import TierControl from './components/TierControl';
import MetricsControl from './components/MetricsControl';
import SystemStats from './components/SystemStats';
import RepoAnalyzer from './components/RepoAnalyzer';

const BRAIN_SERVER_URL = import.meta.env.VITE_BRAIN_SERVER_URL || 'http://localhost:3001';
// Use separate WebSocket URL for Socket.IO connection (without /api path)
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    // Connect to brain server via WebSocket
    const newSocket = io(WS_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Dashboard connected to brain server');
      setConnected(true);
      fetchInitialData();
    });

    newSocket.on('disconnect', () => {
      console.log('Dashboard disconnected');
      setConnected(false);
    });

    // Listen to client events
    newSocket.on('clientConnected', (data) => {
      console.log('Client connected:', data);
      fetchClients();
    });

    newSocket.on('clientDisconnected', (data) => {
      console.log('Client disconnected:', data);
      fetchClients();
    });

    newSocket.on('metricsUpdate', (data) => {
      console.log('Metrics update:', data);
      updateClientMetrics(data);
      fetchStats();
    });

    setSocket(newSocket);

    // Polling for updates
    const interval = setInterval(() => {
      if (connected) {
        fetchClients();
        fetchStats();
      }
    }, 5000);

    return () => {
      newSocket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const fetchInitialData = async () => {
    await Promise.all([
      fetchClients(),
      fetchStats()
    ]);
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BRAIN_SERVER_URL}/clients`);
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BRAIN_SERVER_URL}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateClientMetrics = (data) => {
    setClients(prevClients => {
      const updated = prevClients.map(client =>
        client.clientId === data.clientId
          ? { ...client, metrics: data.metrics, currentTier: data.decision.tier }
          : client
      );
      
      // Add new client if not exists
      if (!updated.find(c => c.clientId === data.clientId)) {
        updated.push({
          clientId: data.clientId,
          metrics: data.metrics,
          currentTier: data.decision.tier,
          lastSeen: Date.now()
        });
      }
      
      return updated;
    });
  };

  const handleTierOverride = async (clientId, tier) => {
    try {
      await axios.post(`${BRAIN_SERVER_URL}/override`, { clientId, tier });
      await fetchClients();
    } catch (error) {
      console.error('Error setting tier override:', error);
      alert('Failed to set tier override');
    }
  };

  const handleMetricsOverride = async (clientId, metrics) => {
    try {
      await axios.post(`${BRAIN_SERVER_URL}/metrics-override`, { clientId, metrics });
      await fetchClients();
    } catch (error) {
      console.error('Error setting metrics override:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Protean Dashboard
              </h1>
              <p className="text-gray-400">Monitoring & Control Center</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 ${
            connected 
              ? 'bg-green-900/30 border-green-500 text-green-300' 
              : 'bg-red-900/30 border-red-500 text-red-300'
          }`}>
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400 pulse-glow' : 'bg-red-400'}`}></div>
            <div>
              <div className="font-bold text-lg">{connected ? 'Connected' : 'Disconnected'}</div>
              <div className="text-xs opacity-75">Brain Server</div>
            </div>
          </div>
        </div>
      </header>

      {/* System Statistics */}
      {stats && <SystemStats stats={stats} />}

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Left Column - Clients */}
        <div className="xl:col-span-1">
          <ClientsList 
            clients={clients} 
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
          />
        </div>

        {/* Middle Column - Metrics & Charts */}
        <div className="xl:col-span-1">
          <MetricsCharts 
            client={selectedClient ? clients.find(c => c.clientId === selectedClient) : null}
          />
        </div>

        {/* Right Column - Controls */}
        <div className="xl:col-span-1 space-y-6">
          <TierControl 
            client={selectedClient ? clients.find(c => c.clientId === selectedClient) : null}
            onTierOverride={handleTierOverride}
          />
          <MetricsControl 
            client={selectedClient ? clients.find(c => c.clientId === selectedClient) : null}
            onMetricsOverride={handleMetricsOverride}
          />
        </div>
      </div>

      {/* Repository Analyzer Section */}
      <div className="mt-8">
        <RepoAnalyzer />
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 text-sm border-t border-gray-800 pt-6">
        <p>Protean Interface Protocol Dashboard © 2026 | Connected to {BRAIN_SERVER_URL}</p>
      </footer>
    </div>
  );
}

export default App;
