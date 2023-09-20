const Comments = require('../../model/Comments/Comments');
const User = require('../../model/User/User');
const Post = require('../../model/Post/Post');
const {appErr} = require("../../utils/appErr");
const Category = require("../../model/Category/Category");

const addcommentCtrl = async (req, res, next) => {
    const {description} = req.body;
    try {
        //find the post to add comment
        const post = await Post.findById(req.params.id);
        //create the comment
        const comment = await Comments.create({
            post: post._id,
            description,
            user: req.userAuth
        });

        //push the comment to the post
        post.comments.push(comment._id);

        //find the user to add comment
        const user = await User.findById(req.userAuth)
        //push the comment to the user
        user.comments.push(comment._id);
        //save the post

        //disable validation
        await post.save({validateBeforeSave: false});
        await user.save({validateBeforeSave: false});

        res.json({
            status: 'success',
            data: comment
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}

const deletecommentCtrl = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.id)
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appErr('Access denied, you are not the author of this Comment', 403));
        }
        await Comments.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: 'comment has been deleted'
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}

const updatecommentCtrl = async (req, res, next) => {
    const {description} = req.body;
    try {
        const comment = await Comments.findById(req.params.id)
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appErr('Access denied, you are not the author of this Comment', 403));
        }

        const commentt = await Comments.findByIdAndUpdate(
            req.params.id,
            {description},
            {new: true, runValidators: true}
        );

        res.json({
            status: 'success',
            data: commentt
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}

module.exports = {
    addcommentCtrl,
    deletecommentCtrl,
    updatecommentCtrl
}