import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CreatePostContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
}));

const PostButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  justifyContent: 'flex-start',
  textTransform: 'none',
  borderRadius: '24px',
  backgroundColor: theme.palette.grey[100],
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const PostModal = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: theme.spacing(3),
  zIndex: 1000,
}));

const Overlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999,
});

const ImagePreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const PreviewImage = styled('img')({
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
});

function CreatePostButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
    });
    setImage(null);
    setPreviewUrl(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('user_id', user.id);
      if (image) {
        formDataToSend.append('images', image);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post('/api/posts', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      handleClose();
      // You might want to trigger a refresh of the posts list here
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <CreatePostContainer>
        <PostButton onClick={handleOpen}>
          <Typography color="text.secondary">
            What's on your mind?
          </Typography>
        </PostButton>
      </CreatePostContainer>

      {open && (
        <>
          <Overlay onClick={handleClose} />
          <PostModal>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Create Post</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                multiline
                rows={4}
                margin="normal"
              />

              <Box mt={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ImageIcon />}
                  >
                    {image ? 'Change Image' : 'Add Image'}
                  </Button>
                </label>
              </Box>

              {previewUrl && (
                <ImagePreview>
                  <Box position="relative">
                    <PreviewImage src={previewUrl} alt="Preview" />
                    <IconButton
                      size="small"
                      onClick={removeImage}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: 'white' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ImagePreview>
              )}

              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Post'}
                </Button>
              </Box>
            </form>
          </PostModal>
        </>
      )}
    </>
  );
}

export default CreatePostButton; 