'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Stack, Typography, TextField, CircularProgress } from '@mui/material';

export default function Home() {
  const [page, setPage] = useState(1); // Page state
  const [consultationData, setConsultationData] = useState({}); // Consultation form data
  const [messages, setMessages] = useState([]); // Chatbot messages
  const [message, setMessage] = useState(''); // Input message for chatbot
  const [isLoading, setIsLoading] = useState(false); // Loading state for AI response
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle user text input change in the consultation form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConsultationData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle message input change for the chatbot
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Send a message to the AI
  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = message;
    setMessage(''); // Clear input
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userMessage },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: userMessage }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: assistantMessage },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'There was an error. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press for the chatbot input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Function to simulate going to the next page
  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Function to go back to the previous page
  const prevPage = () => {
    setPage((prevPage) => Math.max(1, prevPage - 1));
  };

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
        We’ll help you find the best service that suits your needs.
      </Typography>
      <Button variant="contained" onClick={nextPage} sx={{ mt: 3 }}>
        Get Started
      </Button>
    </Box>
  );

  // Consultation Page with AI-powered chatbot
  const ConsultationPage = () => {
    return (
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
          Consultation
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please describe what you need, and our assistant will help you refine your request.
        </Typography>

        <Stack sx={{ width: '100%', maxWidth: 600, maxHeight: '60vh', overflowY: 'auto', bgcolor: 'white', p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          {messages.map((message, index) => (
            <div key={index} style={{ marginBottom: '1rem', color: 'black' }}>
              <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong>
              <p>{message.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
          <TextField
            fullWidth
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask for a service or describe what you need..."
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

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={prevPage}>
            Back
          </Button>
          <Button variant="contained" onClick={nextPage} disabled={isLoading}>
            Next
          </Button>
        </Stack>
      </Box>
    );
  };

  // Recommendations Page
  const RecommendationsPage = () => (
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
      {/* You can dynamically generate recommendations based on messages or consultationData */}
      <ul>
        <li>Service 1: Tailored to {consultationData.service || 'your needs'}</li>
        <li>Service 2</li>
        <li>Service 3</li>
      </ul>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={prevPage}>
          Back
        </Button>
        <Button variant="contained">Book Now</Button>
      </Stack>
    </Box>
  );

  // Render the appropriate page based on the current state
  return (
    <Box sx={{ bgcolor: 'white', color: 'black', height: '100vh' }}>
      {page === 1 && <WelcomePage />}
      {page === 2 && <ConsultationPage />}
      {page === 3 && <RecommendationsPage />}
    </Box>
  );
}
