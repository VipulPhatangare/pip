// Tier B - Constraint Mode: Properties List with CSS Animations
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { properties, getCities, getPropertyTypes } from '../../../data/properties';

export default function PropertiesListB() {
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    minPrice: '',
    maxPrice: ''
  });

  const filteredProperties = properties.filter(property => {
    if (filters.city && property.location.city !== filters.city) return false;
    if (filters.type && property.specs.type !== filters.type) return false;
    if (filters.minPrice && property.price < Number(filters.minPrice) * 100000) return false;
    if (filters.maxPrice && property.price > Number(filters.maxPrice) * 100000) return false;
    return true;
  });

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
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto container-padding py-4 sm:py-6 animate-slide-down">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                All Properties
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Found {filteredProperties.length} properties</p>
            </div>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-4 py-2 rounded-lg border-2 border-purple-200 text-purple-600 hover:border-purple-500 hover:scale-105 transition-all duration-300 btn-touch text-sm sm:text-base">
                My Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24 animate-fade-in-left">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div className="animate-fade-in delay-100">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300 text-sm btn-touch"
                  >
                    <option value="">All Cities</option>
                    {getCities().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="animate-fade-in delay-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                  >
                    <option value="">All Types</option>
                    {getPropertyTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="animate-fade-in delay-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (Lakhs)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                  />
                </div>

                <div className="animate-fade-in delay-400">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (Lakhs)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    placeholder="500"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:scale-105 transition-all duration-300"
                  />
                </div>

                <button
                  onClick={() => setFilters({ city: '', type: '', minPrice: '', maxPrice: '' })}
                  className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-300 animate-fade-in delay-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredProperties.map((property, index) => (
                <Link key={property.id} to={`/property/${property.id}`}>
                  <div 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={property.images.medium[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-purple-600 animate-pulse-slow">
                        {property.specs.type}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                      <p className="text-2xl font-bold text-purple-600 mb-3">
                        {formatPrice(property.price)}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span>📍</span>
                        <span>{property.location.area}, {property.location.city}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-700 pb-3 border-b border-gray-200">
                        <span>🛏️ {property.specs.beds} Beds</span>
                        <span>🚿 {property.specs.baths} Baths</span>
                        <span>📐 {property.specs.sqft} sqft</span>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button className="text-purple-600 font-medium hover:text-purple-700 hover:translate-x-1 transition-transform duration-300">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="text-6xl mb-4 animate-bounce-slow">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            )}
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
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-slide-down { animation: slideDown 0.6s ease-out; }
        .animate-fade-in-left { animation: fadeInLeft 0.6s ease-out; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; opacity: 0; }
        .animate-bounce-slow { animation: bounceSlow 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulseSlow 2s ease-in-out infinite; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>
    </div>
  );
}
