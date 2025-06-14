const User = require('../models/User');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert user to plain object and modify profile image path if needed
    const userData = user.get({ plain: true });
    if (!userData.profileImage) {
      userData.profileImage = 'http://localhost:5000/default_profile.jpg';
    } else if (!userData.profileImage.startsWith('http')) {
      userData.profileImage = `http://localhost:5000${userData.profileImage}`;
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert user to plain object and modify profile image path if needed
    const userData = user.get({ plain: true });
    if (!userData.profileImage) {
      userData.profileImage = 'http://localhost:5000/default_profile.jpg';
    } else if (!userData.profileImage.startsWith('http')) {
      userData.profileImage = `http://localhost:5000${userData.profileImage}`;
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, title, location, description } = req.body;
    const userId = req.user.userId;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    await user.update({
      firstName,
      lastName,
      title,
      location,
      description
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        location: user.location,
        description: user.description
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Update user skills
exports.updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const userId = req.user.userId;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update skills
    await user.update({ skills });

    res.json({
      message: 'Skills updated successfully',
      skills: user.skills
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating skills', error: error.message });
  }
};

// Update profile image
exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const userId = req.user.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      // Delete the uploaded file if user not found
      await fs.unlink(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // If user has an existing profile image, delete it
    if (user.profileImage && user.profileImage !== '/default_profile.jpg') {
      const oldImagePath = path.join(__dirname, '../../public', user.profileImage);
      try {
        await fs.unlink(oldImagePath);
      } catch (error) {
        console.error('Error deleting old profile image:', error);
      }
    }

    // Update user's profile image path
    const imagePath = `/profileImages/${req.file.filename}`;
    await user.update({ profileImage: imagePath });

    res.json({
      message: 'Profile image updated successfully',
      profileImage: `http://localhost:5000${imagePath}`
    });
  } catch (error) {
    // Delete the uploaded file if there's an error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({ message: 'Error updating profile image', error: error.message });
  }
}; 