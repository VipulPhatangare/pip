// Tier D - Survival Mode: Book Site Visit Form
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';

export default function BookVisitD() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const booking = {
      id: Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      date: formData.date,
      time: formData.time,
      message: formData.message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    setSubmitted(true);
  };

  if (!property) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Property Not Found</h1>
        <Link to="/properties">← Back to Properties</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ 
        fontFamily: 'monospace', 
        padding: '20px', 
        maxWidth: '600px', 
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{ 
          border: '2px solid #0a0',
          padding: '30px',
          backgroundColor: '#f0fff0'
        }}>
          <pre style={{ fontSize: '20px' }}>
{`
  ✓ SUCCESS
  ────────
`}
          </pre>
          <h2 style={{ fontSize: '18px', margin: '10px 0' }}>
            Booking Confirmed!
          </h2>
          <p style={{ margin: '10px 0', color: '#666' }}>
            Your site visit has been scheduled.
          </p>
          <p style={{ fontSize: '13px', margin: '15px 0' }}>
            <strong>Property:</strong> {property.title}<br/>
            <strong>Date:</strong> {formData.date}<br/>
            <strong>Time:</strong> {formData.time}<br/>
            <strong>Status:</strong> Pending Confirmation
          </p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Check your dashboard for updates
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link 
              to="/dashboard"
              style={{ 
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#000',
                color: '#fff',
                textDecoration: 'none',
                marginRight: '10px'
              }}
            >
              View Dashboard
            </Link>
            <Link 
              to="/properties"
              style={{ 
                display: 'inline-block',
                padding: '10px 20px',
                border: '1px solid #000',
                color: '#000',
                textDecoration: 'none'
              }}
            >
              Browse More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', margin: '0 0 5px 0' }}>
          Book Site Visit
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
          Schedule a visit to: <strong>{property.title}</strong>
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
          {property.location.area}, {property.location.city}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ 
        border: '1px solid #ddd', 
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Full Name *
          </label>
          <input 
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
            placeholder="Enter your full name"
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
              padding: '8px', 
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
              padding: '8px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
            placeholder="+91 98765 43210"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Preferred Visit Date *
          </label>
          <input 
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Preferred Time Slot *
          </label>
          <select 
            required
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
          >
            <option value="">Select time slot</option>
            <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
            <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
            <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
            <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Additional Message (Optional)
          </label>
          <textarea 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows={4}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc',
              fontSize: '13px',
              fontFamily: 'monospace'
            }}
            placeholder="Any specific requirements or questions..."
          />
        </div>

        <div style={{ 
          borderTop: '1px solid #ddd',
          paddingTop: '15px',
          display: 'flex',
          gap: '10px'
        }}>
          <button 
            type="submit"
            style={{ 
              flex: 1,
              padding: '12px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold'
            }}
          >
            Confirm Booking
          </button>
          <button 
            type="button"
            onClick={() => navigate(`/property/${id}`)}
            style={{ 
              flex: 1,
              padding: '12px',
              backgroundColor: '#fff',
              color: '#000',
              border: '1px solid #000',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div style={{ 
        marginTop: '20px',
        border: '1px solid #ccc',
        padding: '15px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Note:</strong> Our agent will confirm your visit within 24 hours. 
        Please make sure you're available at the selected time slot.
      </div>
    </div>
  );
}
