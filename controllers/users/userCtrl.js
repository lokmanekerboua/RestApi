const User = require('../../model/User/User')
const bcrypt = require('bcryptjs')
const generateToken = require('../../utils/generateToken')
const getTokenFromHeader = require('../../utils/getTokenFromHeader')
const { appErr, AppErr } = require('../../utils/appErr')

//POST /api/v1/users/register
const userRegisterCtrl = async (req, res, next) => {
    const { firstname, lastname, email, password } = req.body
    try {

        //check if email exist 
        const userFound = await User.findOne({ email });

        if (userFound) {
            return next(new AppErr('User already exist', 500));
        }

        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        //create the user
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        res.json({
            status: 'success',
            data: user,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

//POST /api/v1/users/login
const userLoginCtrl = async (req, res) => {
    const { email, password } = req.body
    try {
        //check if email exist
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.json({
                status: 'fail',
                message: 'Invalid login creadentials'
            })
        }

        const ispasswordMatch = await bcrypt.compare(password, userFound.password);

        if (!ispasswordMatch) {
            return res.json({
                status: 'fail',
                message: 'Invalid login creadentials'
            })
        }

        res.json({
            status: 'success',
            data: {
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id)
            },
        })
    } catch (error) {
        res.json({
            status: 'fail',
            message: error.message
        })
    }
}

//GET profile viewers 
const whoViewedMyProfileCtrl = async (req, res, next) => {
    try {
        //1. find the original user 
        const user = await User.findById(req.params.id);

        //2. find the user who viewed the original user 
        const userWhoviewed = await User.findById(req.userAuth);

        //3. check if original user andeho viewed user are found 
        if (user && userWhoviewed) {
            //4. check if userwhoviewed is already in the original user viewers array
            const isuserAlreadyViewed = user.viewers.find(
                viewer => viewer.toString() === userWhoviewed._id.toJSON()
            );

            if (isuserAlreadyViewed) {
                return next(new AppErr("You have already viewed this profile"));
            }
            else {
                //5. Push the userwhoviewed to the original user viewers array
                user.viewers.push(userWhoviewed._id);
                //6. save the original user
                await user.save();

                res.json(
                    {
                        status: 'success',
                        data: "you have successfully viewed this profile"
                    }
                );
            }
        }
    } catch (error) {
        res.json(error.message)
    }
}


//Following cntrl
const followingCtrls = async (req, res, next) => {
    try {
        //1. find the user to follow
        const userToFollow = await User.findById(req.params.id);

        //2. find the user who is try to follow 
        const userWhoFollow = await User.findById(req.userAuth);

        //3. check if user and userwhofollow are found 
        if (userToFollow && userWhoFollow) {
            //4. check if userWhoFollowed is already in the user's followers array 
            const isUserAlreadyFollowed = userToFollow.followers.find(
                follower => follower.toString() === userWhoFollow._id.toString()
            );

            if (isUserAlreadyFollowed) {
                return next(appErr('you already follow this user'))
            } else {
                //5. Push userWhoFollowed into the user's followers array 
                userToFollow.followers.push(userWhoFollow._id);

                //Push userWhoFollowed into the userWhoFollowed's following array 
                userWhoFollow.following.push(userToFollow._id);

                //save
                await userWhoFollow.save();
                await userToFollow.save();

                res.json({
                    status: 'success',
                    data: 'you have successfully followed this user'
                })
            }
        }


    } catch (error) {
        res.json(error.message)
    }
}


//Unfollowing cntrl
const unfollowingCtrls = async (req, res, next) => {
    try {
        //1. find the user to be unfollow
        const userTobeUnfollow = await User.findById(req.params.id);

        //2. find the user who is try to unfollowing 
        const userWhoUnfollow = await User.findById(req.userAuth);

        //3. check if user and userwhofollow are found 
        if (userTobeUnfollow && userWhoUnfollow) {
            //4. check if userWhoUnfollow is already not follow the user 
            const isUserAlreadyFollowed = userTobeUnfollow.followers.find(
                follower => follower.toString() === userWhoUnfollow._id.toString()
            );

            if (!isUserAlreadyFollowed) {
                return next(appErr('you have not followed this user'))
            } else {
                //5. remove userWhounFollowed from the user's followers array 
                userTobeUnfollow.followers = userTobeUnfollow.followers.filter(
                    follower => follower.toString() !== userWhoUnfollow._id.toString()
                )

                //Push userWhoFollowed into the userWhoFollowed's following array 
                userWhoUnfollow.following = userWhoUnfollow.following.filter(
                    follower => follower.toString() !== userTobeUnfollow._id.toString()
                )

                //save
                await userTobeUnfollow.save();
                await userWhoUnfollow.save();

                res.json({
                    status: 'success',
                    data: 'you have successfully unfollowed this user'
                })
            }
        }


    } catch (error) {
        res.json(error.message)
    }
}

//Block user controller 
const blockUserCtrl = async (req, res, next) => {
    try {
        //1. find the user to be Blocked
        const userTobeBlocked = await User.findById(req.params.id);

        //2. find the user who is try to Block 
        const userWhoBlocking = await User.findById(req.userAuth);

        //3. check if user to be blocked and userwhoBlock are found 
        if (userTobeBlocked && userWhoBlocking) {
            //4. check if userWhoBlocking was already blocked this user 
            const isUserAlreadyBlocked = userWhoBlocking.blocked.find(
                userblock => userblock.toString() === userTobeBlocked._id.toString()
            );

            if (isUserAlreadyBlocked) {
                return next(appErr('you have already blocked this user'))
            } else {
                //5. Push userWhoBlocking into the user's blocked array
                userWhoBlocking.blocked.push(userTobeBlocked._id);

                //6. save
                await userWhoBlocking.save();

                res.json({
                    status: 'success',
                    data: 'you have successfully blocked this user'
                })
            }
        }


    } catch (error) {
        res.json(error.message)
    }
}

//unblock user 
const unblockUserCtrl = async (req, res, next) => {
    try {

        //1. find the user to be unBlocked
        const userTobeunBlocked = await User.findById(req.params.id);

        //2. find the user who is try to unBlock 
        const userWhounBlocking = await User.findById(req.userAuth);

        if (userTobeunBlocked && userWhounBlocking) {
            //4. check if userTobeunBlocked was already unblocked 
            const isUserAlreadyunBlocked = userWhounBlocking.blocked.find(
                userunblock => userunblock.toString() === userTobeunBlocked._id.toString()
            );

            if (!isUserAlreadyunBlocked) {
                return next(appErr('you have not blocked this user'))
            } else {
                //5. remove usertobeunBlocked from the userWhounBlocking blocked array
                userWhounBlocking.blocked = userWhounBlocking.blocked.filter(
                    blocked => blocked.toString() !== userTobeunBlocked._id.toString()
                )

                //6. save
                await userWhounBlocking.save();

                res.json({
                    status: 'success',
                    data: 'you have successfully unblocked this user'
                })
            }
        }
    } catch (error) {
        res.json(error.message)
    }
}

//ADMIN BLOCK USER 
const adminBlockUserCtrl = async (req, res, next) => {
    try {
        //1. find the user to be Blocked
        const userTobeBlocked = await User.findById(req.params.id);

        //check if user found 
        if (!userTobeBlocked) {
            return next(appErr('user not found'))
        }

        //change the user status to blocked = true 
        userTobeBlocked.isBlocked = true;

        //save 
        await userTobeBlocked.save();

        res.json({
            status: 'success',
            data: 'Admin successfully blocked user'
        })
    } catch (error) {
        res.json(error.message)
    }
}

//ADMIN UNBLOCK USER
const adminUnblockUserCtrl = async (req, res, next) => {
    try {
        //1. find the user to be UNBlocked
        const userTobeUnblocked = await User.findById(req.params.id);

        //check if user found 
        if (!userTobeUnblocked) {
            return next(appErr('user not found'))
        }

        //change the user status to blocked = true 
        userTobeUnblocked.isBlocked = false;

        //save 
        await userTobeUnblocked.save();

        res.json({
            status: 'success',
            data: 'Admin successfully unblocked user'
        })
    } catch (error) {
        res.json(error.message)
    }
}

//GET user profile
const userProfileCtrl = async (req, res) => {
    //console.log(req.userAuth)
    //const { id } = req.params
    try {
        //const token = getTokenFromHeader(req);
        //console.log(token);
        const user = await User.findById(req.userAuth);
        res.json({
            status: 'success',
            data: user
        })
    } catch (error) {
        res.json(error.message)
    }
}

//GET all users
const usersCtrls = async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            status: 'success',
            data: users
        })
    } catch (error) {
        res.json(error.message)
    }
}

//DELETE user
const deleteUserCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete user route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

//UPDATE user
const updateUserCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'update user route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

//UPDATE user profile photo
const profilePhotoUpload = async (req, res, next) => {
    try {
        //find user to be updated
        const userToUpdate = await User.findById(req.userAuth);

        //check if user is found 
        if (!userToUpdate) {
            return next(new AppErr('User not found', 404));
        }
        //check if user is blocked 
        if (userToUpdate.isBlocked) {
            return next(new AppErr('Action not allowed, your account is blocked', 403));
        }
        //check if user is updating their photo
        if (req.file) {
            //update profile photo
            await User.findByIdAndUpdate(req.userAuth, {
                $set: {
                    profilePhoto: req.file.path
                }
            }, {
                new: true,
            });
            res.json(
                {
                    status: "success",
                    data: "profile photo updated"
                }
            );
        }
        res.json({
            status: 'success',
            data: 'profile photo upload route'
        })
    } catch (error) {
        next(appErr(error.message, 500));
    }
}

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    userProfileCtrl,
    usersCtrls,
    deleteUserCtrl,
    updateUserCtrl,
    profilePhotoUpload,
    whoViewedMyProfileCtrl,
    followingCtrls,
    unfollowingCtrls,
    blockUserCtrl,
    unblockUserCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl
}