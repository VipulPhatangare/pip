// Auth Context - JWT Authentication Management
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const BRAIN_SERVER_URL = import.meta.env.VITE_BRAIN_SERVER_URL || 'http://localhost:3001';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // Axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: BRAIN_SERVER_URL
  });

  // Add token to requests
  axiosInstance.interceptors.request.use((config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  });

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('authToken');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BRAIN_SERVER_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });

        if (response.data.success) {
          setUser(response.data.user);
          setToken(storedToken);
        } else {
          // Invalid token, clear it
          localStorage.removeItem('authToken');
          setToken(null);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('authToken');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BRAIN_SERVER_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        setToken(token);
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  // Signup function
  const signup = async (name, email, phone, password) => {
    try {
      const response = await axios.post(`${BRAIN_SERVER_URL}/api/auth/signup`, {
        name,
        email,
        phone,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        setToken(token);
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
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
