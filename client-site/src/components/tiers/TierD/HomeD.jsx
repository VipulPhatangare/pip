// Tier D - Survival Mode: Text-only HomePage
import React from 'react';
import { Link } from 'react-router-dom';
import { properties } from '../../../data/properties';
import { useAuth } from '../../../context/AuthContext';

export default function HomeD() {
  const { isAuthenticated, user } = useAuth();
  const featuredProperties = properties.slice(0, 3);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '15px',
      maxWidth: '800px', 
      margin: '0 auto',
      lineHeight: '1.6'
    }}>
      {/* ASCII Art Logo */}
      <pre style={{ fontSize: '10px', overflow: 'auto' }}>
{`
╔══════════════════════════════════════╗
║   REAL ESTATE PORTAL                 ║
║   Find Your Dream Home - Text Mode   ║
╚══════════════════════════════════════╝
`}
      </pre>

      {/* Hero Section */}
      <div style={{ 
        border: '2px solid #333', 
        padding: '20px', 
        marginBottom: '30px',
        backgroundColor: '#f9f9f9'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          Welcome to PropertyHub
        </h1>
        <p style={{ margin: '0 0 15px 0', color: '#666' }}>
          Browse premium properties across India. Fast, simple, and works anywhere.
        </p>
        <Link 
          to="/properties" 
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            border: '2px solid #000'
          }}
        >
          → Browse Properties
        </Link>
      </div>

      {/* Search Section */}
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '12px', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
          Quick Search
        </h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <select style={{ padding: '10px', border: '1px solid #ccc', fontSize: '14px', minHeight: '44px' }}>
            <option>Select City</option>
            <option>Mumbai</option>
            <option>Pune</option>
            <option>Bangalore</option>
            <option>Hyderabad</option>
          </select>
          <select style={{ padding: '10px', border: '1px solid #ccc', fontSize: '14px', minHeight: '44px' }}>
            <option>Property Type</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Penthouse</option>
            <option>Farmhouse</option>
          </select>
          <button 
            type="submit"
            style={{ 
              padding: '12px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              minHeight: '44px',
              fontWeight: 'bold'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Featured Properties */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          marginBottom: '15px',
          borderBottom: '2px solid #000',
          paddingBottom: '5px'
        }}>
          Featured Properties
        </h2>
        
        {featuredProperties.map(property => (
          <div 
            key={property.id}
            style={{ 
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#fafafa'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
              {property.title}
            </h3>
            
            {/* ASCII Property Icon */}
            <pre style={{ fontSize: '10px', margin: '10px 0' }}>
{property.specs.type === 'Villa' ? `
   ▲
  ╱ ╲
 ╱   ╲
╱_____╲
|░░|░░|
|░░|░░|
` : property.specs.type === 'Penthouse' ? `
 ┌───┐
┌┴───┴┐
││ ⊞ ││
││   ││
└─────┘
` : `
┌─────┐
│ ⊞ ⊞ │
│ ⊞ ⊞ │
└─────┘
`}
            </pre>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Price:</td>
                  <td style={{ padding: '5px' }}>{formatPrice(property.price)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Location:</td>
                  <td style={{ padding: '5px' }}>{property.location.area}, {property.location.city}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Size:</td>
                  <td style={{ padding: '5px' }}>{property.specs.sqft} sqft</td>
                </tr>
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Config:</td>
                  <td style={{ padding: '5px' }}>
                    {property.specs.beds} Bed | {property.specs.baths} Bath | {property.specs.parking} Parking
                  </td>
                </tr>
              </tbody>
            </table>

            <Link 
              to={`/property/${property.id}`}
              style={{ 
                display: 'inline-block',
                padding: '8px 15px',
                border: '1px solid #000',
                textDecoration: 'none',
                color: '#000',
                marginRight: '10px'
              }}
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '20px',
        marginBottom: '30px',
        backgroundColor: '#f5f5f5'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>
          Why Choose PropertyHub?
        </h2>
        <ul style={{ listStyle: 'square', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Verified Listings:</strong> All properties are verified by our team
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Expert Agents:</strong> Professional guidance throughout your journey
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Easy Booking:</strong> Simple process to schedule site visits
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Secure Payments:</strong> Safe and transparent payment options
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Works Offline:</strong> Access property details even without internet
          </li>
        </ul>
      </div>

      {/* Call to Action */}
      <div style={{ 
        textAlign: 'center',
        border: '2px dashed #666',
        padding: '20px'
      }}>
        {isAuthenticated ? (
          <>
            <h3 style={{ margin: '0 0 10px 0' }}>
              Welcome Back, {user?.name}!
            </h3>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>
              Continue exploring amazing properties
            </p>
            <Link 
              to="/properties"
              style={{ 
                display: 'inline-block',
                padding: '12px 30px',
                backgroundColor: '#000',
                color: '#fff',
                textDecoration: 'none',
                marginRight: '10px'
              }}
            >
              Browse Properties
            </Link>
            <Link 
              to="/dashboard"
              style={{ 
                display: 'inline-block',
                padding: '12px 30px',
                border: '2px solid #000',
                color: '#000',
                textDecoration: 'none'
              }}
            >
              My Dashboard
            </Link>
          </>
        ) : (
          <>
            <h3 style={{ margin: '0 0 10px 0' }}>
              Ready to Find Your Dream Home?
            </h3>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>
              Create an account to save favorites and get personalized recommendations
            </p>
            <Link 
              to="/signup"
              style={{ 
                display: 'inline-block',
                padding: '12px 30px',
                backgroundColor: '#000',
                color: '#fff',
                textDecoration: 'none',
                marginRight: '10px'
              }}
            >
              Sign Up
            </Link>
            <Link 
              to="/login"
              style={{ 
                display: 'inline-block',
                padding: '12px 30px',
                border: '2px solid #000',
                color: '#000',
                textDecoration: 'none'
              }}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
