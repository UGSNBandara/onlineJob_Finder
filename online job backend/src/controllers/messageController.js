const Message = require('../models/Message');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { user_id, company_id, post_id, message_text } = req.body;
    const message = await Message.create({
      user_id,
      company_id,
      post_id,
      message_text,
      created_at: new Date()
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update message
exports.updateMessage = async (req, res) => {
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
};

// Delete message
exports.deleteMessage = async (req, res) => {
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
}; 