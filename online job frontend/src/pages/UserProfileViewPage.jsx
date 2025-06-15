import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'
import axios from 'axios'
import { Box, Typography, Paper, Avatar, CircularProgress, Alert } from '@mui/material'
import { styled } from '@mui/material/styles'

const API_URL = 'http://localhost:5000/api'

const ProfileContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
}));

const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: 180,
  height: 180,
  marginBottom: theme.spacing(2),
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: theme.spacing(1),
}));

function UserProfileViewPage() {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    loadUserProfile()
  }, [userId])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required. Please login.')
        return
      }

      console.log('Fetching user profile for ID:', userId)
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('User profile response:', response.data)
      setUser(response.data)
      
      // If user is a recruiter, load their job posts
      if (response.data.role === 'recruiter') {
        console.log('Fetching posts for recruiter')
        const postsResponse = await axios.get(`${API_URL}/posts/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('Posts response:', postsResponse.data)
        setPosts(postsResponse.data)
      }
      
      setError(null)
    } catch (err) {
      console.error('Error loading profile:', err)
      setError(err.response?.data?.message || 'Failed to load profile. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
        <Alert severity="warning" sx={{ mt: 3 }}>User not found</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
      <ProfileContainer elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <ProfileImage
            src={user?.profileImage || '/default_profile.jpg'}
            alt={`${user?.firstName} ${user?.lastName}`}
          />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
            {user?.title}
          </Typography>
          <Typography variant="body1" color="primary" sx={{ mt: 1, fontWeight: 500 }}>
            {user?.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
          </Typography>
        </Box>

        <Box mb={4}>
          <SectionTitle variant="h6">About</SectionTitle>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {user?.description || 'No description provided'}
          </Typography>
        </Box>

        {user?.location && (
          <Box mb={4}>
            <SectionTitle variant="h6">Location</SectionTitle>
            <Typography variant="body1">📍 {user.location}</Typography>
          </Box>
        )}

        {user?.skills?.length > 0 && (
          <Box mb={4}>
            <SectionTitle variant="h6">Skills</SectionTitle>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {user.skills.map((skill, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    padding: '4px 12px',
                    borderRadius: '16px',
                  }}
                >
                  {skill}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {user?.role === 'recruiter' && posts.length > 0 && (
          <Box>
            <SectionTitle variant="h6">Open Positions</SectionTitle>
            <Box sx={{ mt: 2 }}>
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => {}}
                  onApply={() => {}}
                />
              ))}
            </Box>
          </Box>
        )}
      </ProfileContainer>
    </Box>
  )
}

export default UserProfileViewPage 