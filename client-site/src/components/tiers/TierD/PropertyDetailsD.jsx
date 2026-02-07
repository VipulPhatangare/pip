// Tier D - Survival Mode: Property Details Page
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';

export default function PropertyDetailsD() {
  const { id } = useParams();
  const property = getPropertyById(id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!property) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Property Not Found</h1>
        <Link to="/properties">← Back to Properties</Link>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>
          {property.title}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          {property.location.address}, {property.location.area}, {property.location.city}
        </p>
      </div>

      {/* ASCII Art Floor Plan */}
      <div style={{ 
        border: '1px solid #ccc', 
        padding: '15px', 
        marginBottom: '20px',
        backgroundColor: '#f5f5f5',
        overflow: 'auto'
      }}>
        <h2 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>
          Floor Plan (ASCII Representation)
        </h2>
        <pre style={{ fontSize: '11px', lineHeight: '1.2' }}>
{property.specs.beds >= 4 ? `
╔════════════════════════════════════════╗
║                                        ║
║  ┌──────┐    ┌──────┐    ┌──────┐    ║
║  │ BED1 │    │ BED2 │    │ BED3 │    ║
║  │      │    │      │    │      │    ║
║  └──────┘    └──────┘    └──────┘    ║
║                                        ║
║  ┌──────┐    ┌─────────────────┐     ║
║  │ BED4 │    │   LIVING ROOM   │     ║
║  │      │    │                 │     ║
║  └──────┘    │                 │     ║
║              └─────────────────┘     ║
║                                        ║
║  ┌────────┐  ┌──────┐  ┌──────┐     ║
║  │KITCHEN │  │BATH1 │  │BATH2 │     ║
║  └────────┘  └──────┘  └──────┘     ║
║                                        ║
╚════════════════════════════════════════╝
  Total Area: ${property.specs.sqft} sqft
` : property.specs.beds === 3 ? `
╔════════════════════════════════╗
║                                ║
║  ┌──────┐    ┌──────┐         ║
║  │ BED1 │    │ BED2 │         ║
║  │      │    │      │         ║
║  └──────┘    └──────┘         ║
║                                ║
║  ┌──────┐  ┌──────────────┐  ║
║  │ BED3 │  │ LIVING ROOM  │  ║
║  │      │  │              │  ║
║  └──────┘  │              │  ║
║            └──────────────┘  ║
║                                ║
║  ┌────────┐    ┌──────┐      ║
║  │KITCHEN │    │BATH  │      ║
║  └────────┘    └──────┘      ║
║                                ║
╚════════════════════════════════╝
  Total Area: ${property.specs.sqft} sqft
` : `
╔═══════════════════════════╗
║                           ║
║  ┌──────┐  ┌──────────┐  ║
║  │ BED1 │  │  LIVING  │  ║
║  │      │  │   ROOM   │  ║
║  └──────┘  └──────────┘  ║
║                           ║
║  ┌──────┐  ┌─────────┐   ║
║  │ BED2 │  │ KITCHEN │   ║
║  │      │  └─────────┘   ║
║  └──────┘                 ║
║            ┌──────┐       ║
║            │BATH  │       ║
║            └──────┘       ║
║                           ║
╚═══════════════════════════╝
  Total Area: ${property.specs.sqft} sqft
`}
        </pre>
      </div>

      {/* Price & Specs */}
      <div style={{ 
        border: '2px solid #000', 
        padding: '15px', 
        marginBottom: '20px',
        backgroundColor: '#fffacd'
      }}>
        <h2 style={{ fontSize: '20px', margin: '0 0 10px 0' }}>
          {formatPrice(property.price)}
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Bedrooms:</td>
              <td style={{ padding: '8px' }}>{property.specs.beds}</td>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Bathrooms:</td>
              <td style={{ padding: '8px' }}>{property.specs.baths}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Area:</td>
              <td style={{ padding: '8px' }}>{property.specs.sqft} sqft</td>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Parking:</td>
              <td style={{ padding: '8px' }}>{property.specs.parking} spots</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Type:</td>
              <td style={{ padding: '8px' }}>{property.specs.type}</td>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Year Built:</td>
              <td style={{ padding: '8px' }}>{property.yearBuilt}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', margin: '0 0 10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
          Description
        </h2>
        <p style={{ lineHeight: '1.6', fontSize: '13px' }}>
          {property.description}
        </p>
      </div>

      {/* Features */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', margin: '0 0 10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
          Features & Amenities
        </h2>
        <ul style={{ listStyle: 'square', paddingLeft: '20px', fontSize: '13px' }}>
          {property.features.map((feature, index) => (
            <li key={index} style={{ marginBottom: '6px' }}>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Agent Info */}
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '15px', 
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>
          Contact Agent
        </h2>
        <table style={{ width: '100%', fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>Name:</td>
              <td style={{ padding: '5px' }}>{property.agent.name}</td>
            </tr>
            <tr>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>Phone:</td>
              <td style={{ padding: '5px' }}>{property.agent.phone}</td>
            </tr>
            <tr>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>Email:</td>
              <td style={{ padding: '5px' }}>{property.agent.email}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        border: '2px dashed #666', 
        padding: '20px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '16px', margin: '0 0 15px 0' }}>
          Interested in this property?
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link 
            to={`/book-visit/${property.id}`}
            style={{ 
              display: 'block',
              padding: '12px',
              backgroundColor: '#000',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            📅 Book Site Visit
          </Link>
          <Link 
            to={`/contact-agent/${property.id}`}
            style={{ 
              display: 'block',
              padding: '12px',
              backgroundColor: '#333',
              color: '#fff',
              textDecoration: 'none'
            }}
          >
            ✉️ Contact Agent
          </Link>
          <Link 
            to={`/payment-request/${property.id}`}
            style={{ 
              display: 'block',
              padding: '12px',
              border: '2px solid #000',
              color: '#000',
              textDecoration: 'none'
            }}
          >
            💰 Request Payment Info
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ textAlign: 'center' }}>
        <Link 
          to="/properties"
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            border: '1px solid #333',
            textDecoration: 'none',
            color: '#333'
          }}
        >
          ← Back to Properties
        </Link>
      </div>
    </div>
  );
}
