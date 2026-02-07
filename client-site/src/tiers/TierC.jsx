// Tier C - Minimal Mode - ESSENTIAL FUNCTIONALITY ONLY (Fast Loading)
import React from 'react';
import { useFormStore } from '../store/formStore';

const TierC = ({ intent, metrics }) => {
  const { updateField, getFormData } = useFormStore();
  const formData = getFormData(intent.id);

  const handleInputChange = (fieldId, value) => {
    updateField(intent.id, fieldId, value);
  };

  // Render form intent - minimal styling, no animations
  const renderForm = () => (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Minimal card - no shadows, no gradients */}
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '20px', 
          border: '1px solid #334155',
          borderRadius: '4px'
        }}>
          
          {/* Simple header - no icons, no animations */}
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ 
              color: '#f1f5f9',
              fontSize: '20px',
              fontWeight: 'bold',
              margin: '0 0 8px 0'
            }}>
              {intent.title}
            </h2>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '14px',
              margin: 0 
            }}>
              {intent.description}
            </p>
          </div>

          {/* Form fields - bare minimum styling */}
          <div>
            {intent.fields.map((field) => (
              <div key={field.id} style={{ marginBottom: '14px' }}>
                <label style={{ 
                  display: 'block',
                  color: '#cbd5e1',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  {field.label}{field.required && ' *'}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    rows={field.rows || 2}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #475569',
                      borderRadius: '2px',
                      color: '#f1f5f9',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#475569'}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #475569',
                      borderRadius: '2px',
                      color: '#f1f5f9',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#475569'}
                  >
                    <option value="">Select</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #475569',
                      borderRadius: '2px',
                      color: '#f1f5f9',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#475569'}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Action buttons - simple design */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {intent.actions?.map(action => (
              <button
                key={action.id}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: action.type === 'primary' ? '#8b5cf6' : '#475569',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  outline: 'none'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = action.type === 'primary' ? '#7c3aed' : '#3f4f5e';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = action.type === 'primary' ? '#8b5cf6' : '#475569';
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        backgroundColor: '#1e293b',
        padding: '8px 12px',
        border: '1px solid #475569',
        borderRadius: '2px'
      }}>
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '12px', 
          fontWeight: 'bold',
          margin: 0 
        }}>
          ⚡ TIER C: Minimal
        </p>
        <p style={{ 
          color: '#64748b', 
          fontSize: '10px',
          margin: 0 
        }}>
          Bundle: ~100KB | No Animations
        </p>
      </div>
    </div>
  );

  // Render dashboard intent
  const renderDashboard = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">{intent.title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {intent.widgets.map((widget) => {
          const value = metrics[widget.valueKey];
          const secondaryValue = widget.secondaryKey ? metrics[widget.secondaryKey] : null;
          
          return (
            <div
              key={widget.id}
              className="bg-gray-900 p-3 rounded border border-gray-700"
            >
              <div className="text-xs text-gray-400 mb-1">{widget.label}</div>
              <div className="text-2xl font-bold text-white">
                {value}
                {widget.unit && <span className="text-sm text-gray-500 ml-1">{widget.unit}</span>}
              </div>
              {secondaryValue && (
                <div className="text-xs text-gray-500">/ {secondaryValue}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render based on intent type
  switch (intent.type) {
    case 'form':
      return renderForm();
    case 'dashboard':
      return renderDashboard();
    default:
      return renderForm();
  }
};

export default TierC;
