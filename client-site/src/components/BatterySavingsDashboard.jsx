// Battery Savings Dashboard - Show users how much battery they saved
import React, { useState, useEffect } from 'react';

export const BatterySavingsDashboard = ({ tierHistory = [], currentBattery = 100 }) => {
  const [savingsData, setSavingsData] = useState({
    tierTimeSpent: { A: 0, B: 0, C: 0, D: 0 },
    estimatedUsage: 0,
    estimatedSaved: 0,
    currentSession: 0
  });

  // Battery consumption rates (% per minute)
  const CONSUMPTION_RATES = {
    A: 0.67, // Heavy animations, full features
    B: 0.39, // Optimized animations
    C: 0.20, // Minimal UI
    D: 0.10  // Survival mode
  };

  useEffect(() => {
    // Calculate time spent in each tier
    const tierTimeSpent = { A: 0, B: 0, C: 0, D: 0 };
    let totalMinutes = 0;
    let estimatedUsage = 0;
    
    // Simple calculation: assume each tier was used for equal time
    // In production, track actual timestamps
    tierHistory.forEach(tier => {
      tierTimeSpent[tier] = (tierTimeSpent[tier] || 0) + 1;
      totalMinutes += 1;
    });

    // Calculate estimated battery usage
    Object.keys(tierTimeSpent).forEach(tier => {
      const minutes = tierTimeSpent[tier];
      estimatedUsage += minutes * CONSUMPTION_RATES[tier];
    });

    // Calculate how much would have been used if always Tier A
    const alwaysTierAUsage = totalMinutes * CONSUMPTION_RATES.A;
    const estimatedSaved = alwaysTierAUsage - estimatedUsage;

    setSavingsData({
      tierTimeSpent,
      estimatedUsage: estimatedUsage.toFixed(1),
      estimatedSaved: Math.max(0, estimatedSaved).toFixed(1),
      currentSession: totalMinutes
    });
  }, [tierHistory]);

  const getTierColor = (tier) => {
    const colors = {
      A: '#10b981',
      B: '#3b82f6',
      C: '#f59e0b',
      D: '#ef4444'
    };
    return colors[tier] || '#6b7280';
  };

  const getTierEmoji = (tier) => {
    const emojis = {
      A: '✨',
      B: '⚡',
      C: '🔋',
      D: '🛡️'
    };
    return emojis[tier] || '📊';
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        maxWidth: '600px',
        margin: '20px auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚡</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Battery Savings This Session
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>
          See how Protean is helping extend your battery life
        </p>
      </div>

      {/* Main savings metric */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '24px',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
          ~{savingsData.estimatedSaved}%
        </div>
        <div style={{ fontSize: '16px', opacity: 0.9 }}>Battery Saved! 🎉</div>
      </div>

      {/* Time spent in each tier */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Time spent in each tier:
        </div>
        
        {Object.entries(savingsData.tierTimeSpent).map(([tier, count]) => {
          if (count === 0) return null;
          
          const minutes = count; // In production, calculate actual minutes
          const usage = (minutes * CONSUMPTION_RATES[tier]).toFixed(1);
          
          return (
            <div
              key={tier}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{getTierEmoji(tier)}</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>
                    Tier {tier}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    {minutes} transitions
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>
                  ~{usage}%
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>used</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '13px'
        }}
      >
        <div style={{ marginBottom: '8px', opacity: 0.9 }}>
          <strong>Without Protean:</strong> Would've used ~
          {(savingsData.currentSession * CONSUMPTION_RATES.A).toFixed(1)}% battery
        </div>
        <div style={{ opacity: 0.9 }}>
          <strong>With Protean:</strong> Only used ~{savingsData.estimatedUsage}% battery!
        </div>
      </div>

      {/* Current battery level */}
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          opacity: 0.8
        }}
      >
        <span>Current Battery:</span>
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
          🔋 {currentBattery}%
        </span>
      </div>
    </div>
  );
};

export default BatterySavingsDashboard;
