import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ChatInterface from '../components/features/chat/ChatInterface';
import { colors, typography } from '../styles/theme';
import api from '../services/api';

const Chat = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setError('User ID not found. Please log in again.');
          setIsLoading(false);
          return;
        }
        
        // Initialize chat session with previous history
        await api.post(`/chat/init-session/${userId}`);
        
        // Then fetch the history
        console.log('Fetching chat history for user:', userId);
        const response = await api.get(`/chat/history/${userId}`);
        console.log('Chat history response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          const formattedMessages = response.data.map(msg => ({
            id: msg.id,
            text: msg.message,
            sender: msg.is_bot ? 'ai' : 'user'
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setError('Failed to load chat history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatHistory();
  }, []);

  const handleSendMessage = async (text) => {
    // Add user message to UI immediately
    const newUserMessage = {
      id: Date.now(),
      text: text,
      sender: "user"
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('User ID not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      console.log('Sending message to API:', text);
      // Send message to API
      const response = await api.post('/chat/message', {
        user_id: parseInt(userId),
        message: text,
        language: 'en'
      });
      
      console.log('API response:', response.data);
      
      // Add bot response to UI
      const botResponse = {
        id: response.data.message_id,
        text: response.data.bot_message,
        sender: "ai"
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        sender: "ai"
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      fontFamily: typography.body.fontFamily, 
      backgroundColor: colors.background, 
      minHeight: '100vh', 
      padding: '16px'
    }}>
      <Header onLogout={onLogout} />
      
      <div style={{ 
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
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
        
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Chat;