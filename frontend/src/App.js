import React, { useState, useEffect } from 'react';

// Enhanced color palette based on mental health app research
const colors = {
  primary: '#1bb3ba',        // Calming teal from research
  secondary: '#80eceb',      // Light turquoise
  accent: '#f48c3c',         // Warm orange accent
  background: '#f8fffe',     // Very light mint
  cardBackground: '#ffffff', // Pure white
  headerGradient1: '#689794', // Muted teal
  headerGradient2: '#365757', // Dark teal
  textPrimary: '#365757',    // Dark teal for text
  textSecondary: '#689794',  // Medium teal
  success: '#80eceb',        // Light turquoise
  warning: '#f48c3c',        // Orange
  lightAccent: '#d1e6e6',    // Very light teal
  mint: '#e8f5f4'            // Light mint
};

const typography = {
  heading: { fontFamily: 'Poppins, sans-serif', fontWeight: '600' },
  body: { fontFamily: 'Inter, sans-serif', fontWeight: '400' },
  light: { fontFamily: 'Inter, sans-serif', fontWeight: '300' }
};

// Enhanced Button Component
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

// Enhanced Authentication Component with better colors
const Authentication = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 1500);
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
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(30px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      {/* Main content container */}
      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1,
        minHeight: '600px'
      }}>
        
        {/* Left side - Welcome section */}
        <div style={{
          flex: 1,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.headerGradient1})`,
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px'
          }}>
            🌸
          </div>

          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            💙
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h1 style={{
              ...typography.heading,
              fontSize: '48px',
              marginBottom: '20px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Welcome to Serene
            </h1>
            <p style={{
              ...typography.light,
              fontSize: '20px',
              lineHeight: '1.6',
              opacity: 0.9,
              maxWidth: '400px'
            }}>
              Your compassionate companion for mental wellness and emotional support
            </p>
          </div>

          {/* Feature highlights */}
          <div style={{ marginTop: '40px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  🔒
                </div>
                <span style={{ fontSize: '16px', opacity: 0.9 }}>100% Private & Secure</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  🧠
                </div>
                <span style={{ fontSize: '16px', opacity: 0.9 }}>AI-Powered Support</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  ⏰
                </div>
                <span style={{ fontSize: '16px', opacity: 0.9 }}>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div style={{
          flex: 1,
          padding: '60px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'white'
        }}>
          {/* Logo and header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.headerGradient1})`,
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              boxShadow: '0 8px 25px rgba(27, 179, 186, 0.3)'
            }}>
              🌸
            </div>
            
            <h2 style={{
              ...typography.heading,
              color: colors.textPrimary,
              fontSize: '28px',
              marginBottom: '8px'
            }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            
            <p style={{
              ...typography.body,
              color: colors.textSecondary,
              fontSize: '16px'
            }}>
              {isSignUp ? 'Join thousands finding peace of mind' : 'Continue your wellness journey'}
            </p>
          </div>

          {/* Social login options */}
          <div style={{ marginBottom: '30px' }}>
            <Button
              variant="ghost"
              style={{
                width: '100%',
                marginBottom: '12px',
                justifyContent: 'center',
                gap: '12px',
                border: `2px solid ${colors.primary}20`,
                backgroundColor: colors.background
              }}
            >
              <span style={{ fontSize: '18px' }}>🌐</span>
              Continue with Google
            </Button>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '20px 0',
              color: colors.textSecondary,
              fontSize: '14px'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: colors.primary + '20' }}></div>
              <span style={{ padding: '0 20px' }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: colors.primary + '20' }}></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: colors.textPrimary,
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${colors.primary}20`,
                  outline: 'none',
                  ...typography.body,
                  fontSize: '16px',
                  backgroundColor: colors.background,
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.backgroundColor = colors.cardBackground;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary}15`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = `${colors.primary}20`;
                  e.target.style.backgroundColor = colors.background;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: colors.textPrimary,
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${colors.primary}20`,
                  outline: 'none',
                  ...typography.body,
                  fontSize: '16px',
                  backgroundColor: colors.background,
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.backgroundColor = colors.cardBackground;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary}15`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = `${colors.primary}20`;
                  e.target.style.backgroundColor = colors.background;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <Button
              type="submit"
              style={{ width: '100%', marginBottom: '20px' }}
              size="large"
              disabled={isLoading}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isSignUp ? 'Create Free Account' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Toggle section */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: colors.textSecondary, marginBottom: '16px', fontSize: '14px' }}>
              {isSignUp ? 'Already have an account?' : 'New to Serene?'}
            </p>
            <Button
              onClick={() => setIsSignUp(!isSignUp)}
              variant="ghost"
              size="medium"
            >
              {isSignUp ? 'Sign In Instead' : 'Create Free Account'}
            </Button>
          </div>

          {/* Trust indicators */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: colors.background,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '16px' }}>🔒</span>
              <span style={{ fontSize: '16px' }}>🏥</span>
              <span style={{ fontSize: '16px' }}>💙</span>
            </div>
            <p style={{
              ...typography.light,
              color: colors.textSecondary,
              fontSize: '12px',
              lineHeight: '1.4'
            }}>
              Your privacy is protected. HIPAA compliant. Trusted by mental health professionals.
            </p>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
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

// Enhanced Chat Interface with better spacing and colors
const ChatInterface = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() !== '') {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div style={{
      backgroundColor: colors.cardBackground,
      borderRadius: '20px',
      padding: '20px',
      height: '450px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 25px rgba(27, 179, 186, 0.1)',
      border: `1px solid ${colors.lightAccent}`
    }}>
      <h3 style={{ 
        ...typography.heading, 
        color: colors.textPrimary, 
        marginBottom: '16px',
        borderBottom: `2px solid ${colors.lightAccent}`,
        paddingBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '18px'
      }}>
        <span style={{ fontSize: '18px' }}>💬</span>
        Chat with Serene AI
      </h3>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: colors.background,
        borderRadius: '12px'
      }}>
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: colors.textSecondary, 
            marginTop: '40px',
            ...typography.body
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌸</div>
            <p style={{ fontSize: '14px' }}>Hi! I'm here to support you. How are you feeling today?</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
              marginBottom: '12px'
            }}
          >
            <div style={{
              backgroundColor: msg.isUser ? colors.primary : colors.cardBackground,
              color: msg.isUser ? 'white' : colors.textPrimary,
              padding: '10px 14px',
              borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              maxWidth: '70%',
              wordWrap: 'break-word',
              ...typography.body,
              fontSize: '14px',
              boxShadow: msg.isUser ? '0 3px 10px rgba(27, 179, 186, 0.3)' : '0 2px 6px rgba(0,0,0,0.1)',
              border: msg.isUser ? 'none' : `1px solid ${colors.lightAccent}`
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Share what's on your mind..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '16px',
            border: `2px solid ${colors.lightAccent}`,
            outline: 'none',
            ...typography.body,
            fontSize: '14px',
            backgroundColor: colors.background,
            transition: 'all 0.3s ease'
          }}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          onFocus={e => {
            e.target.style.borderColor = colors.primary;
            e.target.style.backgroundColor = colors.cardBackground;
          }}
          onBlur={e => {
            e.target.style.borderColor = colors.lightAccent;
            e.target.style.backgroundColor = colors.background;
          }}
        />
        <Button onClick={handleSend} style={{ borderRadius: '16px', minWidth: '70px' }} size="small">
          Send
        </Button>
      </div>
    </div>
  );
};

// Enhanced Mood Tracker with better proportions
const MoodTracker = ({ moodData, onAddMood }) => {
  const [currentMood, setCurrentMood] = useState(5);

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Great'];
  const moodColors = [colors.accent, '#ffa07a', '#ffd93d', colors.secondary, colors.primary];

  const handleMoodSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    onAddMood({ date: today, score: currentMood });
  };

  return (
    <div style={{ 
      backgroundColor: colors.cardBackground, 
      borderRadius: '20px', 
      padding: '20px', 
      boxShadow: '0 8px 25px rgba(27, 179, 186, 0.1)',
      marginBottom: '20px',
      border: `1px solid ${colors.lightAccent}`
    }}>
      <h3 style={{ 
        ...typography.heading, 
        color: colors.textPrimary, 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '18px'
      }}>
        <span style={{ fontSize: '18px' }}>📊</span>
        Daily Mood Tracker
      </h3>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ ...typography.body, marginBottom: '12px', color: colors.textSecondary, fontSize: '14px' }}>
          How are you feeling today?
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px', 
          marginBottom: '12px',
          padding: '12px',
          backgroundColor: colors.background,
          borderRadius: '12px'
        }}>
          {moodEmojis.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentMood(idx * 2 + 2)}
              style={{
                fontSize: '22px',
                padding: '8px',
                border: currentMood === idx * 2 + 2 ? `2px solid ${colors.primary}` : '2px solid transparent',
                borderRadius: '50%',
                backgroundColor: currentMood === idx * 2 + 2 ? colors.cardBackground : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: currentMood === idx * 2 + 2 ? '0 3px 10px rgba(27, 179, 186, 0.3)' : 'none'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        <p style={{ 
          ...typography.body, 
          color: colors.textPrimary, 
          fontWeight: '500',
          marginBottom: '12px',
          fontSize: '14px'
        }}>
          {moodLabels[Math.floor((currentMood - 2) / 2)]}
        </p>
        <Button onClick={handleMoodSubmit} size="small" variant="secondary">
          Log Today's Mood
        </Button>
      </div>

      <div style={{ borderTop: `1px solid ${colors.lightAccent}`, paddingTop: '16px' }}>
        <h4 style={{ 
          ...typography.body, 
          color: colors.textPrimary, 
          marginBottom: '12px',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          Recent Mood History
        </h4>
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '8px', 
          paddingBottom: '8px' 
        }}>
          {moodData.slice(-7).map(({ date, score }) => (
            <div key={date} style={{ 
              minWidth: '60px', 
              textAlign: 'center',
              padding: '8px 6px',
              backgroundColor: colors.background,
              borderRadius: '10px',
              border: `1px solid ${colors.lightAccent}`
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: moodColors[Math.floor((score - 2) / 2)] || moodColors[2],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                margin: '0 auto 6px',
                ...typography.body,
                fontSize: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                {score}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: colors.textSecondary,
                ...typography.body
              }}>
                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Resource Library with better spacing
const ResourceLibrary = ({ resources }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'anxiety', name: 'Anxiety', icon: '🧘' },
    { id: 'postpartum', name: 'Postpartum', icon: '👶' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🌸' },
    { id: 'support', name: 'Support', icon: '🤝' }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(res => res.category === selectedCategory);

  return (
    <div style={{ 
      backgroundColor: colors.cardBackground, 
      borderRadius: '20px', 
      padding: '20px', 
      boxShadow: '0 8px 25px rgba(27, 179, 186, 0.1)',
      border: `1px solid ${colors.lightAccent}`
    }}>
      <h3 style={{ 
        ...typography.heading, 
        color: colors.textPrimary, 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '18px'
      }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        Wellness Resources
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          flexWrap: 'wrap',
          padding: '10px',
          backgroundColor: colors.background,
          borderRadius: '12px'
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: selectedCategory === cat.id ? colors.primary : 'transparent',
                color: selectedCategory === cat.id ? 'white' : colors.textSecondary,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: '12px' 
      }}>
        {filteredResources.map((res, idx) => (
          <div key={idx} style={{ 
            border: `1px solid ${colors.lightAccent}`, 
            borderRadius: '12px', 
            padding: '16px', 
            backgroundColor: colors.background,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(27, 179, 186, 0.15)';
            e.currentTarget.style.borderColor = colors.primary;
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = colors.lightAccent;
          }}
          >
            <div style={{ 
              fontSize: '20px', 
              marginBottom: '8px' 
            }}>
              {res.icon}
            </div>
            <h4 style={{ 
              ...typography.body, 
              color: colors.textPrimary, 
              fontWeight: '600',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              {res.title}
            </h4>
            <p style={{ 
              fontSize: '12px', 
              color: colors.textSecondary, 
              lineHeight: '1.4',
              marginBottom: '12px'
            }}>
              {res.description}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: colors.primary,
              fontWeight: '500',
              fontSize: '12px'
            }}>
              <span>Learn More</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Wellness Report with better proportions
const WellnessReport = ({ onExport, moodData }) => {
  const averageMood = moodData.length > 0 
    ? (moodData.reduce((sum, data) => sum + data.score, 0) / moodData.length).toFixed(1)
    : 0;

  const trend = moodData.length >= 2 
    ? moodData[moodData.length - 1].score - moodData[moodData.length - 2].score
    : 0;

  return (
    <div style={{ 
      backgroundColor: colors.cardBackground,
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 8px 25px rgba(27, 179, 186, 0.1)',
      marginTop: '20px',
      border: `1px solid ${colors.lightAccent}`
    }}>
      <h3 style={{ 
        ...typography.heading, 
        color: colors.textPrimary, 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '18px'
      }}>
        <span style={{ fontSize: '18px' }}>📈</span>
        Wellness Summary
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '12px', 
        marginBottom: '20px' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '16px', 
          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`, 
          borderRadius: '12px',
          border: `1px solid ${colors.lightAccent}`
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: colors.primary,
            marginBottom: '4px'
          }}>
            {averageMood}
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: colors.textSecondary,
            fontWeight: '500'
          }}>
            Average Mood
          </div>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          padding: '16px', 
          background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.mint}30)`, 
          borderRadius: '12px',
          border: `1px solid ${colors.lightAccent}`
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: colors.textPrimary,
            marginBottom: '4px'
          }}>
            {moodData.length}
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: colors.textSecondary,
            fontWeight: '500'
          }}>
            Days Tracked
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          padding: '16px', 
          background: `linear-gradient(135deg, ${colors.accent}20, ${colors.warning}20)`, 
          borderRadius: '12px',
          border: `1px solid ${colors.lightAccent}`
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: trend >= 0 ? colors.primary : colors.accent,
            marginBottom: '4px'
          }}>
            {trend >= 0 ? '↗' : '↘'}
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: colors.textSecondary,
            fontWeight: '500'
          }}>
            Trend
          </div>
        </div>
      </div>
      
      <Button onClick={onExport} style={{ width: '100%' }} variant="secondary" size="small">
        <span style={{ marginRight: '6px' }}>📄</span>
        Export Wellness Report (PDF)
      </Button>
    </div>
  );
};

// Main App Component with enhanced header and better spacing
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [moodData, setMoodData] = useState([
    { date: '2025-06-08', score: 6 },
    { date: '2025-06-09', score: 7 },
    { date: '2025-06-10', score: 5 },
    { date: '2025-06-11', score: 8 },
    { date: '2025-06-12', score: 6 },
  ]);
  const [resources, setResources] = useState([
    { 
      title: 'Managing Postpartum Anxiety', 
      description: 'Evidence-based techniques for managing anxiety after childbirth.',
      link: '#',
      category: 'anxiety',
      icon: '🧘‍♀️'
    },
    { 
      title: 'New Mother Support Groups', 
      description: 'Connect with other mothers experiencing similar challenges.',
      link: '#',
      category: 'support',
      icon: '👥'
    },
    { 
      title: 'Mindful Breathing Exercises', 
      description: 'Simple breathing techniques to reduce stress and promote calm.',
      link: '#',
      category: 'mindfulness',
      icon: '🌸'
    },
    { 
      title: 'Understanding Postpartum Depression', 
      description: 'Educational resources about postpartum depression symptoms and treatment.',
      link: '#',
      category: 'postpartum',
      icon: '📚'
    },
  ]);

  const handleLogin = (email, password) => {
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  const handleSendMessage = (text) => {
    const userMessage = { text, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const responses = [
        "I hear you, and your feelings are completely valid. Can you tell me more about what's been on your mind?",
        "Thank you for sharing that with me. It takes courage to express these feelings. How can I support you today?",
        "I'm here to listen and support you. What would be most helpful for you right now?",
        "Your experience matters, and you're not alone in this. Would you like to explore some coping strategies together?"
      ];
      const botMessage = { 
        text: responses[Math.floor(Math.random() * responses.length)], 
        isUser: false 
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const handleAddMood = (newMood) => {
    setMoodData(prev => {
      const filtered = prev.filter(mood => mood.date !== newMood.date);
      return [...filtered, newMood].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
  };

  const handleExportReport = () => {
    alert('Wellness report will be generated and downloaded as PDF. This feature connects to your backend report generator.');
  };

  if (!isAuthenticated) {
    return <Authentication onLogin={handleLogin} />;
  }

  return (
    <div style={{ 
      fontFamily: typography.body.fontFamily, 
      backgroundColor: colors.background, 
      minHeight: '100vh', 
      padding: '16px'
    }}>
      {/* Enhanced Header with Navigation */}
      <header style={{ 
        marginBottom: '24px',
        padding: '20px 24px',
        backgroundColor: colors.cardBackground,
        borderRadius: '16px',
        boxShadow: '0 6px 20px rgba(27, 179, 186, 0.1)',
        border: `1px solid ${colors.lightAccent}`,
        background: `linear-gradient(135deg, ${colors.cardBackground}, ${colors.background})`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Logo and Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.headerGradient1})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🌸
            </div>
            <div>
              <h1 style={{ 
                ...typography.heading, 
                fontSize: '24px',
                marginBottom: '2px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.headerGradient1})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Serene
              </h1>
              <p style={{ 
                ...typography.body, 
                color: colors.textSecondary,
                fontSize: '13px',
                margin: 0
              }}>
                Your AI companion for mental wellness
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <nav style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ 
                color: colors.textSecondary, 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={e => e.target.style.color = colors.primary}
              onMouseOut={e => e.target.style.color = colors.textSecondary}
              >
                Dashboard
              </a>
              <a href="#" style={{ 
                color: colors.textSecondary, 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={e => e.target.style.color = colors.primary}
              onMouseOut={e => e.target.style.color = colors.textSecondary}
              >
                Resources
              </a>
              <a href="#" style={{ 
                color: colors.textSecondary, 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={e => e.target.style.color = colors.primary}
              onMouseOut={e => e.target.style.color = colors.textSecondary}
              >
                Progress
              </a>
            </nav>

            {/* User Profile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: colors.background,
              borderRadius: '20px',
              border: `1px solid ${colors.lightAccent}`
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                👤
              </div>
              <span style={{ 
                fontSize: '13px', 
                color: colors.textPrimary,
                fontWeight: '500'
              }}>
                Welcome back!
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid with better spacing */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.8fr 1fr', 
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div>
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
          <WellnessReport onExport={handleExportReport} moodData={moodData} />
        </div>
        
        <div>
          <MoodTracker moodData={moodData} onAddMood={handleAddMood} />
          <ResourceLibrary resources={resources} />
        </div>
      </div>
    </div>
  );
};

export default App;
