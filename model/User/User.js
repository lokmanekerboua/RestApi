const mongoose = require('mongoose');
const Post = require('../Post/Post');

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
            [{
                type: String,
                enum: ['Free', 'Premium', 'Pro'],
                default: 'Free',
            }],


        userAward:
            {
                type: String,
                enum: ['Bronze', 'Silver', 'Gold'],
                default: 'Bronze',
            },

    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
    });

//Hooks
//pre-before record is saved  //find findOne
userSchema.pre("findOne", async function (next) {
    //poppulate the posts
    this.populate('posts');


    const userId = this._conditions._id;
    //find the post created by the user
    const posts = await Post.find({user: userId});
    //get the last post
    const lastpost = posts[posts.length - 1];
    //get the last post date
    const lastpostdate = new Date(lastpost?.createdAt);
    //get the last post date string
    const lastpostdatestr = lastpostdate.toDateString();
    //add the vertuals last post date string to the user object
    userSchema.virtual('lastPostDate').get(function () {
        return lastpostdatestr;
    });

    //check if user is inactive for 30 days
    //get the current date
    const currentdate = new Date();
    //get the difference between the last post date and the current date
    const diff = currentdate - lastpostdate;
    //get the number of days
    const diffIndays = diff / (1000 * 60 * 60 * 24);

    if (diffIndays > 30) {
        userSchema.virtual("isInactive").get(function () {
            return true;
        });
        //find user by id and update the isBlocked field to true
        await User.findByIdAndUpdate(
            userId,
            {isBlocked: true},
            {
                new: true,
            }
        );

    } else {
        userSchema.virtual("isInactive").get(function () {
            return false;
        });
        //find user by id and update the isBlocked field to false
        await User.findByIdAndUpdate(
            userId,
            {isBlocked: false},
            {
                new: true,
            }
        );
    }

    //last Active Date
    const dayAgo = Math.floor(diffIndays);
    //add the vertuals last post date string to the user object
    userSchema.virtual('lastActive').get(function () {
        if (dayAgo < 1) {
            return 'Today';
        } else if (dayAgo === 1) {
            return `Yesterday`;
        } else {
            return `${dayAgo} days ago`;
        }
    });

    //Update the user award based on the number of posts
    //get the number of posts
    const numberOfPosts = posts.length;
    //check if the number of posts is greater than 10
    if (numberOfPosts < 10) {
        await User.findByIdAndUpdate(
            userId,
            {
                userAward: 'Bronze'
            },
            {
                new: true
            });
    } else if (numberOfPosts >= 10 && numberOfPosts < 20) {
        await User.findByIdAndUpdate(
            userId,
            {
                userAward: 'Silver'
            },
            {
                new: true
            });
    } else if (numberOfPosts >= 20) {
        await User.findByIdAndUpdate(
            userId,
            {
                userAward: 'Gold'
            },
            {
                new: true
            });
    }

    next();
});

//post-after record is saved
// userSchema.post("save", function (next) { 
//     next();
// });

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