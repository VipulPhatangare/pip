// Auth Context - NO AUTHENTICATION (Public Access Mode)
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const BRAIN_SERVER_URL = import.meta.env.VITE_BRAIN_SERVER_URL || 'http://localhost:3001';

export const AuthProvider = ({ children }) => {
  // Always logged in as demo user (no authentication required)
  const [user] = useState({
    id: 'public-user',
    name: 'Guest User',
    email: 'guest@alphabyte.com',
    phone: '+1-555-0000',
    role: 'user'
  });
  const [token] = useState('public-access-token');
  const [loading] = useState(false);

  // Axios instance (no auth header needed)
  const axiosInstance = axios.create({
    baseURL: BRAIN_SERVER_URL
  });

  // No-op functions (authentication disabled)
  const login = async (email, password) => {
    return { success: true };
  };

  const signup = async (name, email, phone, password) => {
    return { success: true };
  };

  const logout = () => {
    // Do nothing
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: true, // Always authenticated
    login,
    signup,
    logout,
    axiosInstance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
