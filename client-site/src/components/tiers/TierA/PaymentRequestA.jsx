// Tier A - Abundance Mode: Payment Request with Advanced Animations
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPropertyById } from '../../../data/properties';

export default function PaymentRequestA() {
  const { id } = useParams();
  const property = getPropertyById(id);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    offerAmount: '',
    paymentType: '',
    paymentMethod: '',
    name: '',
    email: '',
    phone: ''
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
    const request = {
      id: Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const requests = JSON.parse(localStorage.getItem('paymentRequests') || '[]');
    requests.push(request);
    localStorage.setItem('paymentRequests', JSON.stringify(requests));
    
    setShowSuccess(true);
    setTimeout(() => navigate('/dashboard'), 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const paymentTypes = [
    { value: 'token', label: 'Token Amount', icon: '🎫', desc: '10% of property value' },
    { value: 'booking', label: 'Booking Amount', icon: '📝', desc: '20% of property value' },
    { value: 'downpayment', label: 'Down Payment', icon: '💰', desc: '30% of property value' },
    { value: 'full', label: 'Full Payment', icon: '✅', desc: '100% of property value' }
  ];

  const paymentMethods = [
    { value: 'upi', label: 'UPI', icon: '📱', brands: 'PhonePe, GPay, Paytm' },
    { value: 'netbanking', label: 'Net Banking', icon: '🏦', brands: 'All Major Banks' },
    { value: 'card', label: 'Credit/Debit Card', icon: '💳', brands: 'Visa, Mastercard, Rupay' },
    { value: 'wallet', label: 'Digital Wallet', icon: '👛', brands: 'Paytm, PhonePe' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            backgroundColor: ['#c084fc', '#f472b6', '#60a5fa', '#fbbf24'][i % 4],
            borderRadius: '50%'
          }}
          initial={{ x: Math.random() * window.innerWidth, y: -20 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [0.8, 0],
            scale: [1, 1.5, 0]
          }}
          transition={{
            duration: Math.random() * 12 + 8,
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

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <motion.h1
          className="text-6xl font-bold text-white mb-3 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          Make an Offer
        </motion.h1>
        <motion.p
          className="text-purple-300 text-center mb-12 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Secure your dream property with flexible payment options
        </motion.p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Offer Amount */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/20"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">💵</span>
                <span>Your Offer</span>
              </h2>
              
              <div className="mb-4">
                <label className="block text-white font-semibold mb-3">Offer Amount</label>
                <div className="relative">
                  <motion.input
                    type="number"
                    required
                    min="0"
                    step="100000"
                    value={formData.offerAmount}
                    onChange={(e) => setFormData({ ...formData, offerAmount: e.target.value })}
                    placeholder="Enter your offer amount"
                    className="w-full px-6 py-5 text-2xl rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-colors"
                    whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-purple-300 text-xl font-bold">INR</span>
                </div>
                <p className="text-purple-300 text-sm mt-2">
                  Asking Price: {formatPrice(property.price)}
                </p>
              </div>
            </motion.div>

            {/* Payment Type */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/20"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <span>Payment Type</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {paymentTypes.map((type, index) => (
                  <motion.label
                    key={type.value}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                      formData.paymentType === type.value
                        ? 'bg-purple-600/30 border-purple-400'
                        : 'bg-purple-900/20 border-purple-500/30 hover:border-purple-400/50'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      value={type.value}
                      checked={formData.paymentType === type.value}
                      onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="text-5xl mb-3">{type.icon}</div>
                      <div className="font-bold text-white mb-2">{type.label}</div>
                      <div className="text-sm text-purple-300">{type.desc}</div>
                    </div>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/20"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">💳</span>
                <span>Payment Method</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method, index) => (
                  <motion.label
                    key={method.value}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                      formData.paymentMethod === method.value
                        ? 'bg-blue-600/30 border-blue-400'
                        : 'bg-purple-900/20 border-purple-500/30 hover:border-purple-400/50'
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="text-5xl mb-3">{method.icon}</div>
                      <div className="font-bold text-white mb-2">{method.label}</div>
                      <div className="text-xs text-purple-300">{method.brands}</div>
                    </div>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/20"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📞</span>
                <span>Contact Details</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-colors"
                  whileFocus={{ scale: 1.02 }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                />
                
                <motion.input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email Address"
                  className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-colors"
                  whileFocus={{ scale: 1.02 }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                />
                
                <motion.input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone Number"
                  className="w-full px-6 py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-colors"
                  whileFocus={{ scale: 1.02 }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                />

                <motion.button
                  type="submit"
                  className="w-full py-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-xl shadow-2xl mt-6"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 30px 60px rgba(168, 85, 247, 0.6)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-3">
                    <span>🚀</span>
                    <span>Submit Offer</span>
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Property Card */}
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-purple-500/20 sticky top-24"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
                  className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 pb-6 border-b border-purple-500/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {formatPrice(property.price)}
                </motion.div>

                {/* Guidelines */}
                <div className="space-y-3">
                  <h4 className="font-bold text-white mb-3">Payment Guidelines</h4>
                  {[
                    'All transactions are secure',
                    'Instant confirmation',
                    'Flexible payment plans',
                    'Full refund on cancellation'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 text-purple-200 text-sm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <span className="text-green-400">✓</span>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Security Badge */}
                <motion.div
                  className="mt-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/40 rounded-xl p-4 text-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(34, 197, 94, 0.2)',
                      '0 0 40px rgba(34, 197, 94, 0.4)',
                      '0 0 20px rgba(34, 197, 94, 0.2)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-3xl mb-2">🔒</div>
                  <div className="text-green-300 font-semibold text-sm">
                    256-bit SSL Encrypted
                  </div>
                  <div className="text-green-200 text-xs">
                    Your data is safe with us
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 rounded-3xl p-12 max-w-lg text-center shadow-2xl relative overflow-hidden"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            >
              {/* Confetti Effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#fbbf24', '#f472b6', '#60a5fa', '#c084fc'][i % 4],
                    left: `${Math.random() * 100}%`,
                    top: '50%'
                  }}
                  animate={{
                    y: [0, -200, 300],
                    x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                    opacity: [1, 1, 0],
                    scale: [1, 0.5, 0]
                  }}
                  transition={{ duration: 2, delay: i * 0.05 }}
                />
              ))}

              <motion.div
                className="text-9xl mb-6 relative z-10"
                animate={{ 
                  scale: [1, 1.4, 1],
                  rotate: [0, 360, 720]
                }}
                transition={{ duration: 1.2 }}
              >
                🎉
              </motion.div>
              
              <h2 className="text-5xl font-bold text-white mb-4 relative z-10">Offer Submitted!</h2>
              <p className="text-white/90 text-xl mb-3 relative z-10">
                Your offer of {formatPrice(formData.offerAmount)}
              </p>
              <p className="text-white text-lg mb-6 relative z-10">
                has been received successfully
              </p>
              
              <motion.div
                className="inline-block relative z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <p className="text-white/80 text-lg">Redirecting to dashboard...</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
