// Tier A - Abundance Mode - HEAVY 3D ANIMATIONS & COMPLEX EFFECTS
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Battery, Wifi, Cpu, Activity, Database, Sparkles, Zap, Star } from 'lucide-react';
import { useFormStore } from '../store/formStore';

const TierA = ({ intent, metrics }) => {
  const { updateField, getFormData } = useFormStore();
  const formData = getFormData(intent.id);
  const [particles, setParticles] = useState([]);

  // Generate floating particles for visual complexity
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const handleInputChange = (fieldId, value) => {
    updateField(intent.id, fieldId, value);
  };

  // Render form intent with HEAVY CSS/animations
  const renderForm = () => (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Layers - Heavy CSS */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 animate-gradient-shift"></div>
      
      {/* 3D Rotating Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-3xl"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transformStyle: 'preserve-3d' }}
      />

      {/* Floating Particles - Heavy Rendering */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/30 backdrop-blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      {/* Main Form Container with 3D Transform */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className="relative z-10 max-w-2xl mx-auto pt-20"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        {/* Glassmorphic Card with Heavy Blur */}
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 80px rgba(139, 92, 246, 0.5)",
              "0 0 120px rgba(236, 72, 153, 0.5)",
              "0 0 80px rgba(139, 92, 246, 0.5)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="bg-white/5 backdrop-blur-2xl p-10 rounded-3xl border-2 border-white/20 shadow-2xl"
          style={{ transform: 'translateZ(50px)' }}
        >
          {/* Animated Header with 3D Icons */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring", duration: 1 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-yellow-400" />
            </motion.div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {intent.title}
            </h2>
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star className="w-10 h-10 text-pink-400" />
            </motion.div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-purple-200 mb-10 text-lg text-center font-medium"
          >
            {intent.description}
          </motion.p>

          {/* Form Fields with Staggered 3D Animations */}
          <div className="space-y-8">
            {intent.fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -100, rotateY: -90 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ 
                  delay: 0.2 * index,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.02,
                  translateZ: 10,
                  rotateY: 2
                }}
                className="space-y-3"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <label className="block text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                  >
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                  {field.label}
                  {field.required && <span className="text-yellow-300 ml-1 text-lg">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <motion.textarea
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)" }}
                    placeholder={field.placeholder}
                    rows={field.rows || 4}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-5 py-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-2 border-purple-400/50 rounded-2xl text-white placeholder-purple-300/60 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 transition-all duration-500 shadow-lg"
                    style={{ 
                      textShadow: "0 0 10px rgba(255,255,255,0.3)",
                      transform: "translateZ(20px)"
                    }}
                  />
                ) : field.type === 'select' ? (
                  <motion.select
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)" }}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-5 py-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-2 border-purple-400/50 rounded-2xl text-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 transition-all duration-500 shadow-lg"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <option value="" className="bg-gray-900">Select {field.label}</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                    ))}
                  </motion.select>
                ) : (
                  <motion.input
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)" }}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-5 py-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-2 border-purple-400/50 rounded-2xl text-white placeholder-purple-300/60 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 transition-all duration-500 shadow-lg"
                    style={{ 
                      textShadow: "0 0 10px rgba(255,255,255,0.3)",
                      transform: "translateZ(20px)"
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Action Buttons with 3D Effects */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-6 mt-10"
          >
            {intent.actions?.map((action, index) => (
              <motion.button
                key={action.id}
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 5,
                  rotateX: -5,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
                }}
                whileTap={{ scale: 0.95, rotateY: 0 }}
                animate={{
                  boxShadow: [
                    "0 10px 40px rgba(234, 179, 8, 0.3)",
                    "0 15px 50px rgba(234, 179, 8, 0.5)",
                    "0 10px 40px rgba(234, 179, 8, 0.3)"
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity },
                  hover: { type: "spring", stiffness: 400 }
                }}
                className={`flex-1 py-5 rounded-2xl font-black text-xl uppercase tracking-wider shadow-2xl ${
                  action.type === 'primary'
                    ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-gray-900 hover:from-yellow-300 hover:to-pink-300'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'
                }`}
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(30px)'
                }}
              >
                {action.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Loading Performance Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-yellow-400"
      >
        <p className="text-yellow-400 text-sm font-bold">
          ⚡ TIER A: Heavy 3D Rendering Active
        </p>
        <p className="text-yellow-300 text-xs">Bundle: ~500KB | Max Effects</p>
      </motion.div>
    </div>
  );

  // Render dashboard intent
  const renderDashboard = () => {
    const icons = { battery: Battery, wifi: Wifi, cpu: Cpu, activity: Activity, database: Database };
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent"
        >
          {intent.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {intent.widgets.map((widget, index) => {
            const Icon = icons[widget.icon] || Activity;
            const value = metrics[widget.valueKey];
            const secondaryValue = widget.secondaryKey ? metrics[widget.secondaryKey] : null;
            
            return (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-200">{widget.label}</h3>
                  <Icon className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                
                <div className="text-4xl font-bold text-white mb-2">
                  {value}
                  {widget.unit && <span className="text-2xl text-gray-400 ml-1">{widget.unit}</span>}
                </div>
                
                {secondaryValue && (
                  <div className="text-sm text-gray-400">
                    of {secondaryValue}{widget.unit}
                  </div>
                )}
                
                {widget.displayFormat === 'progress' && secondaryValue && (
                  <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / secondaryValue) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Render based on intent type
  switch (intent.type) {
    case 'form':
      return renderForm();
    case 'dashboard':
      return renderDashboard();
    default:
      return renderForm();
  }
};

export default TierA;
