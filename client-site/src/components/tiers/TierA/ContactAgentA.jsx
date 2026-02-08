// Tier A - Abundance Mode: Contact Agent with Staggered Animations
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPropertyById } from '../../../data/properties';
import { useFormStore } from '../../../store/formStore';

export default function ContactAgentA() {
  const { id } = useParams();
  const property = getPropertyById(id);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Use formStore for persistence across tier changes
  const { getFormData, updateField } = useFormStore();
  const formId = `contactAgent-${id}`;
  const savedData = getFormData(formId);
  
  const [formData, setFormData] = useState({
    name: savedData.name || '',
    email: savedData.email || '',
    phone: savedData.phone || '',
    subject: savedData.subject || '',
    message: savedData.message || ''
  });
  
  // Sync formData with formStore on every change
  useEffect(() => {
    Object.keys(formData).forEach(key => {
      updateField(formId, key, formData[key]);
    });
  }, [formData, formId, updateField]);

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl mb-4">Property not found</h2>
          <Link to="/properties" className="text-purple-300">Back to Properties</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const inquiry = {
      id: Date.now(),
      propertyId: property.id,
      agentName: property.agent.name,
      ...formData,
      createdAt: new Date().toISOString()
    };

    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    inquiries.push(inquiry);
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
    
    setShowSuccess(true);
    setTimeout(() => navigate('/dashboard'), 2500);
  };

  const subjects = [
    'General Inquiry',
    'Schedule a Visit',
    'Price Negotiation',
    'Documentation',
    'Financing Options',
    'Property Details'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            backgroundColor: i % 3 === 0 ? '#c084fc' : i % 3 === 1 ? '#f472b6' : '#60a5fa'
          }}
          initial={{ x: Math.random() * window.innerWidth, y: -20 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [0.8, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Header */}
      <motion.div
        className="bg-black/30 backdrop-blur-xl shadow-2xl border-b border-purple-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to={`/property/${property.id}`} className="text-purple-300 hover:text-purple-200 font-medium flex items-center gap-2">
            <motion.span whileHover={{ x: -5 }}>←</motion.span> Back to Property
          </Link>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <motion.h1
          className="text-5xl font-bold text-white mb-3 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Contact Agent
        </motion.h1>
        <motion.p
          className="text-purple-300 text-center mb-12 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Get expert guidance from our property consultants
        </motion.p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/20"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <span>Your Name</span>
                  </label>
                  <motion.input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-colors"
                    whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">📧</span>
                    <span>Email Address</span>
                  </label>
                  <motion.input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-colors"
                    whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
                  />
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">📞</span>
                    <span>Phone Number</span>
                  </label>
                  <motion.input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-colors"
                    whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
                  />
                </motion.div>

                {/* Subject Field */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    <span>Subject</span>
                  </label>
                  <motion.select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white focus:border-purple-400 focus:outline-none transition-colors"
                    whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))}
                  </motion.select>
                </motion.div>

                {/* Message Field */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <span>Your Message</span>
                  </label>
                  <motion.textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your requirements..."
                    className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none resize-none transition-colors"
                    whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
                  />
                  <motion.div
                    className="text-right text-sm text-purple-300 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    {formData.message.length} characters
                  </motion.div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg shadow-2xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 25px 50px rgba(168, 85, 247, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-3">
                    <span>📤</span>
                    <span>Send Message</span>
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Agent Card */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden sticky top-24"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Property Preview */}
              <motion.img
                src={property.images.high[0]}
                alt={property.title}
                className="w-full h-48 object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{property.title}</h3>
                <p className="text-purple-300 mb-4 flex items-center gap-2 text-sm">
                  <span>📍</span>
                  {property.location.city}
                </p>

                {/* Agent Info */}
                <div className="border-t border-purple-500/20 pt-6">
                  <motion.div
                    className="text-center mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.img
                      src={property.agent.photo}
                      alt={property.agent.name}
                      className="w-28 h-28 rounded-full mx-auto mb-3 border-4 border-purple-500"
                      animate={{ 
                        boxShadow: [
                          '0 0 20px rgba(168, 85, 247, 0.5)',
                          '0 0 40px rgba(168, 85, 247, 0.8)',
                          '0 0 20px rgba(168, 85, 247, 0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <h4 className="font-bold text-white text-lg">{property.agent.name}</h4>
                    <p className="text-purple-300 text-sm">Senior Property Consultant</p>
                  </motion.div>

                  {/* Agent Stats */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: '⭐', label: 'Rating', value: '4.9/5' },
                      { icon: '🏆', label: 'Deals Closed', value: '150+' },
                      { icon: '🕐', label: 'Avg Response', value: '< 2 hours' }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between bg-purple-900/30 rounded-xl p-3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ x: -5 }}
                      >
                        <span className="text-purple-300 flex items-center gap-2">
                          <span className="text-xl">{stat.icon}</span>
                          <span>{stat.label}</span>
                        </span>
                        <span className="font-bold text-white">{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Response Badge */}
                  <motion.div
                    className="bg-green-500/20 border border-green-500/40 rounded-xl p-3 text-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-green-300 font-semibold flex items-center justify-center gap-2">
                      <span>⚡</span>
                      <span>Quick Response Guaranteed</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 max-w-md text-center shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{ duration: 0.8 }}
              >
                📨
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">Message Sent!</h2>
              <p className="text-white/90 text-lg mb-2">
                Your inquiry has been received
              </p>
              <p className="text-white text-sm mb-6">
                {property.agent.name} will respond within 2 hours
              </p>
              <motion.div
                className="inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <p className="text-white/80">Redirecting to dashboard...</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
