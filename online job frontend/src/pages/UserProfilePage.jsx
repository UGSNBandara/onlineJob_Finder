import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Paper, Grid, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProfileContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
}));

const SkillButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  textTransform: 'none',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  borderRadius: '20px',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: 180,
  height: 180,
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    opacity: 0.9,
    transform: 'scale(1.02)',
    transition: 'all 0.3s ease',
  },
}));

const HiddenInput = styled('input')({
  display: 'none',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: theme.spacing(1),
}));

const EditButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '8px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const UserProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    location: '',
    description: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = response.data;
      setProfile(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title || '',
        location: data.location || '',
        description: data.description || '',
        skills: data.skills || []
      });
      setError(null);
    } catch (err) {
      setError('Failed to load profile. Please try again later.');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Update profile
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        title: formData.title,
        location: formData.location,
        description: formData.description
      };

      await axios.put(`${API_URL}/users/me`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update skills separately
      await axios.put(`${API_URL}/users/me/skills`, 
        { skills: formData.skills },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await loadProfile();
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError('Failed to update profile. Please try again later.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (editMode) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/users/me/profile-image`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      await loadProfile();
      setError(null);
    } catch (err) {
      setError('Failed to update profile image. Please try again later.');
      console.error('Error updating profile image:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
      <ProfileContainer elevation={3}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Profile
          </Typography>
          <EditButton
            variant={editMode ? "outlined" : "contained"}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </EditButton>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <ProfileImage
            src={profile?.profileImage}
            alt={`${profile?.firstName} ${profile?.lastName}`}
            onClick={handleImageClick}
          />
          {editMode && (
            <HiddenInput
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
            />
          )}
          {editMode && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
              Click on the image to change it
            </Typography>
          )}
        </Box>

        {editMode ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    fullWidth
                    label="Add Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    sx={{ borderRadius: '8px', minWidth: '100px' }}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.skills.map((skill, index) => (
                    <SkillButton
                      key={index}
                      size="small"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      {skill} ×
                    </SkillButton>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  fullWidth
                  sx={{ 
                    borderRadius: '8px',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SectionTitle variant="h6">Name</SectionTitle>
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                {profile?.firstName} {profile?.lastName}
              </Typography>
            </Grid>
            {profile?.title && (
              <Grid item xs={12}>
                <SectionTitle variant="h6">Title</SectionTitle>
                <Typography variant="body1">{profile.title}</Typography>
              </Grid>
            )}
            {profile?.location && (
              <Grid item xs={12}>
                <SectionTitle variant="h6">Location</SectionTitle>
                <Typography variant="body1">📍 {profile.location}</Typography>
              </Grid>
            )}
            {profile?.description && (
              <Grid item xs={12}>
                <SectionTitle variant="h6">About</SectionTitle>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {profile.description}
                </Typography>
              </Grid>
            )}
            {profile?.skills?.length > 0 && (
              <Grid item xs={12}>
                <SectionTitle variant="h6">Skills</SectionTitle>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {profile.skills.map((skill, index) => (
                    <SkillButton
                      key={index}
                      size="small"
                      disabled
                    >
                      {skill}
                    </SkillButton>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </ProfileContainer>
    </Box>
  );
};

export default UserProfilePage; 