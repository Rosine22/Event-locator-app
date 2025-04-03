const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Define category routes
router.post('/', categoryController.createCategory); // Create a new category
router.get('/', categoryController.getCategories); // Get all categories
router.get('/:id', categoryController.getCategoryById); // Get category by ID
router.put('/:id', categoryController.updateCategory); // Update category
router.delete('/:id', categoryController.deleteCategory); // Delete category

module.exports = router;
