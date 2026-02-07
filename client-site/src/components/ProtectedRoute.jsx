// Protected Route Component - NO AUTHENTICATION (Public Access)
import React from 'react';

export default function ProtectedRoute({ children }) {
  // No authentication check - allow all access
  return children;
}
