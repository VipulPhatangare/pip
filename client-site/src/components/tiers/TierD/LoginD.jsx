// Tier D - Survival Mode: Login Page
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function LoginD() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const from = location.state?.from?.pathname || '/properties';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '15px', 
      maxWidth: '500px', 
      margin: '30px auto' 
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <pre style={{ fontSize: '10px' }}>
{`
┌─────────────────┐
│  PropertyHub    │
│     Login       │
└─────────────────┘
`}
        </pre>
        <h1 style={{ fontSize: '18px', margin: '10px 0' }}>
          Welcome Back
        </h1>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Login to access your dashboard
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '10px',
          marginBottom: '12px',
          backgroundColor: '#fee',
          border: '1px solid #f00',
          color: '#c00',
          fontSize: '11px'
        }}>
          ✗ {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} style={{ 
        border: '1px solid #ddd', 
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px', fontWeight: 'bold' }}>
            Email Address
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
              fontSize: '12px',
              minHeight: '44px'
            }}
            placeholder="your.email@example.com"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px', fontWeight: 'bold' }}>
            Password
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
              fontSize: '12px',
              minHeight: '44px'
            }}
            placeholder="Enter your password"
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
            fontSize: '13px',
            fontWeight: 'bold',
            minHeight: '44px'
          }}
        >
          Login →
        </button>
      </form>

      {/* Links */}
      <div style={{ 
        marginTop: '15px',
        textAlign: 'center',
        fontSize: '11px'
      }}>
        <p style={{ margin: '0 0 8px 0', color: '#666' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#000', fontWeight: 'bold' }}>
            Sign Up
          </Link>
        </p>
        <Link to="/" style={{ color: '#666', textDecoration: 'underline' }}>
          ← Back to Home
        </Link>
      </div>

      {/* Demo Credentials */}
      <div style={{ 
        marginTop: '30px',
        border: '1px dashed #999',
        padding: '15px',
        backgroundColor: '#ffffed',
        fontSize: '11px'
      }}>
        <strong>Demo Credentials:</strong><br/>
        Email: demo@test.com<br/>
        Password: demo123
      </div>
    </div>
  );
}
