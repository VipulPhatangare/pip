// Tier C - Minimal Mode: Payment Request with Tailwind
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';

export default function PaymentRequestC() {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">💰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">The agent will review your offer and contact you.</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Make an Offer</h1>
              <p className="text-gray-600 mb-6">Submit your payment details and offer amount</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Offer Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.offerAmount}
                    onChange={(e) => setFormData({...formData, offerAmount: e.target.value})}
                    placeholder="Enter your offer amount"
                    min="100000"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Listed price: {formatPrice(property.price)}
                  </p>
                </div>

                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type *
                  </label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    required
                  >
                    <option value="token">Token Amount</option>
                    <option value="downpayment">Down Payment</option>
                    <option value="full">Full Payment</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'netbanking', label: '🏦 Net Banking' },
                      { value: 'card', label: '💳 Credit/Debit Card' },
                      { value: 'upi', label: '📱 UPI' },
                      { value: 'cheque', label: '📝 Cheque' }
                    ].map(method => (
                      <label
                        key={method.value}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.paymentMethod === method.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
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
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
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

                    <div className="grid md:grid-cols-2 gap-4">
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
                        Additional Notes (Optional)
                      </label>
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

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <span className="font-semibold">Note:</span> This is an offer submission. Final payment processing will require verification and agreement from both parties.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                >
                  Submit Offer
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Property Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property Summary</h3>
              <img
                src={property.images.low}
                alt={property.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h4 className="font-bold text-gray-900 mb-2">{property.title}</h4>
              <p className="text-2xl font-bold text-purple-600 mb-3">
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
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Secure payment processing</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>24-hour offer validity</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Agent verification required</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>No hidden charges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
