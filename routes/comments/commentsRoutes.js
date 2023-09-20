const express = require('express');
const isLogin = require('../../middlewares/isLogin');

const {
    addcommentCtrl,
    deletecommentCtrl,
    updatecommentCtrl
} = require('../../controllers/comments/commentsCtrl');

const commentRouter = express.Router();

commentRouter.post('/:id', isLogin, addcommentCtrl);

commentRouter.delete('/:id', isLogin, deletecommentCtrl);

commentRouter.put('/:id', isLogin, updatecommentCtrl);

module.exports = commentRouter;