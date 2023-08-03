const express = require('express');

const {
    userRegisterCtrl,
    userLoginCtrl,
    usersProfileCtrl,
    usersCtrls,
    deleteUserCtrl,
    updateUserCtrl,
    userProfileCtrl } = require('../../controllers/users/userCtrl');

const userRouter = express.Router();

//POST /api/v1/users/register
userRouter.post('/register', userRegisterCtrl);

//POST /api/v1/users/login
userRouter.post('/login', userLoginCtrl);

//GET /api/v1/users/profile/:id
userRouter.get('/profile/:id', userProfileCtrl);

//GET /api/v1/users
userRouter.get('/', usersCtrls);

//DELETE /api/v1/users/:id
userRouter.delete('/:id', deleteUserCtrl);
//PUT /api/v1/users/:id
userRouter.put('/:id', updateUserCtrl);

module.exports = userRouter;