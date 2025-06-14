const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Create a new message
router.post('/', messageController.createMessage);

// Get all messages
router.get('/', messageController.getAllMessages);

// Get message by ID
router.get('/:id', messageController.getMessageById);

// Update message
router.put('/:id', messageController.updateMessage);

// Delete message
router.delete('/:id', messageController.deleteMessage);

module.exports = router; 