const User = require('../../model/User/User')
const bcrypt = require('bcryptjs')
const generateToken = require('../../utils/generateToken')
const getTokenFromHeader = require('../../utils/getTokenFromHeader')
const {appErr , AppErr}= require('../../utils/appErr')

const userRegisterCtrl = async (req, res,next) => {
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

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    userProfileCtrl,
    usersCtrls,
    deleteUserCtrl,
    updateUserCtrl
}