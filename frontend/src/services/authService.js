// src/services/authService.js
import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user_id', response.data.user_id);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.user_id) {
      localStorage.setItem('user_id', response.data.user_id);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors from FastAPI
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
      // Format FastAPI validation errors
      if (Array.isArray(errorData.detail)) {
        const formattedErrors = errorData.detail.map(err => {
          const field = err.loc[err.loc.length - 1];
          return `${field}: ${err.msg}`;
        }).join('\n');
        
        throw new Error(formattedErrors);
      } else if (typeof errorData.detail === 'string') {
        throw new Error(errorData.detail);
      } else if (errorData.detail) {
        throw new Error(JSON.stringify(errorData.detail));
      }
    }
    
    throw new Error("Registration failed. Please try again.");
  }
};

export const logout = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    console.log('Logout initiated with token:', refresh_token ? 'Token exists' : 'No token found');
    
    if (refresh_token) {
      console.log('Making logout request to API...');
      const response = await api.post('/auth/logout', { refresh_token });
      console.log('Logout API response:', response.data);
    } else {
      console.log('No refresh token found, skipping API call');
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    return true;
  } catch (error) {
    console.error('Logout error details:', error.response || error.message || error);
    return false;
  }
};