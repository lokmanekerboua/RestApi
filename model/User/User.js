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
    viewers: [{
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
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },],
    blocked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    plan:
        [
            {
                type: String,
                enum: ['Free', 'Premium', 'Pro'],
                default: 'Free',
            },
        ],


    userAward:
        [
            {
                type: String,
                enum: ['Bronze', 'Silver', 'Gold'],
                default: 'Bronze',
            }
        ],

},
    {
        timestamps: true,
        toJSON: { virtuals: true },
    });

//get full name
userSchema.virtual('fullname').get(function () {
    return `${this.firstname} ${this.lastname}`;
});

//get user initials
userSchema.virtual('initials').get(function () {
    return `${this.firstname[0].toUpperCase}${this.lastname[0].toLocaleUpperCase}`;
});

//user posts count
userSchema.virtual('postsCount').get(function () {
    return this.posts.length;
});

//get user followers count
userSchema.virtual('followersCount').get(function () {
    return this.followers.length;
});

//get user following count
userSchema.virtual('followingCount').get(function () {
    return this.following.length;
});

//get user viewers count
userSchema.virtual('viewersCount').get(function () {
    return this.viewers.length;
});

//get user blocked count
userSchema.virtual('blockedCount').get(function () {
    return this.blocked.length;
});

//compile the user model
const User = mongoose.model('User', userSchema);

module.exports = User;