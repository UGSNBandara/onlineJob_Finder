import { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
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
          <Box>
            <Typography variant="h6" component="h2">
              {post.title}
            </Typography>
            <InfoChip>
              <AccessTimeIcon />
              <Typography variant="body2">
                Posted on {formatDate(post.created_at)}
              </Typography>
            </InfoChip>
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