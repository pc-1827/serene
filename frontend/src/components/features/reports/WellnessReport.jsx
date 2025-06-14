// src/components/features/reports/WellnessReport.jsx
import React from 'react';
import Button from '../../common/Button';
import { colors, typography } from '../../../styles/theme';

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
      border: `1px solid ${colors.lightAccent}`,
      height: '100%'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px'
      }}>
        <h2 style={{
          ...typography.heading,
          color: colors.textPrimary,
          fontSize: '20px',
          margin: 0
        }}>
          Wellness Report
        </h2>
        
        <Button 
          onClick={onExport} 
          variant="secondary" 
          size="small"
        >
          Export Report
        </Button>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: colors.mint,
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            ...typography.light,
            fontSize: '14px',
            color: colors.textSecondary,
            marginBottom: '10px'
          }}>
            Average Mood
          </div>
          <div style={{
            ...typography.heading,
            fontSize: '32px',
            color: colors.textPrimary
          }}>
            {averageMood}
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.mint,
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            ...typography.light,
            fontSize: '14px',
            color: colors.textSecondary,
            marginBottom: '10px'
          }}>
            Trend
          </div>
          <div style={{
            ...typography.heading,
            fontSize: '32px',
            color: trend > 0 ? colors.primary : trend < 0 ? colors.accent : colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '–'}
            <span style={{ marginLeft: '5px' }}>{Math.abs(trend)}</span>
          </div>
        </div>
      </div>
      
      <div style={{
        marginBottom: '20px'
      }}>
        <h3 style={{
          ...typography.heading,
          color: colors.textPrimary,
          fontSize: '16px',
          marginBottom: '10px'
        }}>
          Insights
        </h3>
        
        <p style={{
          ...typography.body,
          color: colors.textSecondary,
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {averageMood > 7 
            ? "You've been maintaining a positive mood lately. Keep up the great self-care practices!" 
            : averageMood > 5 
              ? "Your mood has been balanced recently. Consider adding more mindfulness activities to your routine." 
              : "Your mood trend indicates you might benefit from additional support. Try exploring our resources or chatting with our support team."}
        </p>
      </div>
      
      <div>
        <h3 style={{
          ...typography.heading,
          color: colors.textPrimary,
          fontSize: '16px',
          marginBottom: '10px'
        }}>
          Recommendations
        </h3>
        
        <ul style={{
          ...typography.body,
          color: colors.textSecondary,
          fontSize: '14px',
          lineHeight: '1.6',
          paddingLeft: '20px'
        }}>
          <li>Try our guided breathing exercise in the Chat section</li>
          <li>Review the mindfulness resources in our library</li>
          <li>Maintain a consistent sleep schedule</li>
          <li>Connect with your support network regularly</li>
        </ul>
      </div>
    </div>
  );
};

export default WellnessReport;