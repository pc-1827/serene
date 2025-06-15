// src/components/features/chat/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import Button from '../../common/Button';
import AudioRecorder from './AudioRecorder';
import { colors, typography } from '../../../styles/theme';

// Function to convert URLs in text to clickable links
const formatMessageWithLinks = (text) => {
  if (!text) return '';
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split the text by URLs and map through parts
  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) || [];
  
  // Combine parts and matches to reconstruct text with links
  return parts.map((part, i) => {
    // Check if the next part is a URL match
    const url = matches[i];
    if (url) {
      return (
        <>
          {part}
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#0078ff', 
              textDecoration: 'underline',
              wordBreak: 'break-all'
            }}
          >
            {url}
          </a>
        </>
      );
    }
    return part;
  });
};

const ChatInterface = ({ messages, onSendMessage, onSendAudio, isLoading }) => {
  const [input, setInput] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim() !== '' && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };
  
  const handleAudioCaptured = (audioBlob) => {
    if (onSendAudio && !isLoading) {
      onSendAudio(audioBlob);
      setShowVoiceRecorder(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      backgroundColor: colors.cardBackground,
      borderRadius: '20px',
      padding: '20px',
      height: '80vh', // Increased from 70vh to 80vh
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 25px rgba(27, 179, 186, 0.1)',
      border: `1px solid ${colors.lightAccent}`
    }}>
      <div style={{ 
        ...typography.heading, 
        color: colors.textPrimary, 
        marginBottom: '16px',
        fontSize: '20px'
      }}>
        Chat with Dr. Sarah
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '16px',
        padding: '10px'
      }}>
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div 
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? colors.primary : colors.lightAccent,
                color: msg.sender === 'user' ? 'white' : colors.textPrimary,
                padding: '12px 16px',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                maxWidth: '80%', // Increased from 70% to 80%
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                whiteSpace: 'pre-wrap', // Preserve line breaks
                wordBreak: 'break-word' // Ensure long words don't overflow
              }}
            >
              {/* Use the formatting function to make links clickable */}
              {formatMessageWithLinks(msg.text)}
            </div>
          ))
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: colors.textSecondary,
            textAlign: 'center',
            padding: '20px'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>👋 Welcome to your therapy session!</p>
            <p style={{ fontSize: '14px' }}>
              I'm Dr. Sarah, your AI therapeutic assistant. 
              Feel free to share how you're feeling today.
            </p>
          </div>
        )}
        
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: colors.lightAccent,
            color: colors.textPrimary,
            padding: '12px 16px',
            borderRadius: '18px 18px 18px 4px',
            maxWidth: '70%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span className="typing-dot" style={{ animationDelay: '0s' }}>•</span>
              <span className="typing-dot" style={{ animationDelay: '0.2s' }}>•</span>
              <span className="typing-dot" style={{ animationDelay: '0.4s' }}>•</span>
            </div>
            <span>Dr. Sarah is typing</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {showVoiceRecorder ? (
        <div style={{ marginBottom: '12px' }}>
          <AudioRecorder 
            onAudioCaptured={handleAudioCaptured} 
            isLoading={isLoading} 
          />
          <Button
            variant="text"
            onClick={() => setShowVoiceRecorder(false)}
            style={{ marginTop: '8px', color: colors.textSecondary }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: '12px',
              border: `1px solid ${colors.lightAccent}`,
              fontSize: '16px',
              outline: 'none'
            }}
            disabled={isLoading}
          />
          
          <Button 
            onClick={() => setShowVoiceRecorder(true)}
            variant="secondary"
            style={{
              backgroundColor: colors.accent,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.66 15 15 13.66 15 12V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
              <path d="M17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12H5C5 15.53 7.61 18.43 11 18.92V22H13V18.92C16.39 18.43 19 15.53 19 12H17Z" fill="currentColor"/>
            </svg>
          </Button>
          
          <Button 
            onClick={handleSend}
            variant="primary"
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Send'}
          </Button>
        </div>
      )}
      
      <style jsx="true">{`
        .typing-dot {
          animation: typingAnimation 1.4s infinite;
          font-size: 24px;
          line-height: 0;
        }
        
        @keyframes typingAnimation {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;