const express = require('express');
const isLogin = require('../../middlewares/isLogin');
const storage = require('../../config/cloudinary');
const multer = require('multer');
const isAdmin = require('../../middlewares/isAdmin');

//instance of multer
const upload = multer({storage});

const {
    userRegisterCtrl,
    userLoginCtrl,
    whoViewedMyProfileCtrl,
    followingCtrls,
    unfollowingCtrls,
    blockUserCtrl,
    unblockUserCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl,
    usersCtrls,
    updateUserCtrl,
    updatePassword,
    userProfileCtrl,
    profilePhotoUpload,
    deleteUserAccount
} = require('../../controllers/users/userCtrl');

const userRouter = express.Router();

//POST /api/v1/users/register
userRouter.post('/register', userRegisterCtrl);

//POST /api/v1/users/login
userRouter.post('/login', userLoginCtrl);

//GET /api/v1/users/profile-viewers/:id
userRouter.get('/profile-viewers/:id', isLogin, whoViewedMyProfileCtrl);

//Following user : /api/v1/users/following/:id
userRouter.get('/following/:id', isLogin, followingCtrls);

//Unfollowing user : /api/v1/users/unfollowing/:id
userRouter.get('/unfollowing/:id', isLogin, unfollowingCtrls);

//Block user : /api/v1/users/block/:id
userRouter.get('/block/:id', isLogin, blockUserCtrl);

//unBlock user : /api/v1/users/block/:id
userRouter.get('/unblock/:id', isLogin, unblockUserCtrl);

//Admin Block user : /api/v1/users/adminblock/:id
userRouter.put('/adminblock/:id', isLogin, isAdmin, adminBlockUserCtrl);

//Admin unBlock user : /api/v1/users/adminunblock/:id
userRouter.put('/adminunblock/:id', isLogin, isAdmin, adminUnblockUserCtrl);

//GET /api/v1/users/profile/:id
userRouter.get('/profile/', isLogin, userProfileCtrl);

//GET /api/v1/users
userRouter.get('/', usersCtrls);

//PUT /api/v1/users/:id
userRouter.put('/', isLogin, updateUserCtrl);

//UPDATE PASSWORD /api/v1/users/update-password
userRouter.put("/update-password", isLogin, updatePassword);

//DELETE USER ACCOUNT /api/v1/users/delete-account
userRouter.delete("/delete/account", isLogin, deleteUserAccount);

//POST /api/v1/users/profile-photo-upload/
userRouter.post('/profile-photo-upload', isLogin, upload.single("profile"), profilePhotoUpload);

module.exports = userRouter;