const jwt = require('jsonwebtoken')
const { model } = require('mongoose')

const verifyToken = Token => {
    return jwt.verify(Token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return false;
        } else {
            return decoded;
        }
    })
}


module.exports = verifyToken