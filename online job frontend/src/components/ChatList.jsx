import { useState, useEffect } from 'react';
import { useMessage } from '../context/MessageContext';
import axios from 'axios';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const API_URL = 'http://localhost:5000/api';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  padding: theme.spacing(2),
}));

const LastMessageText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '200px',
}));

function ChatList({ onSelectChat }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setError('User data not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (!user.id) {
        setError('Invalid user data. Please login again.');
        setLoading(false);
        return;
      }
      loadConversations(user.id);
    } catch (err) {
      console.error('Error parsing user data:', err);
      setError('Error loading user data. Please login again.');
      setLoading(false);
    }
  }, []);

  const loadConversations = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      console.log('Fetching conversations for user:', userId); // Debug log
      const response = await axios.get(`${API_URL}/messages/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Process messages to create unique conversations
      const conversationMap = new Map();
      response.data.forEach(message => {
        const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        const otherUser = message.sender_id === userId ? message.receiver : message.sender;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            user: otherUser,
            lastMessage: message.message_text,
            timestamp: message.created_at,
            unread: false
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
      setError(null);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Messages
      </Typography>
      <List>
        {conversations.length === 0 ? (
          <ListItem>
            <ListItemText primary="No messages yet" />
          </ListItem>
        ) : (
          conversations.map((conversation) => (
            <div key={conversation.id}>
              <StyledListItem onClick={() => onSelectChat(conversation)}>
                <ListItemAvatar>
                  <Avatar
                    src={conversation.user.profileImage ? `${API_URL}${conversation.user.profileImage}` : '/default_profile.jpg'}
                    alt={`${conversation.user.firstName} ${conversation.user.lastName}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`${conversation.user.firstName} ${conversation.user.lastName}`}
                  secondary={
                    <LastMessageText>
                      {conversation.lastMessage}
                    </LastMessageText>
                  }
                />
              </StyledListItem>
              <Divider variant="inset" component="li" />
            </div>
          ))
        )}
      </List>
    </Box>
  );
}

export default ChatList; 