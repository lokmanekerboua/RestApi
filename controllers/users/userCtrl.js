const User = require('../../model/User/User')
const bcrypt = require('bcryptjs')

const userRegisterCtrl = async (req, res) => {
    const { firstname, lastname, email, password } = req.body
    try {

        //check if email exist 
        const userFound = await User.findOne({ email });

        if (userFound) {
            return res.json({
                status: 'fail',
                message: 'User already exist'
            })
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
        res.json(error.message)
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
            data: userFound,
        })
    } catch (error) {
        res.json({
            status: 'fail',
            message: error.message
        })
    }
}

const userProfileCtrl = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id);
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