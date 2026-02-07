// Tier A - Abundance Mode: Property Details with Framer Motion & Image Gallery
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPropertyById } from '../../../data/properties';

export default function PropertyDetailsA() {
  const { id } = useParams();
  const property = getPropertyById(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Property not found</h2>
          <Link to="/properties">
            <motion.button
              className="px-8 py-3 rounded-xl bg-purple-600 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Properties
            </motion.button>
          </Link>
        </motion.div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-purple-400 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: -20 }}
            animate={{
              y: window.innerHeight + 20,
              opacity: [0.8, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        className="bg-black/30 backdrop-blur-xl shadow-2xl border-b border-purple-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.div whileHover={{ x: -5 }}>
            <Link to="/properties" className="text-purple-300 hover:text-purple-200 font-medium flex items-center gap-2">
              <span>←</span> Back to Properties
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-purple-500/20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={property.images.high[selectedImage]}
                  alt={property.title}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => setShowLightbox(true)}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                />
              </AnimatePresence>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-black/30">
                {property.images.high.map((img, index) => (
                  <motion.img
                    key={index}
                    src={img}
                    alt={`${property.title} ${index + 1}`}
                    className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedImage === index ? 'border-purple-400' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Property Info */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <motion.h1
                    className="text-4xl font-bold text-white mb-3"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {property.title}
                  </motion.h1>
                  <p className="text-purple-300 flex items-center gap-2">
                    <span>📍</span>
                    {property.location.address}, {property.location.area}, {property.location.city}
                  </p>
                </div>
                <motion.span
                  className="px-4 py-2 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 font-medium"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {property.status}
                </motion.span>
              </div>

              <motion.div
                className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-8"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                {formatPrice(property.price)}
              </motion.div>

              {/* Specs */}
              <div className="grid grid-cols-4 gap-6 mb-8 pb-8 border-b border-purple-500/20">
                {[
                  { icon: '🛏️', value: property.specs.beds, label: 'Bedrooms' },
                  { icon: '🚿', value: property.specs.baths, label: 'Bathrooms' },
                  { icon: '📐', value: property.specs.sqft, label: 'Sq Ft' },
                  { icon: '🚗', value: property.specs.parking, label: 'Parking' }
                ].map((spec, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="text-4xl mb-2">{spec.icon}</div>
                    <div className="text-3xl font-bold text-white">{spec.value}</div>
                    <div className="text-sm text-purple-300">{spec.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                <p className="text-purple-200 leading-relaxed">{property.description}</p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Premium Features</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-purple-200 bg-purple-900/30 rounded-xl p-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + index * 0.05 }}
                      whileHover={{ x: 5, backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                    >
                      <span className="text-purple-400 text-xl">✓</span>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Agent Card */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Contact Agent</h3>
              <div className="text-center mb-6">
                <motion.img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-purple-500"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
                <h4 className="font-bold text-white text-lg">{property.agent.name}</h4>
                <p className="text-purple-300 text-sm">Property Consultant</p>
              </div>
              
              <div className="space-y-3">
                <motion.button
                  className="w-full py-3 rounded-xl border border-purple-500/50 text-purple-300 hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>📞</span>
                  <span>{property.agent.phone}</span>
                </motion.button>
                <motion.button
                  className="w-full py-3 rounded-xl border border-purple-500/50 text-purple-300 hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>📧</span>
                  <span className="text-sm">{property.agent.email}</span>
                </motion.button>
                <Link to={`/contact-agent/${property.id}`}>
                  <motion.button
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send Message
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Actions Card */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to={`/book-visit/${property.id}`}>
                  <motion.button
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📅 Book a Visit
                  </motion.button>
                </Link>
                <Link to={`/payment-request/${property.id}`}>
                  <motion.button
                    className="w-full py-4 rounded-xl border-2 border-purple-500 text-purple-300 font-semibold"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💰 Make an Offer
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Property Info */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Property Info</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Type', value: property.specs.type },
                  { label: 'Year Built', value: property.yearBuilt },
                  { label: 'Status', value: property.status }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between py-2 border-b border-purple-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <span className="text-purple-300">{item.label}:</span>
                    <span className="font-medium text-white">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLightbox(false)}
          >
            <motion.img
              src={property.images.high[selectedImage]}
              alt={property.title}
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
            <button
              className="absolute top-8 right-8 text-white text-4xl hover:text-purple-400"
              onClick={() => setShowLightbox(false)}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
