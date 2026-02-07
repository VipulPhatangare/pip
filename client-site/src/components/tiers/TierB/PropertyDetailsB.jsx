// Tier B - Constraint Mode: Property Details with Simple 3D Visualization
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../../../data/properties';

// Simple CSS 3D House Visualization
function Simple3DViewer() {
  const [rotation, setRotation] = useState(0);

  return (
    <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div 
        className="relative"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* 3D House CSS Model */}
        <div 
          className="relative w-48 h-48"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Base */}
          <div 
            className="absolute w-48 h-12 bg-amber-700"
            style={{ 
              transform: 'translateY(84px) translateZ(-24px)',
              transformStyle: 'preserve-3d'
            }}
          />
          
          {/* Front Wall */}
          <div 
            className="absolute w-48 h-40 bg-amber-100 border-4 border-amber-900"
            style={{ 
              transform: 'translateY(32px) translateZ(24px)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Door */}
            <div className="absolute bottom-0 left-16 w-12 h-20 bg-amber-900" />
            {/* Windows */}
            <div className="absolute top-8 left-8 w-12 h-12 bg-blue-200 border-2 border-blue-400" />
            <div className="absolute top-8 right-8 w-12 h-12 bg-blue-200 border-2 border-blue-400" />
          </div>
          
          {/* Back Wall */}
          <div 
            className="absolute w-48 h-40 bg-amber-200 border-4 border-amber-900"
            style={{ 
              transform: 'translateY(32px) translateZ(-72px) rotateY(180deg)',
              transformStyle: 'preserve-3d'
            }}
          />
          
          {/* Left Wall */}
          <div 
            className="absolute w-48 h-40 bg-amber-50 border-4 border-amber-900"
            style={{ 
              transform: 'translateY(32px) translateX(-72px) rotateY(-90deg)',
              transformStyle: 'preserve-3d'
            }}
          />
          
          {/* Right Wall */}
          <div 
            className="absolute w-48 h-40 bg-amber-50 border-4 border-amber-900"
            style={{ 
              transform: 'translateY(32px) translateX(72px) rotateY(90deg)',
              transformStyle: 'preserve-3d'
            }}
          />
          
          {/* Roof */}
          <div 
            className="absolute w-48 h-32 bg-red-900"
            style={{ 
              transform: 'translateY(12px) translateX(24px) rotateZ(-45deg)',
              transformOrigin: 'left top',
              transformStyle: 'preserve-3d'
            }}
          />
          <div 
            className="absolute w-48 h-32 bg-red-800"
            style={{ 
              transform: 'translateY(12px) translateX(24px) rotateZ(45deg)',
              transformOrigin: 'right top',
              transformStyle: 'preserve-3d'
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
        <button
          onClick={() => setRotation(r => r - 45)}
          className="px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
        >
          ← Rotate Left
        </button>
        <button
          onClick={() => setRotation(0)}
          className="px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
        >
          Reset
        </button>
        <button
          onClick={() => setRotation(r => r + 45)}
          className="px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
        >
          Rotate Right →
        </button>
      </div>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-gray-700 shadow-lg">
        🏠 3D CSS Visualization • Click buttons to rotate
      </div>
    </div>
  );
}

export default function PropertyDetailsB() {
  const { id } = useParams();
  const property = getPropertyById(id);
  const [showViewer, setShowViewer] = useState(true);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <Link to="/properties">
            <button className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:scale-105 transition-transform">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-purple-100 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/properties" className="text-purple-600 hover:text-purple-700 font-medium hover:translate-x-1 transition-transform inline-block">
            ← Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image & 3D Viewer Toggle */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setShowViewer(false)}
                  className={`flex-1 py-3 font-semibold transition-all duration-300 ${
                    !showViewer ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  📷 Photos
                </button>
                <button
                  onClick={() => setShowViewer(true)}
                  className={`flex-1 py-3 font-semibold transition-all duration-300 ${
                    showViewer ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🏠 3D View
                </button>
              </div>

              {showViewer ? (
                <div className="h-96 animate-fade-in">
                  <Simple3DViewer />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 p-2">
                  {property.images.medium.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in delay-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span>📍</span>
                    {property.location.address}, {property.location.area}, {property.location.city}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium animate-pulse-slow">
                  {property.status}
                </span>
              </div>

              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                {formatPrice(property.price)}
              </div>

              {/* Specs */}
              <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                {[
                  { icon: '🛏️', value: property.specs.beds, label: 'Bedrooms' },
                  { icon: '🚿', value: property.specs.baths, label: 'Bathrooms' },
                  { icon: '📐', value: property.specs.sqft, label: 'Sq Ft' },
                  { icon: '🚗', value: property.specs.parking, label: 'Parking' }
                ].map((spec, index) => (
                  <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="text-2xl mb-1">{spec.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{spec.value}</div>
                    <div className="text-sm text-gray-600">{spec.label}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-6 animate-fade-in delay-400">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              <div className="animate-fade-in delay-500">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Features</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 text-gray-700 animate-slide-in-right"
                      style={{ animationDelay: `${600 + index * 50}ms` }}
                    >
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
            <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-left">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Agent</h3>
              <div className="text-center mb-4">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-purple-100 hover:scale-110 transition-transform duration-300"
                />
                <h4 className="font-bold text-gray-900">{property.agent.name}</h4>
              </div>
              
              <div className="space-y-3">
                <button className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <span>📞</span>
                  <span>{property.agent.phone}</span>
                </button>
                <button className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <span>📧</span>
                  <span className="text-sm">{property.agent.email}</span>
                </button>
                <Link to={`/contact-agent/${property.id}`}>
                  <button className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 hover:scale-105 hover:shadow-xl transition-all duration-300">
                    Send Message
                  </button>
                </Link>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-left delay-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link to={`/book-visit/${property.id}`}>
                  <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    Book a Visit
                  </button>
                </Link>
                <Link to={`/payment-request/${property.id}`}>
                  <button className="w-full py-3 rounded-lg border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 hover:scale-105 transition-all duration-300">
                    Make an Offer
                  </button>
                </Link>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-left delay-400">
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

      {/* CSS Animations */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-slide-down { animation: slideDown 0.6s ease-out; }
        .animate-fade-in-left { animation: fadeInLeft 0.6s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; opacity: 0; }
        .animate-pulse-slow { animation: pulseSlow 2s ease-in-out infinite; }
        .delay-200 { animation-delay: 200ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>
    </div>
  );
}
