// Tier D - Survival Mode: Signup Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function SignupD() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup(formData.name, formData.email, formData.phone, formData.password);

    if (result.success) {
      navigate('/properties');
    } else {
      setError(result.error || 'Signup failed');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px', 
      maxWidth: '500px', 
      margin: '40px auto' 
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <pre style={{ fontSize: '12px' }}>
{`
┌─────────────────┐
│  PropertyHub    │
│    Sign Up      │
└─────────────────┘
`}
        </pre>
        <h1 style={{ fontSize: '20px', margin: '10px 0' }}>
          Create Account
        </h1>
        <p style={{ fontSize: '13px', color: '#666' }}>
          Join us to find your dream home
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '12px',
          marginBottom: '15px',
          backgroundColor: '#fee',
          border: '1px solid #f00',
          color: '#c00',
          fontSize: '12px'
        }}>
          ✗ {error}
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} style={{ 
        border: '1px solid #ddd', 
        padding: '25px',
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
            Password *
          </label>
          <input 
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
            placeholder="Minimum 6 characters"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Confirm Password *
          </label>
          <input 
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              fontSize: '13px'
            }}
            placeholder="Re-enter password"
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
          Create Account →
        </button>
      </form>

      {/* Links */}
      <div style={{ 
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '12px'
      }}>
        <p style={{ margin: '0 0 10px 0', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#000', fontWeight: 'bold' }}>
            Login
          </Link>
        </p>
        <Link to="/" style={{ color: '#666', textDecoration: 'underline' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
