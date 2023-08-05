const express = require('express');
const isLogin = require('../../middlewares/isLogin');
const storage = require('../../config/cloudinary');
const multer = require('multer');

//instance of multer
const upload = multer({ storage });

const {
    userRegisterCtrl,
    userLoginCtrl,
    whoViewedMyProfileCtrl,
    followingCtrls,
    usersCtrls,
    deleteUserCtrl,
    updateUserCtrl,
    userProfileCtrl,
    profilePhotoUpload } = require('../../controllers/users/userCtrl');

const userRouter = express.Router();

//POST /api/v1/users/register
userRouter.post('/register', userRegisterCtrl);

//POST /api/v1/users/login
userRouter.post('/login', userLoginCtrl);

//GET /api/v1/users/profile-viewers/:id
userRouter.get('/profile-viewers/:id', isLogin, whoViewedMyProfileCtrl);

//Following user 
userRouter.get('/following/:id',isLogin, followingCtrls);

//GET /api/v1/users/profile/:id
userRouter.get('/profile/', isLogin, userProfileCtrl);

//GET /api/v1/users
userRouter.get('/', usersCtrls);

//DELETE /api/v1/users/:id
userRouter.delete('/:id', deleteUserCtrl);

//PUT /api/v1/users/:id
userRouter.put('/:id', updateUserCtrl);

//POST /api/v1/users/profile-photo-upload
userRouter.post('/profile-photo-upload', isLogin, upload.single("profile"), profilePhotoUpload);

module.exports = userRouter;