import React, { useState } from 'react';
import Header from '../components/layout/Header';
import ChatInterface from '../components/features/chat/ChatInterface';
import { colors, typography } from '../styles/theme';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai" },
    { id: 2, text: "I'm feeling a bit anxious today.", sender: "user" },
    { id: 3, text: "I'm sorry to hear that. Let's talk about what's causing your anxiety.", sender: "ai" }
  ]);

  const handleSendMessage = (text) => {
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: text,
      sender: "user"
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Simulate AI response (this would be replaced with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "I understand how you feel. Would you like to try a quick breathing exercise?",
        sender: "ai"
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

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
        <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;