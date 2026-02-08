// Tier B - Constraint Mode: Contact Agent with CSS Animations
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';
import { useFormStore } from '../../../store/formStore';

export default function ContactAgentB() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  
  // Use formStore for persistence across tier changes
  const { getFormData, updateField } = useFormStore();
  const formId = `contactAgent-${id}`;
  const savedData = getFormData(formId);
  
  const [formData, setFormData] = useState({
    name: savedData.name || '',
    email: savedData.email || '',
    phone: savedData.phone || '',
    subject: savedData.subject || 'General Inquiry',
    message: savedData.message || ''
  });
  const [success, setSuccess] = useState(false);
  
  // Sync formData with formStore on every change
  useEffect(() => {
    Object.keys(formData).forEach(key => {
      updateField(formId, key, formData[key]);
    });
  }, [formData, formId, updateField]);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <Link to="/properties">
            <button className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:scale-105 transition-transform">Back to Properties</button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const inquiry = {
      id: Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      agentName: property.agent.name,
      ...formData,
      status: 'sent',
      createdAt: new Date().toISOString()
    };

    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    inquiries.push(inquiry);
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
    
    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center animate-zoom-in">
          <div className="text-6xl mb-4 animate-bounce-slow">📨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h2>
          <p className="text-gray-600 mb-4">The agent will respond to you shortly.</p>
          <p className="text-sm text-gray-500 animate-pulse">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-purple-100 animate-slide-down">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to={`/property/${id}`} className="text-purple-600 hover:text-purple-700 font-medium hover:translate-x-1 transition-transform inline-block">
            ← Back to Property
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Contact Agent
              </h1>
              <p className="text-gray-600 mb-6">Send a message to the property agent</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="animate-slide-in-left delay-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="animate-slide-in-left delay-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="animate-slide-in-right delay-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="animate-fade-in delay-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                    required
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Schedule Visit">Schedule Visit</option>
                    <option value="Price Negotiation">Price Negotiation</option>
                    <option value="Request Documents">Request Documents</option>
                    <option value="Financing Options">Financing Options</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="animate-fade-in delay-400">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Write your message here..."
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                    required
                  />
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 rounded-lg animate-fade-in delay-500">
                  <p className="text-sm text-blue-800">
                    💡 <span className="font-semibold">Tip:</span> Include your preferred contact method and time in your message for faster response.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in delay-600"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Property Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 animate-fade-in-right">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property</h3>
              <img
                src={property.images.medium[0]}
                alt={property.title}
                className="w-full h-40 object-cover rounded-xl mb-4 hover:scale-105 transition-transform duration-500"
              />
              <h4 className="font-bold text-gray-900 mb-2">{property.title}</h4>
              <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                <span>📍</span>
                {property.location.area}, {property.location.city}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span>🛏️ {property.specs.beds}</span>
                <span>🚿 {property.specs.baths}</span>
                <span>📐 {property.specs.sqft} sqft</span>
              </div>
            </div>

            {/* Agent Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 animate-fade-in-right delay-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Agent Details</h3>
              <div className="text-center mb-4">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-purple-100 hover:scale-110 transition-transform duration-300"
                />
                <h4 className="font-bold text-gray-900 mb-1">{property.agent.name}</h4>
                <p className="text-sm text-gray-600">Property Consultant</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span>📞</span>
                  <span>{property.agent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span>📧</span>
                  <span className="text-xs">{property.agent.email}</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 animate-fade-in-right delay-400">
              <p className="text-sm text-green-800 font-semibold mb-1">⚡ Quick Response</p>
              <p className="text-xs text-green-700">Average response time: 2-4 hours</p>
            </div>
          </div>
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
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-slide-down { animation: slideDown 0.6s ease-out; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        .animate-fade-in-right { animation: fadeInRight 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-left { animation: slideInLeft 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-right { animation: slideInRight 0.6s ease-out forwards; opacity: 0; }
        .animate-zoom-in { animation: zoomIn 0.5s ease-out; }
        .animate-bounce-slow { animation: bounceSlow 1s ease-in-out infinite; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
      `}</style>
    </div>
  );
}
