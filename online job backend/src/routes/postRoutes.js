const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// Create a new post (requires authentication)
router.post('/', authMiddleware, postController.createPost);

// Get all posts (public)
router.get('/', postController.getAllPosts);

// Get post by ID (public)
router.get('/:id', postController.getPostById);

// Update post (requires authentication)
router.put('/:id', authMiddleware, postController.updatePost);

// Delete post (requires authentication)
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router; 