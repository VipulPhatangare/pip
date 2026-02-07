// Shared Navbar Component - Works across all tiers
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTier } from '../context/TierContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentTier } = useTier();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Base navigation links
  const navLinks = [
    { path: '/', label: 'Home', public: true },
    { path: '/properties', label: 'Properties', protected: true },
    { path: '/dashboard', label: 'Dashboard', protected: true },
  ];

  // Tier-specific styling
  const getTierStyles = () => {
    switch (currentTier) {
      case 'A':
        return {
          nav: 'bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 backdrop-blur-lg border-b border-purple-500/20',
          container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          brand: 'text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent',
          link: 'text-purple-200 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10',
          activeLink: 'text-white bg-white/20',
          button: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/50',
          userInfo: 'text-purple-200'
        };
      case 'B':
        return {
          nav: 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg',
          container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          brand: 'text-2xl font-bold text-white',
          link: 'text-blue-100 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-white/10',
          activeLink: 'text-white bg-white/20',
          button: 'bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors',
          userInfo: 'text-blue-100'
        };
      case 'C':
        return {
          nav: 'bg-purple-600 shadow-md',
          container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          brand: 'text-xl font-semibold text-white',
          link: 'text-purple-100 hover:text-white px-3 py-2 rounded hover:bg-purple-700',
          activeLink: 'text-white bg-purple-700',
          button: 'bg-white text-purple-600 px-4 py-2 rounded font-medium hover:bg-gray-100',
          userInfo: 'text-purple-100'
        };
      case 'D':
        return {
          nav: { borderBottom: '2px solid #000', background: '#fff', padding: '10px 0' },
          container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
          brand: { fontWeight: 'bold', fontSize: '18px', color: '#000' },
          link: { color: '#000', textDecoration: 'none', padding: '5px 10px', display: 'inline-block' },
          activeLink: { background: '#000', color: '#fff', padding: '5px 10px' },
          button: { background: '#000', color: '#fff', border: 'none', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' },
          userInfo: { color: '#666', fontSize: '12px' }
        };
      default:
        return getTierStyles.call(this, 'A');
    }
  };

  const styles = getTierStyles();

  // Render based on tier
  if (currentTier === 'D') {
    // Text-only version for Tier D with mobile-first design
    return (
      <div style={styles.nav}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={styles.brand}>
              <Link to="/" style={{ color: '#000', textDecoration: 'none' }}>AlphaByte Realty</Link>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ 
                display: 'block',
                background: 'none',
                border: '1px solid #000',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              className="md:hidden"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
            
            {/* Desktop Navigation */}
            <nav style={{ display: 'none', gap: '5px', alignItems: 'center' }} className="md:flex">
              {navLinks.map(link => {
                if (link.protected && !isAuthenticated) return null;
                if (link.public || isAuthenticated) {
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={isActive(link.path) ? styles.activeLink : styles.link}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return null;
              })}
              
              {isAuthenticated ? (
                <>
                  <span style={styles.userInfo}> | {user?.name}</span>
                  <button onClick={handleLogout} style={styles.button}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.link}>Login</Link>
                  <Link to="/signup" style={styles.link}>Signup</Link>
                </>
              )}
            </nav>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '1px solid #ddd'
            }} className="md:hidden">
              {navLinks.map(link => {
                if (link.protected && !isAuthenticated) return null;
                if (link.public || isAuthenticated) {
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        ...styles.link,
                        ...(isActive(link.path) ? styles.activeLink : {}),
                        display: 'block',
                        padding: '10px 15px'
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return null;
              })}
              
              {isAuthenticated ? (
                <>
                  <span style={{ ...styles.userInfo, padding: '10px 15px' }}>Welcome, {user?.name}</span>
                  <button 
                    onClick={handleLogout} 
                    style={{ ...styles.button, width: '100%', padding: '10px 15px' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ ...styles.link, padding: '10px 15px' }}>Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} style={{ ...styles.link, padding: '10px 15px' }}>Signup</Link>
                </>
              )}
            </nav>
          )}
        </div>
      </div>
    );
  }

  // Modern versions for Tiers A, B, C
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand */}
          <div className={`${styles.brand} text-lg sm:text-xl md:text-2xl`}>
            <Link to="/">AlphaByte Realty</Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {navLinks.map(link => {
              if (link.protected && !isAuthenticated) return null;
              if (link.public || isAuthenticated) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${styles.link} ${isActive(link.path) ? styles.activeLink : ''}`}
                  >
                    {link.label}
                  </Link>
                );
              }
              return null;
            })}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 xl:space-x-4">
                <span className={`${styles.userInfo} hidden xl:inline text-sm`}>Welcome, {user?.name}</span>
                <button onClick={handleLogout} className={`${styles.button} btn-touch text-sm sm:text-base`}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className={`${styles.link} text-sm sm:text-base`}>
                  Login
                </Link>
                <Link to="/signup" className={`${styles.button} btn-touch text-sm sm:text-base`}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 btn-touch focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/10 mt-2 pt-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map(link => {
                if (link.protected && !isAuthenticated) return null;
                if (link.public || isAuthenticated) {
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${styles.link} ${isActive(link.path) ? styles.activeLink : ''} btn-touch block`}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return null;
              })}

              {isAuthenticated ? (
                <>
                  <span className={`${styles.userInfo} py-2 px-3 text-sm`}>Welcome, {user?.name}</span>
                  <button onClick={handleLogout} className={`${styles.button} w-full btn-touch`}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={`${styles.link} btn-touch block`}>
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className={`${styles.button} text-center btn-touch block`}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
