const express = require('express');
const {
    createCategoryCtrl,
    getCategoryCtrl,
    deleteCategoryCtrl,
    updateCategoryCtrl } = require('../../controllers/categories/categoryCtrl');
    
const categoryRouter = express.Router();

categoryRouter.post('/', createCategoryCtrl);

categoryRouter.get('/:id', getCategoryCtrl);

categoryRouter.delete('/:id', deleteCategoryCtrl);

categoryRouter.put('/:id', updateCategoryCtrl);

module.exports = categoryRouter;