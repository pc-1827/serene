import React from 'react';
import Header from '../components/layout/Header';
import ResourceLibrary from '../components/features/resources/ResourceLibrary';
import { colors, typography } from '../styles/theme';

const Resources = () => {
  const resources = [
    {
      id: 1,
      title: "Understanding Postpartum Depression",
      description: "A comprehensive guide to recognizing and coping with postpartum depression.",
      category: "postpartum",
      type: "article",
      url: "#"
    },
    {
      id: 2,
      title: "5-Minute Anxiety Relief Meditation",
      description: "Quick meditation technique to help manage anxiety symptoms.",
      category: "anxiety",
      type: "video",
      url: "#"
    },
    {
      id: 3,
      title: "Mindfulness for New Parents",
      description: "Simple mindfulness practices you can do while caring for your baby.",
      category: "mindfulness",
      type: "guide",
      url: "#"
    },
    {
      id: 4,
      title: "Finding Local Support Groups",
      description: "Directory of support groups for new mothers in your area.",
      category: "support",
      type: "tool",
      url: "#"
    }
  ];

  return (
    <div style={{ 
      fontFamily: typography.body.fontFamily, 
      backgroundColor: colors.background, 
      minHeight: '100vh', 
      padding: '16px'
    }}>
      <Header />
      
      <div style={{ 
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <ResourceLibrary resources={resources} />
      </div>
    </div>
  );
};

export default Resources;