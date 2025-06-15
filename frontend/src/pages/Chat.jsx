import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ChatInterface from '../components/features/chat/ChatInterface';
import { colors, typography } from '../styles/theme';
import api from '../services/api';

const Chat = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historyFetched, setHistoryFetched] = useState(false);
  
  // Load chat history only once
  useEffect(() => {
    const fetchChatHistory = async () => {
      // Skip if already fetched
      if (historyFetched) return;

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
          // Mark as fetched
          setHistoryFetched(true);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setError('Failed to load chat history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatHistory();
  }, [historyFetched]); // Only depends on historyFetched

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
  
  const handleSendAudio = async (audioBlob) => {
    // Add user message to UI immediately (placeholder until transcription)
    const newUserMessage = {
      id: Date.now(),
      text: "🎤 Processing voice message...",
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
      
      // Create form data to send audio file
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      
      console.log('Sending audio to API');
      
      // Send audio to API for processing
      const response = await api.post(`/voice/chat/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Voice API response:', response.data);
      
      // FIXED: Update only once with both the transcribed text and bot response
      setMessages(prev => {
        return prev.map(msg => {
          // Update the placeholder message with the transcribed text
          if (msg.id === newUserMessage.id) {
            return {
              ...msg,
              text: response.data.transcribed_text || "Voice message"
            };
          }
          return msg;
        }).concat({
          // Add the bot response
          id: response.data.message_id,
          text: response.data.bot_message,
          sender: "ai"
        });
      });
      
    } catch (err) {
      console.error('Failed to process voice message:', err);
      setError('Failed to process voice message. Please try again.');
      
      // Update the placeholder message
      setMessages(prev => 
        prev.map(msg => msg.id === newUserMessage.id ? 
          {...msg, text: "Voice message couldn't be processed"} : 
          msg
        )
      );
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I couldn't process your voice message. Please try again or type your message.",
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
          onSendAudio={handleSendAudio}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Chat;