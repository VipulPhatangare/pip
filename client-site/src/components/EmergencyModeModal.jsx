// Emergency Mode Explanation - Clear messaging for Tier D
import React from 'react';

export const EmergencyModeModal = ({ batteryLevel, onDismiss, onCharge }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        animation: 'fadeIn 300ms ease-out'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          color: 'white',
          boxShadow: '0 20px 60px rgba(220, 38, 38, 0.4)',
          animation: 'slideUp 400ms ease-out',
          border: '3px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '64px',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            ⚠️
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          Emergency Battery Saver Active
        </h2>

        {/* Battery level */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            marginBottom: '20px',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '4px' }}>
            🔋 {batteryLevel}%
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Battery critically low
          </div>
        </div>

        {/* Explanation */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            fontSize: '14px',
            lineHeight: '1.6'
          }}
        >
          <p style={{ marginBottom: '12px' }}>
            <strong>We've switched to survival mode</strong> to help you complete your task
            before your device shuts down.
          </p>

          <div style={{ marginBottom: '12px' }}>
            <strong>What's different:</strong>
          </div>
          <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
            <li>Text-only interface (no images)</li>
            <li>No animations or effects</li>
            <li>Minimal resource usage</li>
            <li>Works even offline</li>
          </ul>

          <p
            style={{
              color: '#fbbf24',
              fontWeight: '600',
              fontSize: '15px',
              textAlign: 'center'
            }}
          >
            ✅ All features still work!
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onDismiss}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#dc2626',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.target.style.background = 'white')}
            onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.9)')}
          >
            Understood
          </button>

          {onCharge && (
            <button
              onClick={onCharge}
              style={{
                flex: 1,
                padding: '14px 20px',
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
            >
              Charge Device
            </button>
          )}
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '12px',
            opacity: 0.8
          }}
        >
          Normal interface will return when battery is sufficient
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default EmergencyModeModal;
