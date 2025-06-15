import { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(2),
}));

const PostImage = styled(CardMedia)({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const PostContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const CompanyLogo = styled('img')({
  width: 48,
  height: 48,
  borderRadius: '50%',
  marginRight: 16,
});

const InfoChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleApply = () => {
    setApplied(true);
  };

  return (
    <StyledCard>
      {post.images && post.images.length > 0 && (
        <PostImage
          image={post.images[0]}
          title={post.title}
        />
      )}
      <PostContent>
        <PostHeader>
          <CompanyLogo
            src={post.company?.logo || '/default_profile.jpg'}
            alt={post.company?.name || 'Company'}
          />
          <Box>
            <Typography variant="h6" component="h2">
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.company?.name || 'Company Name'}
            </Typography>
          </Box>
        </PostHeader>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <InfoChip
              icon={<LocationOnIcon />}
              label={post.location}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoChip
              icon={<WorkIcon />}
              label={post.job_type}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <InfoChip
              icon={<AttachMoneyIcon />}
              label={post.salary}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Typography variant="body1" paragraph>
          {post.description}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Requirements:
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {post.requirements}
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
            onClick={handleApply}
            disabled={applied}
          >
            {applied ? 'Applied' : 'Apply Now'}
          </Button>
        </Box>
      </PostContent>
    </StyledCard>
  );
}

export default PostCard; 