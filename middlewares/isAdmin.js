const { appErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");
const User = require("../model/User/User");


const isAdmin = async (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req);

    //verify token
    const decodedUser = verifyToken(token);

    //save the user to req object
    req.userAuth = decodedUser.id;

    //find the user in db 
    const user = await User.findById(req.userAuth);

    //check if admin
    if (!user.isAdmin) {
        return next(appErr('You are not the ADMIN to perform this action', 403));
    }

    if (!decodedUser) {
        return next(appErr('Invalid/expired token please login again', 500));
    } else {
        next();
    }

}

module.exports = isAdmin;