// Tier C - Minimal Mode: Properties List with Tailwind
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { properties, getCities, getPropertyTypes } from '../../../data/properties';

export default function PropertiesListC() {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto container-padding py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Properties</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Found {filteredProperties.length} properties</p>
            </div>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-4 py-2 rounded-lg border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors btn-touch text-sm sm:text-base">
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
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm btn-touch"
                  >
                    <option value="">All Cities</option>
                    {getCities().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm btn-touch"
                  >
                    <option value="">All Types</option>
                    {getPropertyTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Min Price (Lakhs)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm btn-touch"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Max Price (Lakhs)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    placeholder="500"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm btn-touch"
                  />
                </div>

                <button
                  onClick={() => setFilters({ city: '', type: '', minPrice: '', maxPrice: '' })}
                  className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors btn-touch text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredProperties.map(property => (
                <Link key={property.id} to={`/property/${property.id}`}>
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={property.images.low}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
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

                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-gray-500">{property.specs.type}</span>
                        <button className="text-purple-600 font-medium hover:text-purple-700">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
