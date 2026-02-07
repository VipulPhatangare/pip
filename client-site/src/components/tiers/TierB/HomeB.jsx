// Tier B - Constraint Mode: Landing with CSS Animations
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function HomeB() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto container-padding py-12 sm:py-16 md:py-24">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 animate-slide-in-down px-4">
            Find Your
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Dream Home
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in delay-200 px-4">
            Discover premium properties across India with advanced search and virtual tours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in delay-400 px-4">
            {isAuthenticated ? (
              <>  
                <Link to="/properties" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 btn-touch text-sm sm:text-base">
                    Browse Properties →
                  </button>
                </Link>
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-purple-300 text-gray-700 font-semibold hover:border-purple-500 hover:bg-purple-50 hover:scale-105 transition-all duration-300 btn-touch text-sm sm:text-base">
                    My Dashboard
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 btn-touch text-sm sm:text-base">
                    Get Started Free →
                  </button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-purple-300 text-gray-700 font-semibold hover:border-purple-500 hover:bg-purple-50 hover:scale-105 transition-all duration-300 btn-touch text-sm sm:text-base">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Image with Hover Effect */}
        <div className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-fade-in delay-600 mx-4">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" 
            alt="Modern luxury home"
            className="w-full h-64 sm:h-80 md:h-96 object-cover hover:scale-110 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/60 backdrop-blur-sm py-12 sm:py-16">
        <div className="max-w-7xl mx-auto container-padding">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 animate-fade-in">
            Why Choose PropertyHub?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: "🏠", title: "Premium Properties", desc: "Curated luxury homes across major cities", delay: "delay-100" },
              { icon: "⚡", title: "Lightning Fast", desc: "AI-powered search and recommendations", delay: "delay-200" },
              { icon: "🔒", title: "Secure & Trusted", desc: "Verified listings with transparency", delay: "delay-300" }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`text-center p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 border border-purple-100 animate-fade-in-up ${feature.delay}`}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce-slow">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section with Counter Animation */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            {[
              { number: "500+", label: "Properties" },
              { number: "50+", label: "Cities" },
              { number: "10K+", label: "Happy Clients" },
              { number: "4.9★", label: "Rating" }
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2 hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with Gradient Animation */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 animate-gradient-x text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          {isAuthenticated ? (
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                Welcome Back, {user?.name}!
              </h2>
              <p className="text-xl text-purple-100 mb-8 animate-fade-in delay-200">
                Continue exploring amazing properties
              </p>
              <Link to="/properties">
                <button className="px-8 py-4 rounded-xl bg-white text-purple-600 font-bold hover:bg-gray-100 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in delay-400">
                  Explore Properties
                </button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-xl text-purple-100 mb-8 animate-fade-in delay-200">
                Join thousands of happy homeowners today
              </p>
              <Link to="/signup">
                <button className="px-8 py-4 rounded-xl bg-white text-purple-600 font-bold hover:bg-gray-100 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in delay-400">
                  Start Your Journey
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="animate-fade-in">© 2026 PropertyHub. All rights reserved.</p>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientX {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slide-in-down { animation: slideInDown 0.8s ease-out; }
        .animate-bounce-slow { animation: bounceSlow 3s ease-in-out infinite; }
        .animate-gradient { animation: gradientX 3s ease infinite; background-size: 200% 200%; }
        .animate-gradient-x { animation: gradientX 5s ease infinite; }
        .bg-size-200 { background-size: 200% 200%; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-600 { animation-delay: 600ms; }
      `}</style>
    </div>
  );
}
