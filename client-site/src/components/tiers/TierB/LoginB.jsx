// Tier B - Constraint Mode: Login with CSS Animations
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function LoginB() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const from = location.state?.from?.pathname || '/properties';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center px-4 py-6 sm:py-8 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Login Card */}
      <div className="max-w-md w-full relative z-10 animate-slide-in-up">
        {/* Back Home Button */}
        <Link to="/" className="inline-block mb-4 text-gray-700 hover:text-purple-600 transition-colors animate-fade-in text-sm sm:text-base">
          ← Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-purple-100 transform hover:scale-105 transition-transform duration-300">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-gradient">
              PropertyHub
            </div>
            <p className="text-gray-600 animate-fade-in delay-200 text-sm sm:text-base">Sign in to your account</p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 animate-fade-in delay-400">
            <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Demo Login</p>
            <p className="text-xs text-blue-700">📧 demo@test.com</p>
            <p className="text-xs text-blue-700">🔑 demo123</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg animate-shake">
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="animate-fade-in delay-600">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 transform focus:scale-105 text-sm sm:text-base btn-touch"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="animate-fade-in delay-700">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 transform focus:scale-105 text-sm sm:text-base btn-touch"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 animate-fade-in delay-800">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-transform group-hover:scale-110"
                />
                <span className="ml-2 text-xs sm:text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                  Remember me
                </span>
              </label>
              <button type="button" className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 hover:underline transition-all text-left sm:text-right">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in delay-900 btn-touch text-sm sm:text-base"
            >
              Sign In →
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 sm:my-6 animate-fade-in delay-1000">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-fade-in delay-1100">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:scale-105 transition-all duration-300 btn-touch">
              <span className="text-lg sm:text-xl">🔵</span>
              <span className="text-xs sm:text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:scale-105 transition-all duration-300 btn-touch">
              <span className="text-lg sm:text-xl">📘</span>
              <span className="text-xs sm:text-sm font-medium">Facebook</span>
            </button>
          </div>

          {/* Signup Link */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 animate-fade-in delay-1200">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition-all">
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-slide-in-up { animation: slideInUp 0.6s ease-out; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-gradient { animation: gradientX 3s ease infinite; background-size: 200% 200%; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .delay-200 { animation-delay: 200ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1100 { animation-delay: 1100ms; }
        .delay-1200 { animation-delay: 1200ms; }
        @keyframes gradientX {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
