import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Resources from './pages/Resources';
import { login } from './services/authService';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      setError(null);
      const success = await login(email, password);
      if (success) {
        setIsAuthenticated(true);
      } else {
        setError("Invalid credentials. Please try again.");
      }
      return success;
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      throw err;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Auth onLogin={handleLogin} error={error} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Dashboard onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/chat" 
          element={
            isAuthenticated ? 
              <Chat onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/resources" 
          element={
            isAuthenticated ? 
              <Resources onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
