import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Box, Typography, CircularProgress, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

const SidebarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  background: 'white',
}));

const ProfileImage = styled('img')(({ theme }) => ({
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const UserName = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '1.25rem',
  marginTop: theme.spacing(2),
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const UserInfo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  marginTop: theme.spacing(0.5),
}));

const UserTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: '1rem',
  marginTop: theme.spacing(1),
}));

const UserLocation = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  marginTop: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const UserDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.9rem',
  marginTop: theme.spacing(2),
  lineHeight: 1.6,
}));

const SkillsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const SkillButton = styled('button')(({ theme }) => ({
  background: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  border: 'none',
  padding: '6px 16px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  cursor: 'default',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
}));

function LeftSidebar() {
  const { user: authUser, isLoggedIn } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoggedIn) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await axios.get('/api/users/me')
        setUser(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError('Failed to load profile')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <SidebarContainer>
        <Typography color="text.secondary" align="center">
          Please log in to view your profile
        </Typography>
      </SidebarContainer>
    )
  }

  if (loading) {
    return (
      <SidebarContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </SidebarContainer>
    )
  }

  if (error || !user) {
    return (
      <SidebarContainer>
        <Typography color="error" align="center">
          {error || 'Error loading profile'}
        </Typography>
      </SidebarContainer>
    )
  }

  return (
    <SidebarContainer>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Link to={"/profile"}>
          <ProfileImage 
            src={user.profileImage} 
            alt={`${user.firstName} ${user.lastName}`} 
          />
        </Link>
        
        <Link to={"/profile"} style={{ textDecoration: 'none' }}>
          <UserName>
            {`${user.firstName} ${user.lastName}`}
          </UserName>
        </Link>
        
        <UserInfo>{user.email}</UserInfo>
        
        {user.title && (
          <UserTitle>{user.title}</UserTitle>
        )}
        
        {user.location && (
          <UserLocation>
            <span>📍</span> {user.location}
          </UserLocation>
        )}
        
        {user.description && (
          <UserDescription>
            {user.description}
          </UserDescription>
        )}
        
        {user.skills && user.skills.length > 0 && (
          <SkillsContainer>
            {user.skills.map(skill => (
              <SkillButton key={skill}>
                {skill}
              </SkillButton>
            ))}
          </SkillsContainer>
        )}
      </Box>
    </SidebarContainer>
  )
}

export default LeftSidebar 