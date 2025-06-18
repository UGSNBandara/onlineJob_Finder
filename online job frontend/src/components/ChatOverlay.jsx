import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography, TextField, Paper, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChatOverlay({ chat, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat?.id) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          throw new Error('No authentication data found');
        }

        const currentUser = JSON.parse(userData);
        console.log('Current user:', currentUser);
        console.log('Chat participant:', chat.participant);

        const response = await axios.get(
          `http://localhost:5000/api/messages/conversation/${currentUser.id}/${chat.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data && Array.isArray(response.data)) {
          const sortedMessages = [...response.data].sort((a, b) => 
            new Date(a.created_at) - new Date(b.created_at)
          );
          setMessages(sortedMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chat?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat?.id) return;

    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        throw new Error('No authentication data found');
      }

      const currentUser = JSON.parse(userData);

      const response = await axios.post(
        'http://localhost:5000/api/messages',
        {
          sender_id: currentUser.id,
          receiver_id: chat.id,
          message_text: newMessage.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (!chat) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 350,
        height: 500,
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            cursor: 'pointer'
          }}
          onClick={() => handleProfileClick(chat.participant.id)}
        >
          <Avatar 
            src={`http://localhost:5000${chat.participant?.profileImage}`}
            alt={`${chat.participant?.firstName} ${chat.participant?.lastName}`}
          />
          <Typography variant="subtitle1">
            {chat.participant?.firstName} {chat.participant?.lastName}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {loading ? (
          <Typography variant="body2" color="text.secondary" align="center">
            Loading messages...
          </Typography>
        ) : error ? (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        ) : messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.sender_id === JSON.parse(localStorage.getItem('user'))?.id;
            return (
              <Box
                key={message.id}
                sx={{
                  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    bgcolor: isCurrentUser ? "primary.light" : "grey.100",
                    color: isCurrentUser ? "white" : "text.primary",
                  }}
                >
                  <Typography variant="body2">{message.message_text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, opacity: 0.7 }}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                color="primary"
              >
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Paper>
  );
}

export default ChatOverlay; 