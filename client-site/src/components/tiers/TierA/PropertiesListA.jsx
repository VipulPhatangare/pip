// Tier A - Abundance Mode: Properties List with Framer Motion
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { properties, getCities, getPropertyTypes } from '../../../data/properties';

export default function PropertiesListA() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        className="bg-black/30 backdrop-blur-xl shadow-2xl border-b border-purple-500/20 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto container-padding py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Luxury Properties
              </h1>
              <p className="text-purple-200 mt-1 text-sm sm:text-base">Found {filteredProperties.length} premium properties</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link to="/dashboard" className="block">
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 border-purple-400 text-purple-300 hover:bg-purple-500/20 backdrop-blur-sm transition-all btn-touch text-sm sm:text-base">
                  My Dashboard
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto container-padding py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Filters Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-purple-500/20 lg:sticky lg:top-24">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Filters</h2>
              
              <div className="space-y-4 sm:space-y-5">
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-purple-300 mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-purple-900/50 border border-purple-500/30 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 transition-all text-sm sm:text-base btn-touch"
                  >
                    <option value="">All Cities</option>
                    {getCities().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Property Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-purple-900/50 border border-purple-500/30 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 transition-all text-sm sm:text-base btn-touch"
                  >
                    <option value="">All Types</option>
                    {getPropertyTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Min Price (Lakhs)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl bg-purple-900/50 border border-purple-500/30 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 transition-all"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Max Price (Lakhs)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    placeholder="500"
                    className="w-full px-4 py-3 rounded-xl bg-purple-900/50 border border-purple-500/30 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 transition-all"
                  />
                </motion.div>

                <motion.button
                  onClick={() => setFilters({ city: '', type: '', minPrice: '', maxPrice: '' })}
                  className="w-full py-3 rounded-xl border border-purple-400/50 text-purple-300 hover:bg-purple-500/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Filters
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ 
                      y: -10,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    <Link to={`/property/${property.id}`}>
                      <div className="bg-black/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-purple-500/20 hover:border-purple-400/50 transition-all group">
                        <div className="relative overflow-hidden">
                          <motion.img
                            src={property.images.high[0]}
                            alt={property.title}
                            className="w-full h-48 sm:h-56 md:h-64 object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <motion.div
                            className="absolute top-3 sm:top-4 right-3 sm:right-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-600/90 backdrop-blur-sm text-white font-semibold text-xs sm:text-sm"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                          >
                            {property.specs.type}
                          </motion.div>
                        </div>
                        <div className="p-4 sm:p-6">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 line-clamp-2">{property.title}</h3>
                          <motion.p
                            className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 sm:mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {formatPrice(property.price)}
                          </motion.p>
                          
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-300 mb-3 sm:mb-4">
                            <span>📍</span>
                            <span className="truncate">{property.location.area}, {property.location.city}</span>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-purple-200 pb-3 sm:pb-4 border-b border-purple-500/20">
                            <span>🛏️ {property.specs.beds}</span>
                            <span>🚿 {property.specs.baths}</span>
                            <span>📐 {property.specs.sqft} sqft</span>
                          </div>

                          <div className="mt-3 sm:mt-4 flex justify-end">
                            <motion.span
                              className="text-purple-400 font-medium group-hover:text-purple-300"
                              whileHover={{ x: 5 }}
                            >
                              View Details →
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProperties.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
              >
                <motion.div
                  className="text-8xl mb-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏠
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-3">No properties found</h3>
                <p className="text-purple-300">Try adjusting your filters</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
