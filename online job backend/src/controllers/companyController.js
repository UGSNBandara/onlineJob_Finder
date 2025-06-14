const Company = require('../models/Company');

// Create a new company
exports.createCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const company = await Company.create({
      name,
      email,
      password
    });
    res.status(201).json({
      id: company.id,
      name: company.name,
      email: company.email,
      created_at: company.created_at
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company
exports.updateCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    await company.update({
      name,
      email,
      password,
      updated_at: new Date()
    });
    res.status(200).json({
      id: company.id,
      name: company.name,
      email: company.email,
      updated_at: company.updated_at
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    await company.destroy();
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 