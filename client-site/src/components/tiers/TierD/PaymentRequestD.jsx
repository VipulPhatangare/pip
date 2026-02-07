// Tier D - Survival Mode: Payment Request
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';

export default function PaymentRequestD() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentType: 'token',
    amount: '',
    paymentMethod: 'bank_transfer',
    message: ''
  });

  useEffect(() => {
    if (id) {
      const prop = getPropertyById(parseInt(id));
      setProperty(prop);
      
      // Pre-fill with user data if logged in
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || ''
        }));
      }

      // Set default amount based on payment type
      setFormData(prev => ({
        ...prev,
        amount: '50000' // Default token amount
      }));
    }
  }, [id]);

  const handlePaymentTypeChange = (type) => {
    let defaultAmount = '';
    if (property) {
      switch(type) {
        case 'token':
          defaultAmount = '50000';
          break;
        case 'partial':
          defaultAmount = (property.price * 0.1).toString();
          break;
        case 'full':
          defaultAmount = property.price.toString();
          break;
        default:
          defaultAmount = '';
      }
    }
    setFormData({...formData, paymentType: type, amount: defaultAmount});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const paymentRequest = {
      id: Date.now(),
      propertyId: property?.id,
      propertyTitle: property?.title || 'Property',
      offerAmount: formData.amount,
      paymentType: formData.paymentType,
      paymentMethod: formData.paymentMethod,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const paymentRequests = JSON.parse(localStorage.getItem('paymentRequests') || '[]');
    paymentRequests.push(paymentRequest);
    localStorage.setItem('paymentRequests', JSON.stringify(paymentRequests));

    setRequestId(paymentRequest.id.toString().slice(-8));
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
          Payment Request Received!
        </h1>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
          We've received your payment request. <br/>
          You will receive payment instructions via email within 2-4 hours.
        </p>
        
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          marginBottom: '25px',
          backgroundColor: '#f9f9f9',
          textAlign: 'left'
        }}>
          <p style={{ fontSize: '12px', margin: '0 0 10px 0' }}>
            <strong>Request ID:</strong> #{requestId}
          </p>
          <p style={{ fontSize: '12px', margin: '0 0 10px 0' }}>
            <strong>Property:</strong> {property?.title}
          </p>
          <p style={{ fontSize: '12px', margin: '0 0 10px 0' }}>
            <strong>Amount:</strong> ₹{parseInt(formData.amount).toLocaleString('en-IN')}
          </p>
          <p style={{ fontSize: '12px', margin: '0 0 10px 0' }}>
            <strong>Type:</strong> {formData.paymentType === 'token' ? 'Token Amount' : formData.paymentType === 'partial' ? 'Partial Payment (10%)' : 'Full Payment'}
          </p>
          <p style={{ fontSize: '12px', margin: 0 }}>
            <strong>Status:</strong> <span style={{ color: '#f90' }}>⏳ Processing</span>
          </p>
        </div>

        <div style={{ 
          border: '1px solid #ffc', 
          padding: '15px', 
          marginBottom: '25px',
          backgroundColor: '#ffe',
          fontSize: '12px',
          textAlign: 'left'
        }}>
          <strong>⚠ Next Steps:</strong>
          <ol style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '5px' }}>Check your email ({formData.email}) for payment instructions</li>
            <li style={{ marginBottom: '5px' }}>Complete the payment within 48 hours to hold the property</li>
            <li style={{ marginBottom: '5px' }}>Upload payment proof via the link in the email</li>
            <li>Our team will verify and confirm within 24 hours</li>
          </ol>
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
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ fontFamily: 'monospace', padding: '20px', textAlign: 'center' }}>
        <p>Property not found</p>
        <Link to="/properties">← Back to Properties</Link>
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
      <div style={{ marginBottom: '25px' }}>
        <pre style={{ fontSize: '12px' }}>
{`
┌─────────────────────┐
│  Payment Request    │
└─────────────────────┘
`}
        </pre>
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '15px',
          backgroundColor: '#f9f9f9',
          marginTop: '15px'
        }}>
          <h2 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>
            {property.title}
          </h2>
          <p style={{ fontSize: '13px', margin: '5px 0', color: '#666' }}>
            {property.location.area}, {property.location.city}
          </p>
          <p style={{ fontSize: '15px', margin: '10px 0 0 0', fontWeight: 'bold' }}>
            Property Price: ₹{property.price.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Payment Form */}
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
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
            Payment Type *
          </label>
          <div style={{ fontSize: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px', padding: '10px', border: formData.paymentType === 'token' ? '2px solid #000' : '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}>
              <input 
                type="radio"
                value="token"
                checked={formData.paymentType === 'token'}
                onChange={(e) => handlePaymentTypeChange(e.target.value)}
              />
              {' '}<strong>Token Amount</strong> - ₹50,000 (Hold the property)
            </label>
            <label style={{ display: 'block', marginBottom: '8px', padding: '10px', border: formData.paymentType === 'partial' ? '2px solid #000' : '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}>
              <input 
                type="radio"
                value="partial"
                checked={formData.paymentType === 'partial'}
                onChange={(e) => handlePaymentTypeChange(e.target.value)}
              />
              {' '}<strong>Partial Payment</strong> - ₹{(property.price * 0.1).toLocaleString('en-IN')} (10%)
            </label>
            <label style={{ display: 'block', padding: '10px', border: formData.paymentType === 'full' ? '2px solid #000' : '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}>
              <input 
                type="radio"
                value="full"
                checked={formData.paymentType === 'full'}
                onChange={(e) => handlePaymentTypeChange(e.target.value)}
              />
              {' '}<strong>Full Payment</strong> - ₹{property.price.toLocaleString('en-IN')}
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Amount (₹) *
          </label>
          <input 
            type="number"
            required
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
            min="1000"
            max={property.price}
          />
          <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#666' }}>
            Minimum: ₹1,000 | Maximum: ₹{property.price.toLocaleString('en-IN')}
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Preferred Payment Method *
          </label>
          <select 
            required
            value={formData.paymentMethod}
            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
          >
            <option value="bank_transfer">Bank Transfer / NEFT / RTGS</option>
            <option value="upi">UPI / PhonePe / Google Pay</option>
            <option value="cheque">Cheque / Demand Draft</option>
            <option value="loan">Home Loan (Bank Financed)</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Additional Notes (Optional)
          </label>
          <textarea 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows={4}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px',
              fontFamily: 'monospace'
            }}
            placeholder="Any special instructions or queries..."
          />
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
          Submit Payment Request →
        </button>
      </form>

      {/* Links */}
      <div style={{ 
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#666'
      }}>
        <Link to={`/property/${property.id}`} style={{ color: '#000', marginRight: '15px' }}>
          ← Back to Property
        </Link>
        <Link to="/properties" style={{ color: '#000' }}>
          Browse Properties
        </Link>
      </div>
    </div>
  );
}
