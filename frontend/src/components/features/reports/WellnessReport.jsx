// src/components/features/reports/WellnessReport.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../common/Button';
import { colors, typography } from '../../../styles/theme';
import api from '../../../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WellnessReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  
  const graphRef = React.useRef();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('sentimentData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSentimentData(parsedData);
      
      // Set the first label as selected by default if available
      if (parsedData.available_labels && parsedData.available_labels.length > 0) {
        setSelectedLabel(parsedData.available_labels[0]);
      }
    }
  }, []);

  const fetchSentimentReport = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        setError('User ID not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      const response = await api.post('/sentiment/report', {
        user_id: parseInt(userId),
        days: 30  // Hardcoded to 30 days as requested
      });
      
      // Save to state and localStorage
      setSentimentData(response.data);
      localStorage.setItem('sentimentData', JSON.stringify(response.data));
      
      // Set the first label as selected by default
      if (response.data.available_labels.length > 0) {
        setSelectedLabel(response.data.available_labels[0]);
      }
      
    } catch (err) {
      console.error('Failed to fetch sentiment report:', err);
      setError('Failed to fetch sentiment report. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the handleDownloadPDF function
  const handleDownloadPDF = async () => {
    if (!sentimentData) return;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add title
    pdf.setFontSize(20);
    pdf.text('Wellness Report', 105, 15, { align: 'center' });
    
    // Add date
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 25, { align: 'center' });
    
    // Add user info if available
    pdf.text(`User ID: ${sentimentData.user_id}`, 20, 35);
    
    // Add intro text
    pdf.setFontSize(12);
    pdf.text('This report shows your sentiment trends over the past 30 days based on your conversations.', 20, 45);
    
    let yPosition = 55;
    
    // Loop through each sentiment label and capture a screenshot of each graph
    for (const label of sentimentData.available_labels) {
      setSelectedLabel(label);
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (graphRef.current) {
        const canvas = await html2canvas(graphRef.current);
        const imgData = canvas.toDataURL('image/png');
        
        // Add page if needed
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        // Add label title
        pdf.setFontSize(14);
        pdf.text(`${label} Sentiment Trend`, 105, yPosition, { align: 'center' });
        yPosition += 10;
        
        // Add graph image - make it wider and centered
        const imgWidth = 170; // Use more width of the page
        const imgHeight = 100; // Make graphs taller
        const pageWidth = 210; // A4 width in mm
        const marginLeft = (pageWidth - imgWidth) / 2;
        
        pdf.addImage(imgData, 'PNG', marginLeft, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 20; // Add more space between graphs
      }
    }
    
    // Save the PDF
    pdf.save('wellness-report.pdf');
  };

  // Update the prepareSentimentChart function
  const prepareSentimentChart = (label) => {
    if (!sentimentData || !sentimentData.daily_sentiments) return null;
    
    const dates = sentimentData.daily_sentiments.map(day => day.date);
    const scores = sentimentData.daily_sentiments.map(day => day.labels[label] || null);
    
    const data = {
      labels: dates,
      datasets: [
        {
          label: label,
          data: scores,
          borderColor: colors.primary,
          backgroundColor: `${colors.primary}40`,
          borderWidth: 2,
          pointBackgroundColor: colors.primary,
          pointRadius: 4,
          tension: 0.3,
          fill: true,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
              family: typography.body.fontFamily
            }
          }
        },
        title: {
          display: true,
          text: `${label} Sentiment Trend`,
          font: {
            size: 18,
            family: typography.heading.fontFamily,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: colors.cardBackground,
          titleColor: colors.textPrimary,
          bodyColor: colors.textSecondary,
          borderColor: colors.lightAccent,
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              return `Score: ${(context.raw * 100).toFixed(1)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 1,
          ticks: {
            callback: function(value) {
              return `${(value * 100).toFixed(0)}%`;
            },
            font: {
              size: 12
            }
          },
          grid: {
            color: `${colors.lightAccent}50`
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 11
            }
          },
          grid: {
            display: false
          }
        }
      },
      layout: {
        padding: {
          left: 10,
          right: 20,
          top: 0,
          bottom: 10
        }
      }
    };
    
    return { data, options };
  };

  return (
    <div style={{ 
      backgroundColor: colors.cardBackground,
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 8px 25px rgba(27, 179, 186, 0.1)',
      border: `1px solid ${colors.lightAccent}`
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
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            onClick={fetchSentimentReport} 
            variant="primary" 
            size="small"
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Loading...' : 'Get Wellness Report'}
          </Button>
          
          <Button 
            onClick={handleDownloadPDF} 
            variant="secondary" 
            size="small"
            style={{ 
              opacity: !sentimentData ? 0.5 : 1,
              cursor: !sentimentData ? 'not-allowed' : 'pointer'
            }}
            disabled={!sentimentData}
          >
            Download PDF
          </Button>
        </div>
      </div>
      
      {error && (
        <div style={{
          backgroundColor: '#fff0f0',
          border: '1px solid #ffcccc',
          color: '#e60000',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      {!sentimentData && !isLoading && !error && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: colors.textSecondary
        }}>
          <p>Click "Get Wellness Report" to analyze your sentiment data.</p>
        </div>
      )}
      
      {sentimentData && (
        <div>
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '10px',
            marginBottom: '20px'
          }}>
            {sentimentData.available_labels.map(label => (
              <div
                key={label}
                onClick={() => setSelectedLabel(label)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: selectedLabel === label ? colors.primary : colors.lightAccent,
                  color: selectedLabel === label ? 'white' : colors.textPrimary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                {label}
              </div>
            ))}
          </div>
          
          <div 
            ref={graphRef} 
            style={{ 
              height: '400px',  // Increase height from 300px to 400px
              width: '100%',    // Take full width of container
              maxWidth: '800px', // Set maximum width
              margin: '0 auto',  // Center the container
              padding: '20px',   // Add padding around the chart
            }}>
            {selectedLabel && prepareSentimentChart(selectedLabel) && (
              <Line 
                data={prepareSentimentChart(selectedLabel).data} 
                options={{
                  ...prepareSentimentChart(selectedLabel).options,
                  maintainAspectRatio: false, // Allow chart to fill container
                  responsive: true
                }} 
              />
            )}
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h3 style={{
              ...typography.heading,
              fontSize: '16px',
              color: colors.textPrimary,
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
              This report shows your sentiment trends over time based on your conversations. 
              Higher values indicate more positive expressions of each emotion or sentiment.
              Click on different sentiment labels to view their trends.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessReport;