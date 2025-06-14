// src/components/features/resources/ResourceLibrary.jsx
import React, { useState } from 'react';
import { colors, typography } from '../../../styles/theme';

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
      <h2 style={{
        ...typography.heading,
        color: colors.textPrimary,
        marginBottom: '20px',
        fontSize: '20px'
      }}>
        Resource Library
      </h2>
      
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '15px',
        marginBottom: '20px'
      }}>
        {categories.map(category => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              backgroundColor: selectedCategory === category.id ? colors.mint : 'transparent',
              border: `1px solid ${selectedCategory === category.id ? colors.primary + '40' : 'transparent'}`,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '16px' }}>{category.icon}</span>
            <span style={{
              ...typography.body,
              color: selectedCategory === category.id ? colors.primary : colors.textSecondary,
              fontWeight: selectedCategory === category.id ? '600' : '400',
              fontSize: '14px'
            }}>
              {category.name}
            </span>
          </div>
        ))}
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {filteredResources.map(resource => (
          <div
            key={resource.id}
            style={{
              backgroundColor: colors.mint,
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              border: `1px solid ${colors.lightAccent}`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(27, 179, 186, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '16px',
              color: colors.textPrimary,
              ...typography.heading,
              marginBottom: '8px'
            }}>
              {resource.title}
            </div>
            
            <div style={{
              fontSize: '14px',
              color: colors.textSecondary,
              ...typography.light,
              flex: 1,
              marginBottom: '16px'
            }}>
              {resource.description}
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                padding: '4px 10px',
                backgroundColor: colors.lightAccent,
                borderRadius: '12px',
                fontSize: '12px',
                color: colors.primary,
                ...typography.body
              }}>
                {resource.type}
              </span>
              
              <span style={{
                fontSize: '14px',
                color: colors.primary,
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                View →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceLibrary;