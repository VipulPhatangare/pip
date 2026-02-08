// Tier A - Abundance Mode: Dashboard with Animated Stats
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPropertyById } from '../../../data/properties';

export default function DashboardA() {
  const navigate = useNavigate();
  const currentUser = { name: 'Demo User', email: 'demo@test.com' }; // Always logged in
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const storedInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    setBookings(storedBookings);
    setInquiries(storedInquiries);
  }, []);

  const handleLogout = () => {
    // No logout in public mode
  };

  const stats = [
    { 
      icon: '📅', 
      value: bookings.length, 
      label: 'Total Visits', 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: '💬', 
      value: inquiries.length, 
      label: 'Inquiries', 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: '⏳', 
      value: bookings.filter(b => b.status === 'pending').length, 
      label: 'Pending', 
      color: 'from-orange-500 to-yellow-500' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
          initial={{ x: Math.random() * window.innerWidth, y: -20 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [0.8, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 5,
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
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <motion.h1
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Welcome, {currentUser?.name || 'Guest'}!
            </motion.h1>
            <motion.p
              className="text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Manage your property journey
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
            >
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-4xl mb-4`}
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                {stat.icon}
              </motion.div>
              <motion.div
                className="text-5xl font-bold text-white mb-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <div className="text-purple-300 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-12 border border-purple-500/20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/properties">
              <motion.button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">🏘️</span>
                <span>Browse Properties</span>
              </motion.button>
            </Link>
            <motion.button
              className="w-full py-4 rounded-xl border-2 border-purple-500 text-purple-300 font-semibold flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">💬</span>
              <span>Message Agent</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex border-b border-purple-500/20">
            {['bookings', 'inquiries'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-5 font-semibold text-lg capitalize relative ${
                  activeTab === tab ? 'text-white' : 'text-purple-400'
                }`}
                whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="space-y-4"
                >
                  {bookings.length === 0 ? (
                    <motion.div
                      className="text-center py-12"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <div className="text-6xl mb-4">📭</div>
                      <p className="text-purple-300 text-lg mb-6">No bookings yet</p>
                      <Link to="/properties">
                        <motion.button
                          className="px-8 py-3 rounded-xl bg-purple-600 text-white font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Explore Properties
                        </motion.button>
                      </Link>
                    </motion.div>
                  ) : (
                    bookings.map((booking, index) => {
                      const property = getPropertyById(booking.propertyId);
                      return (
                        <motion.div
                          key={booking.id}
                          className="bg-purple-900/30 rounded-2xl p-6 border border-purple-500/20"
                          initial={{ opacity: 0, x: -100 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5, backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <Link to={`/property/${booking.propertyId}`}>
                                <h3 className="text-xl font-bold text-white hover:text-purple-300 mb-2">
                                  {booking.propertyTitle}
                                </h3>
                              </Link>
                              <div className="flex items-center gap-4 text-purple-300">
                                <span className="flex items-center gap-2">
                                  <span>📅</span>
                                  {booking.date}
                                </span>
                                <span className="flex items-center gap-2">
                                  <span>🕐</span>
                                  {booking.time}
                                </span>
                              </div>
                            </div>
                            <motion.span
                              className={`px-4 py-2 rounded-full font-medium text-sm ${
                                booking.status === 'pending'
                                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                  : 'bg-green-500/20 text-green-300 border border-green-500/30'
                              }`}
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {booking.status}
                            </motion.span>
                          </div>
                          {booking.message && (
                            <p className="text-purple-200 text-sm mt-3 pt-3 border-t border-purple-500/20">
                              💬 {booking.message}
                            </p>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              )}

              {activeTab === 'inquiries' && (
                <motion.div
                  key="inquiries"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-4"
                >
                  {inquiries.length === 0 ? (
                    <motion.div
                      className="text-center py-12"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <div className="text-6xl mb-4">💬</div>
                      <p className="text-purple-300 text-lg mb-6">No inquiries sent</p>
                      <Link to="/properties">
                        <motion.button
                          className="px-8 py-3 rounded-xl bg-purple-600 text-white font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Contact an Agent
                        </motion.button>
                      </Link>
                    </motion.div>
                  ) : (
                    inquiries.map((inquiry, index) => {
                      const property = getPropertyById(inquiry.propertyId);
                      return (
                        <motion.div
                          key={inquiry.id}
                          className="bg-purple-900/30 rounded-2xl p-6 border border-purple-500/20"
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: -5, backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                        >
                          <div className="mb-3">
                            <Link to={`/property/${inquiry.propertyId}`}>
                              <h3 className="text-xl font-bold text-white hover:text-purple-300 mb-1">
                                {property?.title || 'Unknown Property'}
                              </h3>
                            </Link>
                            <p className="text-purple-300 text-sm">
                              Subject: {inquiry.subject}
                            </p>
                          </div>
                          <p className="text-purple-200">{inquiry.message}</p>
                          <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between text-sm text-purple-400">
                            <span>To: {inquiry.agentName}</span>
                            <motion.span
                              className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Delivered
                            </motion.span>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
