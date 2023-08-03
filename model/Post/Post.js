const mongoose = require('mongoose');

//create the schema

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Post Category is required'],
    },
    numViews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    Likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    disLikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please Author is required'],
    },
    photo: {
        type: String,
        required: [true, 'Photo is required'],
    },
},
{
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;