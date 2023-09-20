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
            //required: [true, 'Post Category is required'],
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
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments',
        }],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please Author is required'],
        },
        photo: {
            type: String,
            //required: [true, 'Photo is required'],
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
    });

//hook
postSchema.pre(/^find/, function (next) {
    //add views count as virtual property
    postSchema.virtual('viewsCount').get(function () {
        const post = this;
        return post.numViews.length;
    })
    //add likes count as virtual property
    postSchema.virtual('likesCount').get(function () {
        const post = this;
        return post.Likes.length;
    })
    //add dislikes count as virtual property
    postSchema.virtual('dislikesCount').get(function () {
        const post = this;
        return post.disLikes.length;
    })

    //check the mose liked post in percentege
    postSchema.virtual('likesPercentage').get(function () {
        const post = this;
        const total = +post.Likes.length + +post.disLikes.length;
        const likesPercentage = (+post.Likes.length / total) * 100;
        return `${likesPercentage}%`
    })

    postSchema.virtual('dislikesPercentage').get(function () {
        const post = this;
        const total = +post.Likes.length + +post.disLikes.length;
        const dislikes = (+post.disLikes.length / total) * 100;
        return `${dislikes}%`
    })

    postSchema.virtual('DaysAgo').get(function () {
        const post = this;
        const date = new Date(post.createdAt);
        const daysAgo = Math.floor((Date.now() - date) / 86400000);
        return daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
    })
    next();
});


// Compile the schema into a model and export it
const Post = mongoose.model('Post', postSchema);

module.exports = Post;