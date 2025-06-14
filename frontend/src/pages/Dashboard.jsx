// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import MoodTracker from '../components/features/mood/MoodTracker';
import WellnessReport from '../components/features/reports/WellnessReport';
import { colors, typography } from '../styles/theme';

const Dashboard = () => {
  const [moodData, setMoodData] = useState([
    { date: '2025-06-08', score: 6 },
    { date: '2025-06-09', score: 7 },
    { date: '2025-06-10', score: 5 },
    { date: '2025-06-11', score: 8 },
    { date: '2025-06-12', score: 6 },
  ]);

  const handleAddMood = (newMood) => {
    setMoodData([...moodData, newMood]);
  };

  const handleExportReport = () => {
    console.log('Exporting report...');
    // Implementation for report export
  };

  return (
    <div style={{ 
      fontFamily: typography.body.fontFamily, 
      backgroundColor: colors.background, 
      minHeight: '100vh', 
      padding: '16px'
    }}>
      <Header />
      
      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <MoodTracker moodData={moodData} onAddMood={handleAddMood} />
        <WellnessReport onExport={handleExportReport} moodData={moodData} />
      </div>
    </div>
  );
};

export default Dashboard;