const mongoose = require('mongoose');

//create the schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    profilePhoto: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    postCount: {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Editor'],
    },
    viewedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    active: {
        type: Boolean,
        default: true,
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
},
{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;