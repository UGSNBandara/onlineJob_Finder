import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const BACKEND_URL = 'http://localhost:5000';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const PostImage = styled(CardMedia)({
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  maxWidth: '100%',
});

const PostContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const InfoChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(0.5),
    fontSize: '1rem',
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: `2px solid ${theme.palette.primary.main}`,
}));

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserDetails();
  }, [post.user_id]);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await axios.get(`${API_URL}/users/${post.user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading user details:', err);
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.user_id}`);
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // If the image path is already a full URL, return it as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the backend URL
    return `${BACKEND_URL}${imagePath}`;
  };

  return (
    <StyledCard>
      {post.image_url && (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <PostImage
            component="img"
            src={getImageUrl(post.image_url)}
            alt={post.title}
          />
        </Box>
      )}
      <PostContent>
        <PostHeader>
          <Box sx={{ width: '100%' }}>
            <UserInfo onClick={handleProfileClick}>
              {loading ? (
                <CircularProgress size={40} />
              ) : error ? (
                <StyledAvatar alt="Error loading profile" />
              ) : (
                <StyledAvatar
                  src={user?.profileImage ? getImageUrl(user.profileImage) : '/default_profile.jpg'}
                  alt={`${user?.firstName} ${user?.lastName}`}
                />
              )}
          <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {loading ? 'Loading...' : error ? 'Error' : `${user?.firstName} ${user?.lastName}`}
            </Typography>
            <InfoChip>
              <AccessTimeIcon />
              <Typography variant="body2">
                Posted on {formatDate(post.created_at)}
              </Typography>
            </InfoChip>
              </Box>
            </UserInfo>
            <Typography variant="h6" component="h2" mt={1}>
              {post.title}
            </Typography>
          </Box>
        </PostHeader>

        <Typography variant="body1" paragraph>
          {post.description}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Box>
            <IconButton onClick={handleLike} color="primary">
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="primary"
          >
            View Details
          </Button>
        </Box>
      </PostContent>
    </StyledCard>
  );
}

export default PostCard; 