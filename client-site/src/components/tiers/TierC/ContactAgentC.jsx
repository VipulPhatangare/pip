// Tier C - Minimal Mode: Contact Agent with Tailwind
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';

export default function ContactAgentC() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <Link to="/properties">
            <button className="px-6 py-2 rounded-lg bg-purple-600 text-white">Back to Properties</button>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h2>
          <p className="text-gray-600 mb-4">The agent will respond to you shortly.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to={`/property/${id}`} className="text-purple-600 hover:text-purple-700 font-medium">
            ← Back to Property
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Agent</h1>
              <p className="text-gray-600 mb-6">Send a message to the property agent</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Write your message here..."
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                    required
                  />
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <span className="font-semibold">Tip:</span> Include your preferred contact method and time in your message for faster response.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Property Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property</h3>
              <img
                src={property.images.low}
                alt={property.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
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
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Agent Details</h3>
              <div className="text-center mb-4">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-purple-100"
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
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
              <p className="text-sm text-green-800 font-semibold mb-1">⚡ Quick Response</p>
              <p className="text-xs text-green-700">Average response time: 2-4 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
