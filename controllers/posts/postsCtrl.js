const Post = require('../../model/Post/Post')
const User = require('../../model/User/User')
const {appErr} = require("../../utils/appErr");

const createPostCtrl = async (req, res, next) => {
    const {title, description, category} = req.body;
    try {
        //find the user 
        const Author = await User.findById(req.userAuth);

        //check if the author is blocked
        if (Author.isBlocked) {
            return next(appErr('Access denied, account blocked', 401));
        }

        //Create the post 
        const postcreated = await Post.create({
            title,
            description,
            user: Author._id,
            category,
            photo: req?.file?.path,
        })
        //Associate the post with the user
        Author.posts.push(postcreated);

        //save user 
        await Author.save();

        res.json({
            status: 'success',
            data: postcreated,
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}

const postCtrl = async (req, res, next) => {
    try {
        res.json({
            status: 'success',
            data: 'post route'
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

//fetch all posts
const allPostsCtrl = async (req, res, next) => {
    try {
        //find all posts
        const posts = await Post.find({})
            .populate('user')
            .populate('category', 'title')
            .exec();

        //check if the user is blocked by the post author
        const filteredPosts = posts.filter(post => {
            //get all blocked users
            const blockedUsers = post.user.blocked;
            const isBlocked = blockedUsers.includes(req.userAuth);
            return !isBlocked;
        });

        res.json({
            status: 'success',
            data: filteredPosts,
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

//toggle likes
const toggleLikesPostCtrl = async (req, res, next) => {
    try {
        //get the post
        const post = await Post.findById(req.params.id);
        //check if the user has liked the post
        const isliked = post.Likes.includes(req.userAuth);
        //if the user has liked the post/inlike the post
        if (isliked) {
            post.Likes = post.Likes.filter(like => like != req.userAuth);
            await post.save();
        } else {
            post.Likes.push(req.userAuth);
            await post.save();
        }

        res.json({
            status: 'success',
            data: 'you have liked the post'
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

//toggle dislikes
const toggleDisLikesPostCtrl = async (req, res, next) => {
    try {
        //get the post
        const post = await Post.findById(req.params.id);
        //check if the user has liked the post
        const isunliked = post.disLikes.includes(req.userAuth);
        //if the user has disliked the post/indislike the post
        if (isunliked) {
            post.disLikes = post.disLikes.filter(dislike => dislike != req.userAuth);
            await post.save();
        } else {
            post.disLikes.push(req.userAuth);
            await post.save();
        }

        res.json({
            status: 'success',
            data: 'you have disliked the post'
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

const postDetailsCtrl = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        //number of views
        //check if the user viewed the post
        const isViewed = post.numViews.includes(req.userAuth);
        if (isViewed) {
            return res.json({
                status: 'success',
                data: post
            })
        } else {
            post.numViews.push(req.userAuth);
            //save
            await post.save();

            res.json({
                status: 'success',
                data: post
            })
        }
    } catch (error) {
        return next(appErr(error.message))
    }
}

const deletePostCtrl = async (req, res, next) => {
    try {
        //check if the post belongs to the user
        //find the post
        const post = await Post.findById(req.params.id)
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appErr('Access denied, you are not the author of this post', 403));
        }
        await Post.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: 'delete post success'
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

const updatePostCtrl = async (req, res, next) => {
    const {title, description, category} = req.body;
    try {
        //check if the post belongs to the user
        //find the post
        const post = await Post.findById(req.params.id)
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appErr('Access denied, you are not the author of this post', 403));
        }
        const updatepost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                category,
                photo: req?.file?.path,
            },
            {
                new: true
            }
        );
        res.json({
            status: 'success',
            data: updatepost
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

module.exports = {
    createPostCtrl,
    postCtrl,
    allPostsCtrl,
    toggleLikesPostCtrl,
    toggleDisLikesPostCtrl,
    postDetailsCtrl,
    deletePostCtrl,
    updatePostCtrl
}