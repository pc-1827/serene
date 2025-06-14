// src/components/features/auth/Authentication.jsx
import React, { useState } from 'react';
import Button from '../../common/Button';
import { colors, typography } from '../../../styles/theme';
import { register, login } from '../../../services/authService';

const Authentication = ({ onLogin, error }) => {
  // Basic auth state
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(error || null);
  
  // User registration fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    doctor_email: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    age: '',
    language_preference: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    postpartum_start_date: '',
    doctor_name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert age to number if it's not empty
    if (name === 'age' && value !== '') {
      processedValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    
    try {
      // Create a copy of the form data for submission
      const submissionData = {...formData};
      
      // Ensure dates are in the correct format (or null if empty)
      if (isSignUp) {
        // Convert empty string dates to null
        if (submissionData.date_of_birth === '') submissionData.date_of_birth = null;
        if (submissionData.postpartum_start_date === '') submissionData.postpartum_start_date = null;
        
        // Convert empty age to null
        if (submissionData.age === '') submissionData.age = null;
        
        // Attempt registration with cleaned data
        await register(submissionData);
        
        // If successful, attempt login
        const loginSuccess = await onLogin(formData.email, formData.password);
        if (!loginSuccess) {
          setFormError("Registration successful, but login failed. Please try logging in.");
        }
      } else {
        // Login only
        await onLogin(formData.email, formData.password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setFormError(error.message || "Authentication failed. Please try again.");
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
        maxWidth: isSignUp ? '600px' : '450px',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1,
        maxHeight: '90vh',
        overflowY: 'auto'
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
        
        {formError && (
          <div style={{
            backgroundColor: '#fff0f0',
            border: '1px solid #ffcccc',
            color: '#e60000',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            whiteSpace: 'pre-line'
          }}>
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isSignUp ? '1fr 1fr' : '1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Email field - always shown */}
            <div style={{ gridColumn: isSignUp ? 'span 2' : 'span 1' }}>
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
                Email*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
            
            {/* Password field - always shown */}
            <div style={{ gridColumn: isSignUp ? 'span 2' : 'span 1' }}>
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
                Password*
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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
            
            {/* Sign up only fields */}
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="first_name" style={{
                    ...typography.body,
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
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
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label htmlFor="last_name" style={{
                    ...typography.body,
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
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
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div>
                  <label htmlFor="date_of_birth" style={{
                    ...typography.body,
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Date of Birth
                  </label>
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
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
                  />
                </div>
                
                <div>
                  <label htmlFor="age" style={{
                    ...typography.body,
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
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
                    placeholder="Enter your age"
                  />
                </div>
                
                <div>
                  <label htmlFor="language_preference" style={{
                    ...typography.body,
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Language Preference
                  </label>
                  <select
                    id="language_preference"
                    name="language_preference"
                    value={formData.language_preference}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${colors.lightAccent}`,
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="timezone" style={{
                    ...typography.body,
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Timezone
                  </label>
                  <input
                    id="timezone"
                    name="timezone"
                    type="text"
                    value={formData.timezone}
                    onChange={handleChange}
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
                    placeholder="Your timezone"
                  />
                </div>
                
                <div>
                  <label htmlFor="postpartum_start_date" style={{
                    ...typography.body,
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Postpartum Start Date (Optional)
                  </label>
                  <input
                    id="postpartum_start_date"
                    name="postpartum_start_date"
                    type="date"
                    value={formData.postpartum_start_date}
                    onChange={handleChange}
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
                  />
                </div>
                
                <div>
                  <label htmlFor="doctor_name" style={{
                    ...typography.body,
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Doctor Name
                  </label>
                  <input
                    id="doctor_name"
                    name="doctor_name"
                    type="text"
                    value={formData.doctor_name}
                    onChange={handleChange}
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
                    placeholder="Doctor's name"
                  />
                </div>
                
                <div style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="doctor_email" style={{
                    ...typography.body,
                    display: 'block',
                    marginBottom: '8px',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Doctor Email*
                  </label>
                  <input
                    id="doctor_email"
                    name="doctor_email"
                    type="email"
                    value={formData.doctor_email}
                    onChange={handleChange}
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
                    placeholder="Doctor's email"
                    required={isSignUp}
                  />
                </div>
              </>
            )}
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