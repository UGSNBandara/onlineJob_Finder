const Experience = require('../models/Experience');

// Create a new experience
exports.createExperience = async (req, res) => {
  try {
    const { user_id, title, description, from_year, to_year } = req.body;
    const experience = await Experience.create({
      user_id,
      title,
      description,
      from_year,
      to_year
    });
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all experiences
exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.findAll();
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get experience by ID
exports.getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update experience
exports.updateExperience = async (req, res) => {
  try {
    const { title, description, from_year, to_year } = req.body;
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    await experience.update({
      title,
      description,
      from_year,
      to_year
    });
    res.status(200).json(experience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete experience
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    await experience.destroy();
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 