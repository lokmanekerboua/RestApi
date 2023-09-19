const Post = require('../../model/Post/Post')
const User = require('../../model/User/User')
const {appErr} = require("../../utils/appErr");

const createPostCtrl = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        //find the user 
        const Author = await User.findById(req.userAuth);
        //Create the post 
        const postcreated = await Post.create({
            title,
            description,
            user: Author._id
        })
        //Assoociate the post with the user
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

const postCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'post route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const allPostsCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'all posts route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const deletePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete post route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

const updatePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'update post route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

module.exports = {
    createPostCtrl,
    postCtrl,
    allPostsCtrl,
    deletePostCtrl,
    updatePostCtrl
}