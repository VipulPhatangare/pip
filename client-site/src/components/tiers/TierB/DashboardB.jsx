// Tier B - Constraint Mode: Dashboard with CSS Animations
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardB() {
  const navigate = useNavigate();
  const user = { name: 'Demo User', email: 'demo@test.com' }; // Always logged in
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
  
  const handleLogout = () => {
    // No logout in public mode
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-purple-100 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
            </div>
            <div className="flex gap-3">
              <Link to="/properties">
                <button className="px-4 py-2 rounded-lg border-2 border-purple-200 text-purple-600 hover:border-purple-500 hover:scale-105 transition-all duration-300">
                  Browse Properties
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: '📅', label: 'Total Bookings', value: bookings.length, color: 'purple', delay: 100 },
            { icon: '💬', label: 'Inquiries Sent', value: inquiries.length, color: 'blue', delay: 200 },
            { icon: '✅', label: 'Account Status', value: 'Active', color: 'green', delay: 300 }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${stat.delay}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-4xl animate-bounce-slow">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in delay-400">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(-5).reverse().map((booking, index) => (
                <div 
                  key={booking.id} 
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-slide-in-left"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{booking.propertyTitle}</h3>
                      <p className="text-sm text-gray-600">Visit scheduled on {booking.date} at {booking.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium animate-pulse-slow ${
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
            <div className="text-center py-8 animate-fade-in delay-500">
              <div className="text-5xl mb-3 animate-bounce-slow">📅</div>
              <p className="text-gray-600 mb-4">No bookings yet</p>
              <Link to="/properties">
                <button className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 transition-all duration-300">
                  Browse Properties
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in delay-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Inquiries</h2>
          {inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.slice(-5).reverse().map((inquiry, index) => (
                <div 
                  key={inquiry.id} 
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-slide-in-right"
                  style={{ animationDelay: `${700 + index * 100}ms` }}
                >
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
            <div className="text-center py-8 animate-fade-in delay-700">
              <div className="text-5xl mb-3 animate-bounce-slow">💬</div>
              <p className="text-gray-600">No inquiries sent yet</p>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-slide-down { animation: slideDown 0.6s ease-out; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-left { animation: slideInLeft 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-right { animation: slideInRight 0.6s ease-out forwards; opacity: 0; }
        .animate-bounce-slow { animation: bounceSlow 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulseSlow 2s ease-in-out infinite; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
      `}</style>
    </div>
  );
}
