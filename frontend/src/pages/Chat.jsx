import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ChatInterface from '../components/features/chat/ChatInterface';
import { colors, typography } from '../styles/theme';
import api from '../services/api';

const Chat = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load chat history on component mount - only once after login
  useEffect(() => {
    const loadMessages = () => {
      // First check if we have messages in localStorage
      const storedMessages = localStorage.getItem('chatMessages');
      
      if (storedMessages) {
        console.log('Loading chat messages from localStorage');
        setMessages(JSON.parse(storedMessages));
        return true; // We loaded messages successfully
      }
      
      return false; // No stored messages
    };
    
    const fetchChatHistory = async () => {
      // If we loaded messages from localStorage, skip the fetch
      if (loadMessages()) {
        return;
      }
      
      // Check if we've already initialized the session
      const sessionInitialized = localStorage.getItem('chatSessionInitialized') === 'true';
      
      try {
        setIsLoading(true);
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setError('User ID not found. Please log in again.');
          setIsLoading(false);
          return;
        }
        
        // Only initialize session if not already done
        if (!sessionInitialized) {
          console.log('Initializing chat session...');
          await api.post(`/chat/init-session/${userId}`);
          localStorage.setItem('chatSessionInitialized', 'true');
        }
        
        // Fetch the history
        console.log('Fetching chat history for user:', userId);
        const response = await api.get(`/chat/history/${userId}`);
        
        if (response.data && Array.isArray(response.data)) {
          const formattedMessages = response.data.map(msg => ({
            id: msg.id,
            text: msg.message,
            sender: msg.is_bot ? 'ai' : 'user'
          }));
          
          // Update state
          setMessages(formattedMessages);
          
          // Store in localStorage
          localStorage.setItem('chatMessages', JSON.stringify(formattedMessages));
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

  // Function to update message storage
  const updateMessageStorage = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('chatMessages', JSON.stringify(newMessages));
  };

  const handleSendMessage = async (text) => {
    // Add user message to UI immediately
    const newUserMessage = {
      id: Date.now(),
      text: text,
      sender: "user"
    };
    
    // Update messages in state and localStorage
    const updatedMessages = [...messages, newUserMessage];
    updateMessageStorage(updatedMessages);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('User ID not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      // Send message to API
      const response = await api.post('/chat/message', {
        user_id: parseInt(userId),
        message: text,
        language: 'en'
      });
      
      // Add bot response to UI
      const botResponse = {
        id: response.data.message_id,
        text: response.data.bot_message,
        sender: "ai"
      };
      
      // Update messages in state and localStorage
      const messagesWithBotResponse = [...updatedMessages, botResponse];
      updateMessageStorage(messagesWithBotResponse);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        sender: "ai"
      };
      
      updateMessageStorage([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendAudio = async (audioBlob) => {
    // Create a temporary ID for the user message
    const tempUserMsgId = Date.now();
    
    // Add user message to UI immediately (placeholder until transcription)
    const newUserMessage = {
      id: tempUserMsgId,
      text: "🎤 Processing voice message...",
      sender: "user"
    };
    
    // Update messages in state and localStorage
    const updatedMessages = [...messages, newUserMessage];
    updateMessageStorage(updatedMessages);
    
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
      
      // Important: Create a completely new array for React to detect changes
      const newMessages = [];
      
      // Copy all messages except the placeholder
      messages.forEach(msg => {
        if (msg.id !== tempUserMsgId) {
          newMessages.push(msg);
        }
      });
      
      // Add the transcribed text message
      newMessages.push({
        id: tempUserMsgId,
        text: response.data.transcribed_text || "Voice message",
        sender: "user"
      });
      
      // Add the bot response
      newMessages.push({
        id: response.data.message_id || Date.now() + 1,
        text: response.data.bot_message,
        sender: "ai"
      });
      
      // Update state and localStorage
      updateMessageStorage(newMessages);
      
    } catch (err) {
      console.error('Failed to process voice message:', err);
      setError('Failed to process voice message. Please try again.');
      
      // Simple error handling with new array approach
      const newMessages = messages.map(msg => 
        msg.id === tempUserMsgId 
          ? { ...msg, text: "Voice message couldn't be processed" } 
          : msg
      );
      
      newMessages.push({
        id: Date.now() + 1,
        text: "I'm sorry, I couldn't process your voice message. Please try again or type your message.",
        sender: "ai"
      });
      
      updateMessageStorage(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // Add cleanup function for logout
  const handleLogout = () => {
    // Clear chat-related items from localStorage on logout
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('chatSessionInitialized');
    
    // Call the original onLogout function
    onLogout();
  };

  return (
    <div style={{ 
      fontFamily: typography.body.fontFamily, 
      backgroundColor: colors.background, 
      minHeight: '100vh', 
      padding: '16px'
    }}>
      <Header onLogout={handleLogout} />
      
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