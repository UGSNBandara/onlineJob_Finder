const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Create a new company
router.post('/', companyController.createCompany);

// Get all companies
router.get('/', companyController.getAllCompanies);

// Get company by ID
router.get('/:id', companyController.getCompanyById);

// Update company
router.put('/:id', companyController.updateCompany);

// Delete company
router.delete('/:id', companyController.deleteCompany);

module.exports = router; 