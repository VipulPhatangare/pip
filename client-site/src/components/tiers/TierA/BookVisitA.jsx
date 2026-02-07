// Tier A - Abundance Mode: Book Visit with Sequential Animations
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPropertyById } from '../../../data/properties';

export default function BookVisitA() {
  const { id } = useParams();
  const property = getPropertyById(id);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    message: ''
  });

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
    const booking = {
      id: Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      date: formData.date,
      time: formData.time,
      message: formData.message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    setShowSuccess(true);
    setTimeout(() => navigate('/dashboard'), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
          initial={{ x: Math.random() * window.innerWidth, y: -20 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [0.7, 0]
          }}
          transition={{
            duration: Math.random() * 8 + 5,
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
          Schedule a Visit
        </motion.h1>
        <motion.p
          className="text-purple-300 text-center mb-12 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Book your personalized property tour with our expert consultants
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
                {/* Date Field */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    <span>Preferred Date</span>
                  </label>
                  <motion.input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white focus:border-purple-400 focus:outline-none transition-colors"
                    whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
                  />
                </motion.div>

                {/* Time Field */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🕐</span>
                    <span>Preferred Time</span>
                  </label>
                  <motion.select
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white focus:border-purple-400 focus:outline-none transition-colors"
                    whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
                  >
                    <option value="">Select a time</option>
                    <option value="09:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">2:00 PM</option>
                    <option value="03:00 PM">3:00 PM</option>
                    <option value="04:00 PM">4:00 PM</option>
                    <option value="05:00 PM">5:00 PM</option>
                  </motion.select>
                </motion.div>

                {/* Message Field */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">💬</span>
                    <span>Additional Notes (Optional)</span>
                  </label>
                  <motion.textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any specific areas you'd like to focus on during the visit?"
                    className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none resize-none transition-colors"
                    whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg shadow-2xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 25px 50px rgba(168, 85, 247, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  🎉 Confirm Booking
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Property Card */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-purple-500/20 sticky top-24"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.img
                src={property.images.high[0]}
                alt={property.title}
                className="w-full h-56 object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{property.title}</h3>
                <p className="text-purple-300 mb-4 flex items-center gap-2">
                  <span>📍</span>
                  {property.location.city}
                </p>
                
                <motion.div
                  className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ₹{(property.price / 10000000).toFixed(2)}Cr
                </motion.div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: '🛏️', value: property.specs.beds },
                    { icon: '🚿', value: property.specs.baths },
                    { icon: '📐', value: property.specs.sqft }
                  ].map((spec, index) => (
                    <motion.div
                      key={index}
                      className="text-center bg-purple-900/30 rounded-xl p-3"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="text-2xl mb-1">{spec.icon}</div>
                      <div className="text-white font-bold">{spec.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Agent Info */}
                <div className="flex items-center gap-3 pt-6 border-t border-purple-500/20">
                  <motion.img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    className="w-14 h-14 rounded-full border-2 border-purple-500"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  />
                  <div>
                    <div className="font-semibold text-white">{property.agent.name}</div>
                    <div className="text-sm text-purple-300">Your Guide</div>
                  </div>
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
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 max-w-md text-center shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.6 }}
              >
                ✅
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">Visit Booked!</h2>
              <p className="text-white/90 text-lg mb-2">
                Your visit is confirmed for
              </p>
              <p className="text-white font-bold text-xl mb-6">
                {formData.date} at {formData.time}
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
