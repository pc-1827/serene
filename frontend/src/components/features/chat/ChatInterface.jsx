// src/components/features/chat/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import Button from '../../common/Button';
import { colors, typography } from '../../../styles/theme';

const ChatInterface = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim() !== '') {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
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
      height: '70vh',
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
        Chat with Serene
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
        {messages && messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? colors.primary : colors.lightAccent,
              color: msg.sender === 'user' ? 'white' : colors.textPrimary,
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              maxWidth: '70%',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
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
        />
        <Button 
          onClick={handleSend}
          variant="primary"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;