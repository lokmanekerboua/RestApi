const express = require('express');

const {
    addcommentCtrl,
    getcommentCtrl,
    deletecommentCtrl,
    updatecommentCtrl } = require('../../controllers/comments/commentsCtrl');

const commentRouter = express.Router();

commentRouter.post('/', addcommentCtrl);

commentRouter.get('/:id', getcommentCtrl);

commentRouter.delete('/:id', deletecommentCtrl);

commentRouter.put('/:id', updatecommentCtrl);

module.exports = commentRouter;