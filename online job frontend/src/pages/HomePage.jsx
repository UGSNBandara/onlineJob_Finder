import { Box } from '@mui/material';
import CreatePostButton from '../components/CreatePostButton';
import PostCard from '../components/PostCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts');
      setPosts(response.data.posts);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <CreatePostButton />
      </Box>
      {error ? (
        <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
          {error}
        </Box>
      ) : loading ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          Loading posts...
        </Box>
      ) : (
        posts.map(post => (
          <Box key={post.id} sx={{ mb: 2 }}>
            <PostCard post={post} />
          </Box>
        ))
      )}
    </>
  );
}

export default HomePage; 