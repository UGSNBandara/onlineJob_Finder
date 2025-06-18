import { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, CircularProgress } from '@mui/material';
import { useMessage } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RightSidebar() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectChat } = useMessage();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      if (!isLoggedIn) return;
      
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

        const response = await axios.get(`http://localhost:5000/api/messages/user/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Chats response:', response);
        
        if (response.data && Array.isArray(response.data)) {
          // Process messages to create unique conversations
          const conversationMap = new Map();
          
          response.data.forEach(message => {
            // Determine the other user in the conversation
            const otherUser = message.sender_id === currentUser.id ? message.receiver : message.sender;
            
            if (!conversationMap.has(otherUser.id)) {
              conversationMap.set(otherUser.id, {
                id: otherUser.id,
                participant: otherUser,
                lastMessage: message.message_text,
                timestamp: message.created_at
              });
            }
          });
          
          setChats(Array.from(conversationMap.values()));
        } else {
          setChats([]);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [isLoggedIn]);

  const handleChatSelect = (chat) => {
    console.log('Chat selected:', chat);
    selectChat(chat);
  };

  const handleProfileClick = (userId, event) => {
    event.stopPropagation(); // Prevent chat selection when clicking profile
    navigate(`/profile/${userId}`);
  };

  if (!isLoggedIn) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Please log in to view messages
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Messages
      </Typography>
      <Divider />
      <List>
        {chats.length === 0 ? (
          <ListItem>
            <ListItemText primary="No messages yet" />
          </ListItem>
        ) : (
          chats.map((chat) => (
            <ListItem
              key={chat.id}
              button
              onClick={() => handleChatSelect(chat)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemAvatar>
                <Avatar
                  src={`http://localhost:5000${chat.participant?.profileImage}`}
                  alt={`${chat.participant?.firstName} ${chat.participant?.lastName}`}
                  onClick={(e) => handleProfileClick(chat.participant.id, e)}
                  sx={{ cursor: 'pointer' }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${chat.participant?.firstName} ${chat.participant?.lastName}`}
                secondary={chat.lastMessage || 'No messages yet'}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}

export default RightSidebar; 