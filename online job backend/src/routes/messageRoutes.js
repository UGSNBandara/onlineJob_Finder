const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middleware/auth');

// Create a new message
router.post('/', authenticateToken, messageController.createMessage);

// Get all messages for a user
router.get('/user/:userId', authenticateToken, messageController.getUserMessages);

// Get conversation between two users
router.get('/conversation/:userId1/:userId2', authenticateToken, messageController.getConversation);

// Update message
router.put('/:id', authenticateToken, messageController.updateMessage);

// Delete message
router.delete('/:id', authenticateToken, messageController.deleteMessage);

module.exports = router; 