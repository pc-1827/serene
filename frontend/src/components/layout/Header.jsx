// src/components/layout/Header.jsx
import React from 'react';
import Button from '../common/Button';
import { colors, typography } from '../../styles/theme';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      // Call the logout API endpoint
      const success = await logout();
      console.log('Logout success:', success);
      
      // Clear all chat-related data
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('chatSessionInitialized');
      
      // Call the onLogout prop to update App state
      onLogout();
      
      // Navigate to login page
      navigate('/');
    } catch (err) {
      console.error('Unexpected error during logout:', err);
      // Still call onLogout and navigate on error
      onLogout();
      navigate('/');
    }
  };
  
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      padding: '20px 24px',
      backgroundColor: colors.cardBackground,
      borderRadius: '16px',
      boxShadow: '0 6px 20px rgba(27, 179, 186, 0.1)',
      border: `1px solid ${colors.lightAccent}`,
      background: `linear-gradient(135deg, ${colors.cardBackground}, ${colors.background})`,
    }}>
      <div style={{
        ...typography.heading,
        color: colors.textPrimary,
        fontSize: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ color: colors.primary }}>Serene</span>
        <span style={{ fontSize: '14px', color: colors.textSecondary }}>Mental Wellness Assistant</span>
      </div>
      
      <Navbar />
      
      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    </header>
  );
};

export default Header;