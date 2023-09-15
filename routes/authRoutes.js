const express=require('express');
const { sendOtp, register, login, forgetPassword, resetPassword, logout, changepassword, editProfile } = require('../controllers/auth');
const { authentication } = require('../middlewares/auth');
const router=express.Router();

// this does not require authentication and authorization
router.post("/send-otp", sendOtp);
router.post("/register", register);
router.get("/login", login);
router.get("/forgot-password", forgetPassword);
router.put("/reset-password", resetPassword);

// only authentication it needs 
router.get("/logout",authentication, logout);
router.put("/change-password",authentication, changepassword);
router.put("/edit-profile", authentication, editProfile)



module.exports=router;