// Tier D - Survival Mode: Properties Listing Page
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { properties, getCities, getPropertyTypes } from '../../../data/properties';

export default function PropertiesListD() {
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    minPrice: '',
    maxPrice: ''
  });

  const filteredProperties = properties.filter(property => {
    if (filters.city && property.location.city !== filters.city) return false;
    if (filters.type && property.specs.type !== filters.type) return false;
    if (filters.minPrice && property.price < Number(filters.minPrice) * 100000) return false;
    if (filters.maxPrice && property.price > Number(filters.maxPrice) * 100000) return false;
    return true;
  });

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
      maxWidth: '900px', 
      margin: '0 auto' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '15px' }}>
        <h1 style={{ fontSize: '20px', margin: '0 0 5px 0' }}>
          All Properties
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Found {filteredProperties.length} properties
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '12px', 
        marginBottom: '15px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>
          Filters
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
              City:
            </label>
            <select 
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', fontSize: '14px', minHeight: '44px' }}
            >
              <option value="">All Cities</option>
              {getCities().map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
              Property Type:
            </label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
            >
              <option value="">All Types</option>
              {getPropertyTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
              Min Price (Lakhs):
            </label>
            <input 
              type="number" 
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              placeholder="e.g. 10"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', fontSize: '14px', minHeight: '44px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
              Max Price (Lakhs):
            </label>
            <input 
              type="number" 
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              placeholder="e.g. 100"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <button 
          onClick={() => setFilters({ city: '', type: '', minPrice: '', maxPrice: '' })}
          style={{ 
            marginTop: '10px',
            padding: '10px 16px',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            minHeight: '44px',
            width: '100%',
            fontWeight: 'bold'
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Properties List */}
      <div>
        {filteredProperties.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            border: '1px dashed #ccc' 
          }}>
            <p style={{ fontSize: '16px', color: '#999' }}>
              No properties found matching your criteria.
            </p>
            <button 
              onClick={() => setFilters({ city: '', type: '', minPrice: '', maxPrice: '' })}
              style={{ 
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Show All Properties
            </button>
          </div>
        ) : (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            border: '1px solid #ddd'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#333', color: '#fff' }}>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px' }}>Property</th>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px' }}>Location</th>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px' }}>Specs</th>
                <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px' }}>Price</th>
                <th style={{ padding: '10px', textAlign: 'center', fontSize: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property, index) => (
                <tr 
                  key={property.id}
                  style={{ 
                    borderBottom: '1px solid #ddd',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {property.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {property.specs.type}
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>
                    {property.location.area}<br/>
                    <span style={{ color: '#666' }}>{property.location.city}</span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '11px' }}>
                    {property.specs.beds}BR | {property.specs.baths}BA<br/>
                    {property.specs.sqft} sqft
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>
                    {formatPrice(property.price)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <Link 
                      to={`/property/${property.id}`}
                      style={{ 
                        display: 'inline-block',
                        padding: '6px 12px',
                        backgroundColor: '#000',
                        color: '#fff',
                        textDecoration: 'none',
                        fontSize: '11px'
                      }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Back to Home */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link 
          to="/"
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            border: '1px solid #333',
            textDecoration: 'none',
            color: '#333'
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
