const express = require('express');
const isLogin = require('../../middlewares/isLogin');

const {
    createPostCtrl,
    postCtrl,
    allPostsCtrl,
    deletePostCtrl,
    updatePostCtrl } = require('../../controllers/posts/postsCtrl');

const postRouter = express.Router();

postRouter.post('/', isLogin, createPostCtrl);

postRouter.get('/:id', postCtrl);

postRouter.get('/', allPostsCtrl);

postRouter.delete("/:id", deletePostCtrl);

postRouter.put("/:id", updatePostCtrl);

module.exports = postRouter;