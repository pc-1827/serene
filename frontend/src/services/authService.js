// src/services/authService.js
import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
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
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token) {
      await api.post('/auth/logout', { refresh_token });
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};