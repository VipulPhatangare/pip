// Tier A - Abundance Mode: Animated Landing Page
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';

export default function HomeA() {
  const { isAuthenticated, user } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>



      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto container-padding pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32"
      >
        <div className="text-center">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="mb-6 sm:mb-8"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent px-4"
            >
              Find Your
              <br />
              Dream Home
            </motion.h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-200 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4"
          >
            Discover premium properties across India with our AI-powered
            platform. Luxury living starts here.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <Link to="/properties">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-base sm:text-lg font-bold shadow-xl btn-touch"
              >
                Browse Properties →
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-white/30 backdrop-blur-sm text-base sm:text-lg font-semibold hover:bg-white/10 transition-colors btn-touch"
              >
                My Dashboard
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          className="mt-32 grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: "🏠",
              title: "Premium Properties",
              description: "Curated luxury homes across major cities"
            },
            {
              icon: "⚡",
              title: "Lightning Fast",
              description: "AI-powered search and recommendations"
            },
            {
              icon: "🔒",
              title: "Secure & Trusted",
              description: "Verified listings with complete transparency"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer"
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-purple-200">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "500+", label: "Properties" },
            { number: "50+", label: "Cities" },
            { number: "10K+", label: "Happy Clients" },
            { number: "4.9★", label: "Rating" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, type: "spring" }}
              >
                {stat.number}
              </motion.div>
              <div className="text-purple-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 text-center pb-16"
      >
        {isAuthenticated ? (
          <>
            <p className="text-purple-300 mb-4">Welcome back, {user?.name}!</p>
            <Link to="/properties">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-white text-purple-900 font-bold hover:shadow-xl transition-shadow"
              >
                Explore Properties
              </motion.button>
            </Link>
          </>
        ) : (
          <>
            <p className="text-purple-300 mb-4">Ready to find your dream home?</p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-white text-purple-900 font-bold hover:shadow-xl transition-shadow"
              >
                Start Your Journey
              </motion.button>
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
