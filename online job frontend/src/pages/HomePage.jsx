import { Box, Pagination, CircularProgress } from '@mui/material';
import CreatePostButton from '../components/CreatePostButton';
import PostCard from '../components/PostCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/posts?page=${pageNum}`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <CreatePostButton onPostCreated={() => fetchPosts(page)} />
      </Box>

      {error ? (
        <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
          {error}
        </Box>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {posts.map(post => (
            <Box key={post.id} sx={{ mb: 2 }}>
              <PostCard post={post} />
            </Box>
          ))}
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}

export default HomePage; 