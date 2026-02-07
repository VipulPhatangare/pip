// Transition Preview Toast - Non-intrusive tier change notification
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const TransitionToast = ({ 
  proposedTier, 
  currentTier, 
  reason, 
  onAccept, 
  onReject, 
  onPreview,
  countdownSeconds = 10 
}) => {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-accept after countdown
      handleAccept();
    }
  }, [countdown]);

  const handleAccept = () => {
    setIsVisible(false);
    setTimeout(() => onAccept(), 300);
  };

  const handleReject = () => {
    setIsVisible(false);
    setTimeout(() => onReject(), 300);
  };

  const getTierInfo = (tier) => {
    const info = {
      'A': { name: 'Full Experience', emoji: '✨', color: '#10b981' },
      'B': { name: 'Optimized Mode', emoji: '⚡', color: '#3b82f6' },
      'C': { name: 'Minimal Mode', emoji: '🔋', color: '#f59e0b' },
      'D': { name: 'Survival Mode', emoji: '🛡️', color: '#ef4444' }
    };
    return info[tier] || info['A'];
  };

  const currentInfo = getTierInfo(currentTier);
  const proposedInfo = getTierInfo(proposedTier);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        maxWidth: '500px',
        width: '90%',
        animation: 'slideDown 300ms ease-out forwards'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          color: 'white',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>{proposedInfo.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              Switching to {proposedInfo.name}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>
              {reason}
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            {countdown}
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: '4px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'white',
              width: `${(countdown / countdownSeconds) * 100}%`,
              transition: 'width 1s linear',
              borderRadius: '2px'
            }}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleAccept}
            style={{
              flex: '1',
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
              minWidth: '100px'
            }}
            onMouseEnter={(e) => e.target.style.background = 'white'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.95)'}
          >
            Switch Now
          </button>

          {onPreview && (
            <button
              onClick={onPreview}
              style={{
                flex: '1',
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s',
                minWidth: '100px'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              Preview
            </button>
          )}

          <button
            onClick={handleReject}
            style={{
              flex: '1',
              padding: '10px 16px',
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
              minWidth: '100px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
          >
            Keep Current
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-120%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TransitionToast;
