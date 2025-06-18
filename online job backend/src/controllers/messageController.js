const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

const messageController = {
  // Create a new message
  createMessage: async (req, res) => {
    try {
      const { sender_id, receiver_id, message_text } = req.body;
      const message = await Message.create({
        sender_id,
        receiver_id,
        message_text
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all messages for a user
  getUserMessages: async (req, res) => {
    try {
      const userId = req.params.userId;
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { sender_id: userId },
            { receiver_id: userId }
          ]
        },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'profileImage', 'role']
          },
          {
            model: User,
            as: 'receiver',
            attributes: ['id', 'firstName', 'lastName', 'profileImage', 'role']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get conversation between two users
  getConversation: async (req, res) => {
    try {
      const { userId1, userId2 } = req.params;
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            {
              sender_id: userId1,
              receiver_id: userId2
            },
            {
              sender_id: userId2,
              receiver_id: userId1
            }
          ]
        },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'profileImage', 'role']
          },
          {
            model: User,
            as: 'receiver',
            attributes: ['id', 'firstName', 'lastName', 'profileImage', 'role']
          }
        ],
        order: [['created_at', 'ASC']]
      });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update message
  updateMessage: async (req, res) => {
    try {
      const { message_text } = req.body;
      const message = await Message.findByPk(req.params.id);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      await message.update({
        message_text
      });
      res.status(200).json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete message
  deleteMessage: async (req, res) => {
    try {
      const message = await Message.findByPk(req.params.id);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      await message.destroy();
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = messageController; 