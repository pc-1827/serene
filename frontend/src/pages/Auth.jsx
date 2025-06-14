// src/pages/Auth.jsx
import React from 'react';
import Authentication from '../components/features/auth/Authentication';

const Auth = ({ onLogin, error }) => {
  return <Authentication onLogin={onLogin} error={error} />;
};

export default Auth;