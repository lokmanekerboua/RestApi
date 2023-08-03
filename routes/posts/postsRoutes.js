const express = require('express');

const {
    createPostCtrl,
    postCtrl,
    allPostsCtrl,
    deletePostCtrl,
    updatePostCtrl } = require('../../controllers/posts/postsCtrl');

const postRouter = express.Router();

postRouter.post('/', createPostCtrl);

postRouter.get('/:id', postCtrl);

postRouter.get('/', allPostsCtrl);

postRouter.delete("/:id", deletePostCtrl);

postRouter.put("/:id", updatePostCtrl);

module.exports = postRouter;