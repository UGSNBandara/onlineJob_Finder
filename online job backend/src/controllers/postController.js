const Post = require('../models/Post');
const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');

// Helper function to save images
const saveImages = async (files) => {
  const imageUrls = [];
  const uploadDir = path.join(__dirname, '../../public/postImages');

  // Create directory if it doesn't exist
  await fs.mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, file.buffer);
    imageUrls.push(`/postImages/${fileName}`);
  }

  return imageUrls;
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, description, user_id } = req.body;
    
    // Handle image upload
    let image_url = null;
    if (req.files && req.files.length > 0) {
      const uploadDir = path.join(__dirname, '../../public/postImages');
      await fs.mkdir(uploadDir, { recursive: true });
      const file = req.files[0];
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, file.buffer);
      image_url = `/postImages/${fileName}`;
    }

    const post = await Post.create({
      title,
      description,
      image_url,
      user_id,
      created_at: new Date()
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all posts with pagination and filters
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, job_type, location, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (job_type) whereClause.job_type = job_type;
    if (location) whereClause.location = location;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: posts } = await Post.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalPosts: count
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, job_type } = req.body;
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Handle image uploads
    let images = post.images;
    if (req.files && req.files.length > 0) {
      // Delete old images if needed
      if (req.body.deleteOldImages === 'true') {
        for (const imageUrl of post.images) {
          const imagePath = path.join(__dirname, '../../public', imageUrl);
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }
        images = [];
      }
      
      // Save new images
      const newImages = await saveImages(req.files);
      images = [...images, ...newImages];
    }

    await post.update({
      title,
      description,
      requirements,
      salary,
      location,
      job_type,
      images,
      updated_at: new Date()
    });

    res.status(200).json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete associated images
    for (const imageUrl of post.images) {
      const imagePath = path.join(__dirname, '../../public', imageUrl);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    await post.destroy();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: error.message });
  }
}; 