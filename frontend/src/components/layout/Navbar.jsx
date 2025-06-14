import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors, typography } from '../../styles/theme';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/chat', label: 'Chat' },
    { path: '/resources', label: 'Resources' }
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav style={{ 
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            padding: '8px 16px',
            borderRadius: '12px',
            textDecoration: 'none',
            color: isActive(item.path) ? colors.primary : colors.textSecondary,
            backgroundColor: isActive(item.path) ? colors.lightAccent : 'transparent',
            fontWeight: isActive(item.path) ? '600' : '500',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            border: isActive(item.path) ? `1px solid ${colors.primary}30` : 'none'
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;