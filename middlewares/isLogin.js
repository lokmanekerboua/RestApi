const { appErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");


const isLogin = async (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req);

    //verify token
    const decodedUser = verifyToken(token);

    //save the user to req object
    req.userAuth = decodedUser.id;

    if (!decodedUser) {
        return next(appErr('Invalid/expired token please login again', 500));
    } else {
        next();
    }

}

module.exports = isLogin;