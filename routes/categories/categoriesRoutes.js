const express = require('express');
const {
    createCategoryCtrl,
    fetchCategoryCtrl,
    getCategoryCtrl,
    deleteCategoryCtrl,
    updateCategoryCtrl
} = require('../../controllers/categories/categoryCtrl');

const categoryRouter = express.Router();
const isLogin = require("../../middlewares/isLogin");

categoryRouter.post('/', isLogin, createCategoryCtrl);

categoryRouter.get('/', isLogin, fetchCategoryCtrl);

categoryRouter.get('/:id', isLogin, getCategoryCtrl);

categoryRouter.delete('/:id', isLogin, deleteCategoryCtrl);

categoryRouter.put('/:id', isLogin, updateCategoryCtrl);

module.exports = categoryRouter;