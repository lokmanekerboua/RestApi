const express = require('express');
const isLogin = require('../../middlewares/isLogin');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const {
    createPostCtrl,
    postCtrl,
    allPostsCtrl,
    toggleLikesPostCtrl,
    toggleDisLikesPostCtrl,
    postDetailsCtrl,
    deletePostCtrl,
    updatePostCtrl
} = require('../../controllers/posts/postsCtrl');

const postRouter = express.Router();

//file upload middleware
const upload = multer({storage});


postRouter.post('/', isLogin, upload.single("image"), createPostCtrl);

postRouter.get('/:id', isLogin, postCtrl);

postRouter.get('/', isLogin, allPostsCtrl);

postRouter.get('/toggleLikes/:id', isLogin, toggleLikesPostCtrl);

postRouter.get('/toggleDisLikes/:id', isLogin, toggleDisLikesPostCtrl);

postRouter.get('/post_details/:id', isLogin, postDetailsCtrl);

postRouter.delete("/:id", isLogin, deletePostCtrl);

postRouter.put("/:id", isLogin, upload.single("image"), updatePostCtrl);

module.exports = postRouter;