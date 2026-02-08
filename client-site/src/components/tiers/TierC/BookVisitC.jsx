// Tier C - Minimal Mode: Book Visit with Tailwind
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';
import { useFormStore } from '../../../store/formStore';

export default function BookVisitC() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  
  // Use formStore for persistence across tier changes
  const { getFormData, updateField } = useFormStore();
  const formId = `bookVisit-${id}`;
  const savedData = getFormData(formId);
  
  const [formData, setFormData] = useState({
    date: savedData.date || '',
    time: savedData.time || '',
    name: savedData.name || '',
    phone: savedData.phone || '',
    email: savedData.email || '',
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
    
    const booking = {
      id: Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Visit Booked Successfully!</h2>
          <p className="text-gray-600 mb-4">The agent will contact you to confirm the visit.</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Visit</h1>
              <p className="text-gray-600 mb-6">Schedule a property viewing at your convenience</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    >
                      <option value="">Select time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>

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

                <div className="grid md:grid-cols-2 gap-5">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Any specific requirements or questions..."
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>

          {/* Property Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property Details</h3>
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
              <div className="flex items-center gap-3 text-sm text-gray-700 mb-4 pb-4 border-b border-gray-200">
                <span>🛏️ {property.specs.beds}</span>
                <span>🚿 {property.specs.baths}</span>
                <span>📐 {property.specs.sqft} sqft</span>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Agent</div>
                <div className="font-semibold text-gray-900">{property.agent.name}</div>
                <div className="text-sm text-gray-600">{property.agent.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
