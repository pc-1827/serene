// src/components/common/Button.jsx
import React from 'react';
import { colors, typography } from '../../styles/theme';

const Button = ({ children, onClick, style, type = "button", variant = "primary", size = "medium" }) => {
  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...typography.body
    };

    const sizeStyles = {
      small: { padding: '8px 16px', fontSize: '14px' },
      medium: { padding: '12px 24px', fontSize: '16px' },
      large: { padding: '16px 32px', fontSize: '18px' }
    };

    const variantStyles = {
      primary: {
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.headerGradient1})`,
        color: 'white',
        boxShadow: '0 4px 15px rgba(27, 179, 186, 0.3)'
      },
      secondary: {
        backgroundColor: colors.lightAccent,
        color: colors.primary,
        border: `2px solid ${colors.primary}30`
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.primary,
        border: `2px solid ${colors.primary}30`
      }
    };

    return { ...baseStyles, ...sizeStyles[size], ...variantStyles[variant], ...style };
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={getButtonStyles()}
      onMouseOver={(e) => {
        if (variant === 'primary') {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(27, 179, 186, 0.4)';
        }
      }}
      onMouseOut={(e) => {
        if (variant === 'primary') {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(27, 179, 186, 0.3)';
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;