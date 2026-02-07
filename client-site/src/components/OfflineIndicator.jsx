// Offline Status Indicator - Connection status badge
import React, { useState, useEffect } from 'react';

export const OfflineIndicator = ({ isOnline, currentTier }) => {
  const [isVisible, setIsVisible] = useState(!isOnline);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    setIsVisible(!isOnline);
    if (!isOnline) {
      // Simulate reconnection attempts
      const interval = setInterval(() => {
        setReconnectAttempts(prev => prev + 1);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setReconnectAttempts(0);
    }
  }, [isOnline]);

  if (!isVisible && isOnline) return null;

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: '🔴',
        text: currentTier === 'D' ? 'Offline | Survival Mode Active' : 'Reconnecting...',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#ef4444'
      };
    }
    return {
      icon: '🟢',
      text: 'Connected | Optimal Mode',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10b981'
    };
  };

  const config = getStatusConfig();

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9998,
        animation: 'slideInRight 300ms ease-out forwards'
      }}
    >
      <div
        style={{
          background: config.bgColor,
          border: `2px solid ${config.borderColor}`,
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          minWidth: '200px'
        }}
      >
        <span style={{ fontSize: '18px' }}>{config.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: '600', 
            fontSize: '14px', 
            color: config.color,
            marginBottom: '2px'
          }}>
            {config.text}
          </div>
          {!isOnline && reconnectAttempts > 0 && (
            <div style={{ 
              fontSize: '11px', 
              color: '#666',
              opacity: 0.8
            }}>
              Attempt {reconnectAttempts}...
            </div>
          )}
        </div>
        {!isOnline && (
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: '2px solid ' + config.color,
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite'
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default OfflineIndicator;
