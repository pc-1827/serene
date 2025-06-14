// src/components/layout/Header.jsx
import React from 'react';
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
      marginBottom: '24px',
      padding: '20px 24px',
      backgroundColor: colors.cardBackground,
      borderRadius: '16px',
      boxShadow: '0 6px 20px rgba(27, 179, 186, 0.1)',
      border: `1px solid ${colors.lightAccent}`,
      background: `linear-gradient(135deg, ${colors.cardBackground}, ${colors.background})`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '10px', 
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.headerGradient1})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          S
        </div>
        <h1 style={{ 
          ...typography.heading, 
          color: colors.textPrimary, 
          margin: 0,
          fontSize: '24px'
        }}>
          Serene
        </h1>
      </div>
      
      <Navbar />
      
      <div>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: colors.textPrimary,
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'background-color 0.2s',
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;