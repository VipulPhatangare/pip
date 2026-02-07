// Tier C - Minimal Mode: Landing Page with Tailwind
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function HomeC() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto container-padding py-12 sm:py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Find Your
            <span className="block text-purple-600">Dream Home</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Discover premium properties across India. Simple, fast, and reliable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            {isAuthenticated ? (
              <>
                <Link to="/properties" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-lg btn-touch text-sm sm:text-base">
                    Browse Properties →
                  </button>
                </Link>
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-purple-500 hover:text-purple-600 transition-colors btn-touch text-sm sm:text-base">
                    My Dashboard
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-lg btn-touch text-sm sm:text-base">
                    Get Started Free →
                  </button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-purple-500 hover:text-purple-600 transition-colors btn-touch text-sm sm:text-base">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" 
            alt="Modern luxury home"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose PropertyHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Properties</h3>
              <p className="text-gray-600">
                Curated luxury homes across major Indian cities
              </p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Quick search and instant property recommendations
              </p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Trusted</h3>
              <p className="text-gray-600">
                Verified listings with complete transparency
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Properties</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">4.9★</div>
              <div className="text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          {isAuthenticated ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome Back, {user?.name}!
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Continue exploring amazing properties
              </p>
              <Link to="/properties">
                <button className="px-8 py-4 rounded-lg bg-white text-purple-600 font-bold hover:bg-gray-100 transition-colors shadow-xl">
                  Explore Properties
                </button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Join thousands of happy homeowners today
              </p>
              <Link to="/signup">
                <button className="px-8 py-4 rounded-lg bg-white text-purple-600 font-bold hover:bg-gray-100 transition-colors shadow-xl">
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
          <p>© 2026 PropertyHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
