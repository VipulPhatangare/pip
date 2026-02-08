// Tier D - Survival Mode: Contact Agent
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';
import { useFormStore } from '../../../store/formStore';

export default function ContactAgentD() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  
  // Use formStore for persistence across tier changes
  const { getFormData, updateField } = useFormStore();
  const formId = `contactAgent-${id}`;
  const savedData = getFormData(formId);
  
  const [formData, setFormData] = useState({
    name: savedData.name || '',
    email: savedData.email || '',
    phone: savedData.phone || '',
    subject: savedData.subject || 'General Inquiry',
    message: savedData.message || '',
    preferredContact: savedData.preferredContact || 'email'
  });
  
  // Sync formData with formStore on every change
  useEffect(() => {
    Object.keys(formData).forEach(key => {
      updateField(formId, key, formData[key]);
    });
  }, [formData, formId, updateField]);

  useEffect(() => {
    if (id) {
      const prop = getPropertyById(parseInt(id));
      setProperty(prop);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const inquiry = {
      id: Date.now(),
      propertyId: property?.id,
      propertyTitle: property?.title || 'General Inquiry',
      agentName: property?.agent?.name || 'Support Team',
      subject: formData.subject,
      message: formData.message,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    inquiries.push(inquiry);
    localStorage.setItem('inquiries', JSON.stringify(inquiries));

    setInquiryId(inquiry.id.toString().slice(-8));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div style={{ 
        fontFamily: 'monospace', 
        padding: '20px', 
        maxWidth: '600px', 
        margin: '40px auto',
        textAlign: 'center'
      }}>
        <pre style={{ fontSize: '12px' }}>
{`
┌────────────────────┐
│   ✓ SUCCESS!       │
└────────────────────┘
`}
        </pre>
        <h1 style={{ fontSize: '18px', margin: '20px 0 10px 0' }}>
          Message Sent Successfully!
        </h1>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
          Your inquiry has been forwarded to the agent. <br/>
          They will contact you within 24-48 hours.
        </p>
        
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          marginBottom: '25px',
          backgroundColor: '#f9f9f9'
        }}>
          <p style={{ fontSize: '12px', margin: '0 0 10px 0', color: '#666' }}>
            <strong>Inquiry ID:</strong> #{inquiryId}
          </p>
          <p style={{ fontSize: '12px', margin: '0 0 10px 0', color: '#666' }}>
            <strong>Property:</strong> {property?.title || 'General Inquiry'}
          </p>
          <p style={{ fontSize: '12px', margin: 0, color: '#666' }}>
            <strong>Agent:</strong> {property?.agent?.name || 'Support Team'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {property && (
            <Link to={`/property/${property.id}`}>
              <button style={{ 
                padding: '10px 20px',
                backgroundColor: '#fff',
                border: '1px solid #000',
                cursor: 'pointer',
                fontSize: '12px'
              }}>
                ← Back to Property
              </button>
            </Link>
          )}
          <Link to="/dashboard">
            <button style={{ 
              padding: '10px 20px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px'
            }}>
              View Dashboard →
            </button>
          </Link>
          <Link to="/properties">
            <button style={{ 
              padding: '10px 20px',
              backgroundColor: '#fff',
              border: '1px solid #000',
              cursor: 'pointer',
              fontSize: '12px'
            }}>
              Browse Properties
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px', 
      maxWidth: '700px', 
      margin: '40px auto' 
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <pre style={{ fontSize: '12px' }}>
{`
┌─────────────────────┐
│  Contact Agent      │
└─────────────────────┘
`}
        </pre>
        {property && (
          <div style={{ marginTop: '15px', fontSize: '13px' }}>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
              {property.title}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              Agent: {property.agent.name} | {property.agent.phone}
            </p>
          </div>
        )}
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} style={{ 
        border: '1px solid #ddd', 
        padding: '25px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Your Name *
          </label>
          <input 
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
            placeholder="John Doe"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Email Address *
          </label>
          <input 
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
            placeholder="your.email@example.com"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Phone Number *
          </label>
          <input 
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
            placeholder="+91 98765 43210"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Subject *
          </label>
          <select 
            required
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Schedule Visit">Schedule Visit</option>
            <option value="Price Negotiation">Price Negotiation</option>
            <option value="Documentation">Documentation</option>
            <option value="Financing">Financing Options</option>
            <option value="Property Details">Property Details</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Message *
          </label>
          <textarea 
            required
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows={6}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px',
              fontFamily: 'monospace'
            }}
            placeholder="Please provide details about your inquiry..."
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Preferred Contact Method *
          </label>
          <div style={{ fontSize: '12px' }}>
            <label style={{ marginRight: '15px' }}>
              <input 
                type="radio"
                value="email"
                checked={formData.preferredContact === 'email'}
                onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
              />
              {' '}Email
            </label>
            <label style={{ marginRight: '15px' }}>
              <input 
                type="radio"
                value="phone"
                checked={formData.preferredContact === 'phone'}
                onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
              />
              {' '}Phone
            </label>
            <label>
              <input 
                type="radio"
                value="whatsapp"
                checked={formData.preferredContact === 'whatsapp'}
                onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
              />
              {' '}WhatsApp
            </label>
          </div>
        </div>

        <button 
          type="submit"
          style={{ 
            width: '100%',
            padding: '12px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Send Message →
        </button>
      </form>

      {/* Links */}
      <div style={{ 
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#666'
      }}>
        {property ? (
          <>
            <Link to={`/property/${property.id}`} style={{ color: '#000', marginRight: '15px' }}>
              ← Back to Property
            </Link>
            <Link to="/properties" style={{ color: '#000' }}>
              Browse Properties
            </Link>
          </>
        ) : (
          <Link to="/" style={{ color: '#000' }}>
            ← Back to Home
          </Link>
        )}
      </div>
    </div>
  );
}
