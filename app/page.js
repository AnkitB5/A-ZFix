'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Button, Stack, Typography, TextField, CircularProgress } from '@mui/material';

// Memoized message list component to avoid re-rendering of messages
const MessageList = React.memo(({ messages }) => (
  <Stack sx={{ width: '100%', maxWidth: 600, maxHeight: '50vh', overflowY: 'auto', bgcolor: 'white', p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
    {messages.map((msg, index) => (
      <div key={index} style={{ marginBottom: '1rem', color: 'black' }}>
        <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
        <p>{msg.content}</p>
      </div>
    ))}
    <div id="messagesEnd" />
  </Stack>
));

export default function Home() {
  const [page, setPage] = useState(1); // Page state
  const [message, setMessage] = useState(''); // Input message for chatbot
  const [isLoading, setIsLoading] = useState(false); // Loading state for AI response
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I’m the Headstarter support assistant. How can I help you today?',
    },
  ]); // Chatbot messages

  const inputRef = useRef(null); // Ref for the input field

  // Handle scrolling to the bottom of the messages
  const scrollToBottom = () => {
    const messagesEnd = document.getElementById('messagesEnd');
    messagesEnd?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle the message input change
  const handleMessageChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  // Send a message to the AI (simulated for now)
  const sendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return;

    const newMessage = message;
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: newMessage },
    ]);

    setMessage(''); // Clear the input field
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = "I'm here to assist with any services you need. Could you describe your requirement?";
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: response },
      ]);
      setIsLoading(false);
    }, 1500);
  }, [message, isLoading]);

  // Handle Enter key press to send the message
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Ensure the input box stays focused after rendering
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Welcome Page
  const WelcomePage = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Headstarter!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Let’s help you find the right service.
      </Typography>
      <Button variant="contained" onClick={() => setPage(2)} sx={{ mt: 3 }}>
        Get Started
      </Button>
    </Box>
  );

  // Consultation Page
  const ConsultationPage = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Consultation
      </Typography>
      <MessageList messages={messages} />

      <Stack direction="row" spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
        <TextField
          fullWidth
          value={message}
          inputRef={inputRef} // Keep input focused
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="Describe what you need..."
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={isLoading}
          sx={{ bgcolor: 'black', color: 'white' }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
        </Button>
      </Stack>
    </Box>
  );

  // Service Recommendation Page (Dummy Example)
  const RecommendationPage = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Recommended Services
      </Typography>
      <Typography variant="body1" gutterBottom>
        Based on your input, here are the best services for you:
      </Typography>
      <ul>
        <li>Service 1</li>
        <li>Service 2</li>
        <li>Service 3</li>
      </ul>
      <Button variant="contained" sx={{ mt: 3 }}>
        Book Now
      </Button>
    </Box>
  );

  // Render the current page based on the state
  return (
    <Box sx={{ bgcolor: 'white', height: '100vh' }}>
      {page === 1 && <WelcomePage />}
      {page === 2 && <ConsultationPage />}
      {page === 3 && <RecommendationPage />}
    </Box>
  );
}
