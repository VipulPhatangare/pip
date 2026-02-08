// Tier C - Minimal Mode: User Dashboard with Tailwind
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardC() {
  const navigate = useNavigate();
  const user = { name: 'Demo User', email: 'demo@test.com' }; // Always logged in
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
  
  const handleLogout = () => {
    // No logout in public mode
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
            </div>
            <div className="flex gap-3">
              <Link to="/properties">
                <button className="px-4 py-2 rounded-lg border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors">
                  Browse Properties
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Inquiries Sent</p>
                <p className="text-3xl font-bold text-gray-900">{inquiries.length}</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Account Status</p>
                <p className="text-xl font-bold text-green-600">Active</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(-5).reverse().map(booking => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{booking.propertyTitle}</h3>
                      <p className="text-sm text-gray-600">Visit scheduled on {booking.date} at {booking.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>📞 {booking.phone}</span>
                    <span>📧 {booking.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📅</div>
              <p className="text-gray-600 mb-4">No bookings yet</p>
              <Link to="/properties">
                <button className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                  Browse Properties
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Inquiries</h2>
          {inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.slice(-5).reverse().map(inquiry => (
                <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{inquiry.propertyTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">{inquiry.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mt-2">
                    <span>👤 {inquiry.name}</span>
                    <span>📧 {inquiry.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-gray-600">No inquiries sent yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
