// src/components/features/auth/Authentication.jsx
import React, { useState } from 'react';
import Button from '../../common/Button';
import { colors, typography } from '../../../styles/theme';

const Authentication = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.headerGradient1} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: '-250px',
        right: '-250px',
        animation: 'spin 20s linear infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        bottom: '-150px',
        left: '-150px',
        animation: 'float 6s ease-in-out infinite'
      }} />
      
      {/* Auth form card */}
      <div style={{
        backgroundColor: colors.cardBackground,
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1,
      }}>
        <h1 style={{
          ...typography.heading,
          color: colors.textPrimary,
          margin: '0 0 24px 0',
          fontSize: '28px',
          textAlign: 'center'
        }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        
        <p style={{
          ...typography.light,
          color: colors.textSecondary,
          textAlign: 'center',
          margin: '0 0 32px 0',
          fontSize: '16px'
        }}>
          {isSignUp 
            ? 'Sign up to start your wellness journey' 
            : 'Log in to continue your wellness journey'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="email" 
              style={{
                ...typography.body,
                display: 'block',
                marginBottom: '8px',
                color: colors.textPrimary,
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: `1px solid ${colors.lightAccent}`,
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label 
              htmlFor="password" 
              style={{
                ...typography.body,
                display: 'block',
                marginBottom: '8px',
                color: colors.textPrimary,
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: `1px solid ${colors.lightAccent}`,
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            style={{ width: '100%', marginBottom: '20px' }}
            variant="primary"
            size="large"
          >
            {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Log In')}
          </Button>
          
          <p style={{
            ...typography.light,
            textAlign: 'center',
            fontSize: '14px',
            color: colors.textSecondary,
            margin: '8px 0'
          }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <span 
              onClick={() => setIsSignUp(!isSignUp)}
              style={{
                color: colors.primary,
                fontWeight: '600',
                marginLeft: '4px',
                cursor: 'pointer'
              }}
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </span>
          </p>
        </form>
      </div>
      
      {/* CSS animations */}
      <style jsx="true">{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Authentication;