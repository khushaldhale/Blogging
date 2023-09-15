const userschema=require("../models/user");
const cathAsyncError = require("../utils/catchAsyncError");
const otp_generator=require("otp-generator")
const ErrorHandler=require("../utils/errorHandler")
const otpschema=require('../models/otp')
const sendEmail=require("../utils/email")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()



exports.sendOtp=cathAsyncError(
    async(req,res,next)=>
    {
     
        const email=req.body.email;

        if(!email)
        {
            return next(new ErrorHandler("please provide an email", 404))
        }

        const otp=otp_generator.generate(6, {
            specialChars:false, 
            lowerCaseAlphabets:false, 
            upperCaseAlphabets:false
        })
        // otp saved to Db for validation 
        const response1=await otpschema.create({email , otp});

        await sendEmail(email, "OTP", `otp is ${otp}`);



        res.status(200)
        .json(
            {
                success:true,
                message:"otp is sent over the email, please check it ",
                data:otp
            }
        )




    }
)


exports.register=cathAsyncError(
    async(req,res,next)=>
    {
        const {email, firstName, lastName, contactNo, password, retypePassword, accountType, otp}=req.body;

        
        const is_validotp=await otpschema.find({otp}).sort({createdAt:"-1"});

        if(is_validotp[0].otp!==otp)
        {
            return next(new ErrorHandler("otp is invalid", 404))

        }
        
        
        const is_existing=await userschema.findOne({email});

        if(is_existing)
        {
            return next(new ErrorHandler("you are already registered , login", 404))

        }

        if(password!==retypePassword)
        {
            return next(new ErrorHandler("password does not match", 404))

        }

        // now  hash the password 
        const hashedPassword=await bcrypt.hash(password, 10);


        const response=await userschema.create({email, firstName, lastName, contactNo, password, accountType});


        res.status(200)
        .json(
            {
                success:true, 
                message:"user is registered succesfully", 
                data:response
            }
        )
    }
)


exports.login=cathAsyncError(
    async(req,res,next)=>
    {
        const{ email, password}=req.body;

        if(!email || !password)
        {
            return next(new ErrorHandler("please provide credentials", 404))

        }

          
        const is_existing=await userschema.findOne({email});

        if(!is_existing)
        {
            return next(new ErrorHandler("please register urself first", 404))

        }

        if(is_existing.isblocked===true)
        {
            return next(new ErrorHandler("you are blocked user, you cannt register", 404))

        }

        if(await bcrypt.compare(password, is_existing.password))
        {
            const token=jwt.sign(
                {
                    email, 
                    _id:is_existing._id,
                    accountType:is_existing.accountType
                }, 
                process.env.JWT_SECRET, 
                {
                    expiresIn:"6h"
                }
            )


            res.cookie("token", token, {
                httpOnly:true, 
                expires:new Date(Date.now() + 6*60*60*1000)
            })
            .status(200)
            .json(
                {
                    success:true,
                    message:"user is logged in"
                }
            )
        }

    }
)


exports.logout=cathAsyncError(
    async(req,res,next)=>
    {

        res.cookie("token", null, {
            httpOnly:true,
            expires:new Date(Date.now())
        })
        .status(200)
        .json({
            success:true,
            message:"user is logged out"
        })
        
    }
)



exports.changepassword=cathAsyncError(
    async(req,res,next)=>
    {
        const _id=req.decode._id;
        const {password, retypePassword}=req.body

        if(!password || !retypePassword)
        {
            return next(new ErrorHandler("please provide an password", 404))
            
        }

        if(!_id)
        {
            return next(new ErrorHandler("please provide an Id", 404))

        }
        if(password!==retypePassword)
        {
            return next(new ErrorHandler("password does not match", 404))

        }

        // now  hash the password 
        const hashedPassword=await bcrypt.hash(password, 10);

        const response=await userschema.findByIdAndUpdate({_id}, {password:hashedPassword}, {new:true});

        res.status(200)
        .json(
            {
                success:true, 
                message:"password is changed succesfully"
            }
        )
        



        
    }
)


exports.editProfile=cathAsyncError(
    async(req,res,next)=>
    {
        const _id=req.decode._id;
        const { firstName, lastName, contactNo}=req.body;


        if(!_id)
        {
            return next(new ErrorHandler("please provide an Id", 404))

        }
        if(!firstName || !lastName || !contactNo)
        {
            return next(new ErrorHandler("please provide all details", 404))
            
        }


        const response=await userschema.findByIdAndUpdate({_id}, {firstName, lastName, contactNo}, {new:true});

        res.status(200)
        .json(
            {
                success:true, 
                message:"profile edited succesfully"
            }
        )

        


        
    }
)

exports.forgetPassword=cathAsyncError(
    async(req,res,next)=>
    {
        // first u have to fetch email , chekc whether registered or not 
        //create unique url and send it over email 
        //set token and expiry of token as well 
        //send response 

        const email=req.body.email;

        if(!email)
        {
            return next(new ErrorHandler("please provide an email", 404))

        }
        const is_existing=await userschema.findOne({email});

        if(!is_existing)
        {
            return next(new ErrorHandler("please register yourself first", 404))

        }

        const token=crypto.randomUUID();

        is_existing.token=token;
        is_existing.resetPasswordExpiry=new Date(Date.now() + 5*60*1000)
        await is_existing.save();

        //temporary frontend URL
        const URL=`http://localhost:4000/reset-password/${token}`;

        await sendEmail(email,"Reset link", `password reset link is ${URL}`);

        res.status(200)
        .json(
            {
                success:true, 
                message:"password reset link is shared"
            }
        )
        
    }
)

exports.resetPassword=cathAsyncError(
    async(req,res,next)=>
    {
        // fetch token , validate it for user , check expiry , compare password , hash it and then update

        const token=req.params.token;
        const {password,resetPassword}=req.body;

        if(!token)
        {
            return next(new ErrorHandler("please provide a token", 404))
            
        }

        const is_existing=await userschema.findOne({token});

        if(!is_existing)
        {
            return next(new ErrorHandler("token is invalid", 404))
        }

        if(is_existing.resetPasswordExpiry < Date.now())
        {
            return next(new ErrorHandler("Time to reset password is expired", 404))

        }

        
        if(!password || !retypePassword)
        {
            return next(new ErrorHandler("please provide an password", 404))
            
        }
        if(password!==retypePassword)
        {
            return next(new ErrorHandler("password does not match", 404))

        }

        const hashedPassword=await bcrypt.hash(password, 10);

        is_existing.password=hashedPassword;
        await is_existing.save()

        res.status(200)
        .json(
            {
                success:true, 
                message:"password reseted succesfully"
            }
        )
    }
)