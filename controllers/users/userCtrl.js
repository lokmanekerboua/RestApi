const User = require('../../model/User/User')
const bcrypt = require('bcryptjs')
const generateToken = require('../../utils/generateToken')
const getTokenFromHeader = require('../../utils/getTokenFromHeader')
const { appErr, AppErr } = require('../../utils/appErr')

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

// profile viewers 
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
            const isUserAlreadyFollowed = userToFollow.following.find(
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

const usersCtrls = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'users route'
        })
    } catch (error) {
        res.json(error.message)
    }
}

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
    followingCtrls
}