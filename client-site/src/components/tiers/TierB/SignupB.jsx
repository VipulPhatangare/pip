// Tier B - Constraint Mode: Signup with Sequential CSS Animations
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function SignupB() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup(formData.name, formData.email, formData.phone, formData.password);

    if (result.success) {
      navigate('/properties', { replace: true });
    } else {
      setError(result.error || 'Signup failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-delayed"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-slow"></div>

      {/* Signup Card */}
      <div className="max-w-lg w-full relative z-10 animate-zoom-in">
        {/* Back Home Button */}
        <Link to="/" className="inline-block mb-4 text-gray-700 hover:text-purple-600 transition-colors animate-fade-in">
          ← Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-100 hover:shadow-purple-200 transition-all duration-500">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-gradient-text">
              PropertyHub
            </div>
            <p className="text-gray-600 animate-fade-in delay-200">Create your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg animate-shake-horizontal">
              <p className="text-sm text-red-700">⚠️ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="animate-slide-in-right delay-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 focus:scale-105"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div className="animate-slide-in-left delay-400">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 focus:scale-105"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="animate-slide-in-right delay-500">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 focus:scale-105"
                placeholder="+91 98765 43210"
                required
              />
            </div>

            {/* Password */}
            <div className="animate-slide-in-left delay-600">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 focus:scale-105"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="animate-slide-in-right delay-700">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 focus:scale-105"
                placeholder="Re-enter password"
                required
              />
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-between text-xs text-gray-600 py-2 animate-fade-in delay-800">
              <span className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                🔒 Secure & Encrypted
              </span>
              <span className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                🔗 No Spam
              </span>
              <span className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                ✨ Instant Setup
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 animate-pulse-slow delay-900"
            >
              Create Account →
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 animate-fade-in delay-1000">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in delay-1100">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:scale-105 hover:rotate-1 transition-all duration-300">
              <span className="text-xl">🔵</span>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:scale-105 hover:-rotate-1 transition-all duration-300">
              <span className="text-xl">📘</span>
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6 animate-fade-in delay-1200">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition-all">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 30px) rotate(-5deg); }
          66% { transform: translate(20px, -20px) rotate(5deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.1); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shakeHorizontal {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes gradientText {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: floatSlow 10s ease-in-out infinite; }
        .animate-zoom-in { animation: zoomIn 0.5s ease-out; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-right { animation: slideInRight 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-left { animation: slideInLeft 0.6s ease-out forwards; opacity: 0; }
        .animate-shake-horizontal { animation: shakeHorizontal 0.4s ease-in-out; }
        .animate-pulse-slow { animation: pulseSlow 2s ease-in-out infinite; }
        .animate-gradient-text { 
          animation: gradientText 3s ease infinite; 
          background-size: 200% 200%; 
        }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1100 { animation-delay: 1100ms; }
        .delay-1200 { animation-delay: 1200ms; }
      `}</style>
    </div>
  );
}
