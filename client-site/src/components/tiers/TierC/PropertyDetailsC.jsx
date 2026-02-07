// Tier C - Minimal Mode: Property Details with Tailwind
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';

export default function PropertyDetailsC() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font
-bold text-gray-900 mb-4">Property not found</h2>
          <Link to="/properties">
            <button className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
              Back to Properties
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/properties" className="text-purple-600 hover:text-purple-700 font-medium">
            ← Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Image */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img
                src={property.images.low}
                alt={property.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span>📍</span>
                    {property.location.address}, {property.location.area}, {property.location.city}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  {property.status}
                </span>
              </div>

              <div className="text-4xl font-bold text-purple-600 mb-6">
                {formatPrice(property.price)}
              </div>

              {/* Specs */}
              <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="text-center">
                  <div className="text-2xl mb-1">🛏️</div>
                  <div className="text-2xl font-bold text-gray-900">{property.specs.beds}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🚿</div>
                  <div className="text-2xl font-bold text-gray-900">{property.specs.baths}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📐</div>
                  <div className="text-2xl font-bold text-gray-900">{property.specs.sqft}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🚗</div>
                  <div className="text-2xl font-bold text-gray-900">{property.specs.parking}</div>
                  <div className="text-sm text-gray-600">Parking</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Features</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="text-purple-600">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Agent</h3>
              <div className="text-center mb-4">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-purple-100"
                />
                <h4 className="font-bold text-gray-900">{property.agent.name}</h4>
              </div>
              
              <div className="space-y-3">
                <button className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <span>📞</span>
                  <span>{property.agent.phone}</span>
                </button>
                <button className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <span>📧</span>
                  <span className="text-sm">{property.agent.email}</span>
                </button>
                <Link to={`/contact-agent/${property.id}`}>
                  <button className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors">
                    Send Message
                  </button>
                </Link>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link to={`/book-visit/${property.id}`}>
                  <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-shadow">
                    Book a Visit
                  </button>
                </Link>
                <Link to={`/payment-request/${property.id}`}>
                  <button className="w-full py-3 rounded-lg border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-colors">
                    Make an Offer
                  </button>
                </Link>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">{property.specs.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-medium text-gray-900">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">{property.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
