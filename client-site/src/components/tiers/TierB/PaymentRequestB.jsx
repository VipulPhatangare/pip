// Tier B - Constraint Mode: Payment Request with CSS Animations
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';

export default function PaymentRequestB() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const [formData, setFormData] = useState({
    offerAmount: '',
    paymentType: 'token',
    paymentMethod: 'netbanking',
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

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
    
    const paymentRequest = {
      id: Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      offerAmount: formData.offerAmount,
      paymentType: formData.paymentType,
      paymentMethod: formData.paymentMethod,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const paymentRequests = JSON.parse(localStorage.getItem('paymentRequests') || '[]');
    paymentRequests.push(paymentRequest);
    localStorage.setItem('paymentRequests', JSON.stringify(paymentRequests));
    
    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 2500);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center animate-zoom-in">
          <div className="text-6xl mb-4 animate-bounce-slow">💰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">The agent will review your offer and contact you.</p>
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
                Make an Offer
              </h1>
              <p className="text-gray-600 mb-6">Submit your payment details and offer amount</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Offer Amount */}
                <div className="animate-slide-in-left delay-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Amount (₹) *</label>
                  <input
                    type="number"
                    value={formData.offerAmount}
                    onChange={(e) => setFormData({...formData, offerAmount: e.target.value})}
                    placeholder="Enter your offer amount"
                    min="100000"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Listed price: {formatPrice(property.price)}
                  </p>
                </div>

                {/* Payment Type */}
                <div className="animate-fade-in delay-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type *</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                    required
                  >
                    <option value="token">Token Amount</option>
                    <option value="downpayment">Down Payment</option>
                    <option value="full">Full Payment</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div className="animate-fade-in delay-300">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'netbanking', label: '🏦 Net Banking' },
                      { value: 'card', label: '💳 Credit/Debit Card' },
                      { value: 'upi', label: '📱 UPI' },
                      { value: 'cheque', label: '📝 Cheque' }
                    ].map((method, index) => (
                      <label
                        key={method.value}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 animate-fade-up ${
                          formData.paymentMethod === method.value
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        style={{ animationDelay: `${400 + index * 50}ms` }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                          className="sr-only"
                        />
                        <span className="font-medium text-gray-900">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 animate-fade-in delay-600">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="animate-slide-in-left delay-700">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="animate-slide-in-left delay-800">
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

                      <div className="animate-slide-in-right delay-800">
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

                    <div className="animate-fade-in delay-900">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Any special terms or conditions..."
                        rows="3"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-lg animate-fade-in delay-1000">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <span className="font-semibold">Note:</span> This is an offer submission. Final payment processing will require verification and agreement from both parties.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in delay-1100"
                >
                  Submit Offer
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Property Summary */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 animate-fade-in-right">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property Summary</h3>
              <img
                src={property.images.medium[0]}
                alt={property.title}
                className="w-full h-40 object-cover rounded-xl mb-4 hover:scale-105 transition-transform duration-500"
              />
              <h4 className="font-bold text-gray-900 mb-2">{property.title}</h4>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {formatPrice(property.price)}
              </p>
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

            {/* Payment Info */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 animate-fade-in-right delay-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-700">
                {[
                  'Secure payment processing',
                  '24-hour offer validity',
                  'Agent verification required',
                  'No hidden charges'
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex gap-2 animate-slide-in-right"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <span className="text-green-600">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; opacity: 0; }
        .animate-fade-in-right { animation: fadeInRight 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-left { animation: slideInLeft 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-right { animation: slideInRight 0.6s ease-out forwards; opacity: 0; }
        .animate-zoom-in { animation: zoomIn 0.5s ease-out; }
        .animate-bounce-slow { animation: bounceSlow 1s ease-in-out infinite; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1100 { animation-delay: 1100ms; }
      `}</style>
    </div>
  );
}
