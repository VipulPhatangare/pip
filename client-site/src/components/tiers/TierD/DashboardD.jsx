// Tier D - Survival Mode: Dashboard
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardD() {
  const navigate = useNavigate();
  const user = { name: 'Demo User', email: 'demo@test.com' }; // Always logged in
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    // Get bookings and inquiries
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(allBookings);

    const allInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    setInquiries(allInquiries);
  }, []);

  const handleLogout = () => {
    // No logout in public mode
  };

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px', 
      maxWidth: '900px', 
      margin: '20px auto' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <pre style={{ fontSize: '11px' }}>
{`
╔═══════════════════════════════╗
║     USER DASHBOARD            ║
╚═══════════════════════════════╝
`}
        </pre>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
          <div>
            <h1 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>
              Welcome, {user.name}!
            </h1>
            <p style={{ fontSize: '12px', margin: 0, color: '#666' }}>
              {user.email}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#fff',
              border: '1px solid #000',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', marginBottom: '10px', borderBottom: '2px solid #000', paddingBottom: '5px' }}>
          QUICK ACTIONS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <Link to="/properties" style={{ textDecoration: 'none', color: '#000' }}>
            <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#f9f9f9', cursor: 'pointer' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>🏠</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Browse Properties</div>
            </div>
          </Link>
          <Link to="/properties" style={{ textDecoration: 'none', color: '#000' }}>
            <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#f9f9f9', cursor: 'pointer' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>🔍</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Search Properties</div>
            </div>
          </Link>
        </div>
      </div>

      {/* My Bookings */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', marginBottom: '10px', borderBottom: '2px solid #000', paddingBottom: '5px' }}>
          MY BOOKINGS ({bookings.length})
        </h2>
        {bookings.length === 0 ? (
          <div style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
            <p style={{ fontSize: '13px', margin: 0, color: '#666' }}>
              No bookings yet. <Link to="/properties" style={{ color: '#000', fontWeight: 'bold' }}>Browse properties</Link> to book a visit.
            </p>
          </div>
        ) : (
          <div style={{ border: '1px solid #ddd' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Property</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Time</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      #{booking.id.toString().slice(-6)}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      {booking.propertyTitle}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      {booking.date}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      {booking.time}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      <span style={{ color: booking.status === 'pending' ? '#f90' : '#090', fontWeight: 'bold' }}>
                        {booking.status === 'pending' ? '⏳ Pending' : '✓ Confirmed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* My Inquiries */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', marginBottom: '10px', borderBottom: '2px solid #000', paddingBottom: '5px' }}>
          MY INQUIRIES ({inquiries.length})
        </h2>
        {inquiries.length === 0 ? (
          <div style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
            <p style={{ fontSize: '13px', margin: 0, color: '#666' }}>
              No inquiries yet.
            </p>
          </div>
        ) : (
          <div style={{ border: '1px solid #ddd' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Subject</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry, index) => (
                  <tr key={inquiry.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      #{inquiry.id.toString().slice(-6)}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      {inquiry.subject}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      <span style={{ color: '#f90', fontWeight: 'bold' }}>⏳ Pending</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '14px', marginBottom: '10px', borderBottom: '2px solid #000', paddingBottom: '5px' }}>
          ACCOUNT INFO
        </h2>
        <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#f9f9f9' }}>
          <table style={{ width: '100%', fontSize: '12px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold', width: '150px' }}>Name:</td>
                <td style={{ padding: '8px 0' }}>{user.name}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Email:</td>
                <td style={{ padding: '8px 0' }}>{user.email}</td>
              </tr>
              {user.phone && (
                <tr>
                  <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Phone:</td>
                  <td style={{ padding: '8px 0' }}>{user.phone}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Member Since:</td>
                <td style={{ padding: '8px 0' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Links */}
      <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
        <Link to="/" style={{ color: '#000', marginRight: '15px' }}>← Home</Link>
        <Link to="/properties" style={{ color: '#000' }}>Browse Properties</Link>
      </div>
    </div>
  );
}
