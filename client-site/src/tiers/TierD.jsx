// Tier D - Survival Mode - PLAIN HTML ONLY (Extreme Compatibility & Offline)
import React from 'react';
import { useFormStore } from '../store/formStore';

const TierD = ({ intent, metrics }) => {
  const { updateField, getFormData } = useFormStore();
  const formData = getFormData(intent.id);

  const handleInputChange = (fieldId, value) => {
    updateField(intent.id, fieldId, value);
  };

  // Render form intent - PURE INLINE STYLES ONLY (no CSS classes, no external stylesheets dependency)
  const renderForm = () => (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000',
      padding: '10px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* Plain HTML card - maximum compatibility */}
        <div style={{ 
          backgroundColor: '#1a1a1a', 
          padding: '15px', 
          border: '1px solid #333333'
        }}>
          
          {/* Plain text header - no decorations */}
          <div style={{ marginBottom: '12px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
            <h2 style={{ 
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '0 0 6px 0'
            }}>
              {intent.title}
            </h2>
            <p style={{ 
              color: '#999999', 
              fontSize: '13px',
              margin: 0,
              lineHeight: '1.4'
            }}>
              {intent.description}
            </p>
          </div>

          {/* Form fields - absolute minimum styling */}
          <div>
            {intent.fields.map((field) => (
              <div key={field.id} style={{ marginBottom: '12px' }}>
                <label style={{ 
                  display: 'block',
                  color: '#cccccc',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '3px'
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
                      padding: '6px',
                      backgroundColor: '#000000',
                      border: '1px solid #444444',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      backgroundColor: '#000000',
                      border: '1px solid #444444',
                      color: '#ffffff',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
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
                      padding: '6px',
                      backgroundColor: '#000000',
                      border: '1px solid #444444',
                      color: '#ffffff',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Action buttons - browser default look */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '15px', borderTop: '1px solid #333', paddingTop: '12px' }}>
            {intent.actions?.map(action => (
              <button
                key={action.id}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: action.type === 'primary' ? '#cc0000' : '#333333',
                  color: '#ffffff',
                  border: '1px solid ' + (action.type === 'primary' ? '#ff0000' : '#555555'),
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Offline indicator */}
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#0a0a0a',
            border: '1px solid #444444',
            borderLeft: '3px solid #cc0000'
          }}>
            <p style={{ 
              color: '#888888', 
              fontSize: '11px',
              margin: 0,
              lineHeight: '1.4'
            }}>
              <strong style={{ color: '#ffffff' }}>SURVIVAL MODE:</strong> This interface uses minimal resources and works offline. All data is preserved.
            </p>
          </div>
        </div>
      </div>

      {/* Performance Indicator - Plain HTML */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: '#1a1a1a',
        padding: '6px 10px',
        border: '1px solid #cc0000',
        maxWidth: '200px'
      }}>
        <p style={{ 
          color: '#ffffff', 
          fontSize: '11px', 
          fontWeight: 'bold',
          margin: '0 0 2px 0'
        }}>
          ⚠ TIER D: Survival
        </p>
        <p style={{ 
          color: '#888888', 
          fontSize: '9px',
          margin: 0 
        }}>
          Bundle: ~30KB | Offline Ready | No CSS Dependencies
        </p>
      </div>
    </div>
  );

  // Render dashboard intent - plain HTML
  const renderDashboard = () => (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '10px' }}>
      <h2 style={{ color: '#fff', margin: '0 0 15px 0', fontSize: '20px' }}>
        {intent.title}
      </h2>

      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        backgroundColor: '#1a1a1a',
        color: '#fff'
      }}>
        <tbody>
          {intent.widgets.map((widget) => {
            const value = metrics[widget.valueKey];
            const secondaryValue = widget.secondaryKey ? metrics[widget.secondaryKey] : null;
            
            return (
              <tr key={widget.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '10px', fontSize: '13px', color: '#999' }}>
                  {widget.label}
                </td>
                <td style={{ padding: '10px', fontSize: '16px', fontWeight: 'bold', textAlign: 'right' }}>
                  {value}{widget.unit}
                  {secondaryValue && (
                    <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>
                      / {secondaryValue}{widget.unit}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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

export default TierD;
