// src/components/features/mood/MoodTracker.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../common/Button';
import { colors, typography } from '../../../styles/theme';

const MoodTracker = ({ moodData, onAddMood }) => {
  const [currentMood, setCurrentMood] = useState(5);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Great'];
  const moodColors = [colors.accent, '#ffa07a', '#ffd93d', colors.secondary, colors.primary];

  // Check if the user has already logged a mood today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const loggedToday = moodData.some(data => data.date === today);
    setHasLoggedToday(loggedToday);
  }, [moodData]);

  const handleMoodSubmit = () => {
    if (hasLoggedToday) return;
    
    const today = new Date().toISOString().split('T')[0];
    onAddMood({ date: today, score: currentMood });
    setHasLoggedToday(true);
  };

  return (
    <div style={{ 
      backgroundColor: colors.cardBackground, 
      borderRadius: '20px', 
      padding: '20px', 
      boxShadow: '0 8px 25px rgba(27, 179, 186, 0.1)',
      border: `1px solid ${colors.lightAccent}`,
      height: '100%'
    }}>
      <h2 style={{
        ...typography.heading,
        color: colors.textPrimary,
        marginBottom: '20px',
        fontSize: '20px'
      }}>
        Mood Tracker
      </h2>

      <div style={{ marginBottom: '30px' }}>
        <p style={{ 
          ...typography.body, 
          color: colors.textSecondary, 
          marginBottom: '15px',
          fontSize: '15px'
        }}>
          How are you feeling today?
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: colors.mint,
          borderRadius: '18px',
          padding: '10px',
          marginBottom: '15px'
        }}>
          {moodEmojis.map((emoji, index) => (
            <div 
              key={index} 
              onClick={() => !hasLoggedToday && setCurrentMood((index + 1) * 2)}
              style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                cursor: hasLoggedToday ? 'not-allowed' : 'pointer',
                borderRadius: '50%',
                backgroundColor: currentMood === (index + 1) * 2 ? moodColors[index] : 'transparent',
                transform: currentMood === (index + 1) * 2 ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.2s ease',
                boxShadow: currentMood === (index + 1) * 2 ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                opacity: hasLoggedToday ? 0.6 : 1
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          paddingLeft: '5px',
          paddingRight: '5px'
        }}>
          {moodLabels.map((label, index) => (
            <span 
              key={index} 
              style={{
                ...typography.light,
                fontSize: '12px',
                color: currentMood === (index + 1) * 2 ? moodColors[index] : colors.textSecondary,
                fontWeight: currentMood === (index + 1) * 2 ? '600' : '400'
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Button 
          onClick={handleMoodSubmit} 
          style={{ 
            minWidth: '150px',
            opacity: hasLoggedToday ? 0.6 : 1,
            cursor: hasLoggedToday ? 'not-allowed' : 'pointer'
          }}
          variant={hasLoggedToday ? "secondary" : "primary"}
        >
          {hasLoggedToday ? "Mood Logged for Today" : "Log Today's Mood"}
        </Button>
        
        {hasLoggedToday && (
          <p style={{
            ...typography.light,
            fontSize: '12px',
            color: colors.textSecondary,
            marginTop: '8px'
          }}>
            You've already logged your mood today.
          </p>
        )}
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3 style={{
          ...typography.heading,
          color: colors.textPrimary,
          fontSize: '16px',
          marginBottom: '15px'
        }}>
          Recent Mood History
        </h3>
        
        <div style={{ 
          display: 'flex', 
          overflow: 'auto',
          paddingBottom: '10px'
        }}>
          {moodData.slice(-5).map((data, index) => (
            <div 
              key={index}
              style={{
                minWidth: '70px',
                padding: '10px',
                textAlign: 'center',
                background: colors.mint,
                borderRadius: '12px',
                marginRight: '10px'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>
                {moodEmojis[Math.floor(data.score / 2) - 1]}
              </div>
              <div style={{ 
                ...typography.light,
                fontSize: '12px',
                color: colors.textSecondary
              }}>
                {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;