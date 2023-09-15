const cathAsyncError = require("../utils/catchAsyncError");
const ErrorHandler=require("../utils/errorHandler")
const jwt=require("jsonwebtoken")
require("dotenv").config()


exports.authentication=cathAsyncError(
    async(req,res,next)=>
    {
        const token=req.cookies.token;
        if(!token)
        {
            return next(new ErrorHandler("please login first",404))
        }
        const decode=jwt.verify(token, process.env.JWT_SECRET);

        if(!decode)
        {
            return next(new ErrorHandler("invalid token",404))

        }

        req.decode=decode;
        next()
    }
)


exports.isUser=cathAsyncError(
    async(req,res,next)=>
    {
        if(req.decode.accountType!=="user")
        {
            return next(new ErrorHandler("This is the protected route and it is for user only",404))

        }
        next()
    }
)



exports.isAdmin=cathAsyncError(
    async(req,res,next)=>
    {
        if(req.decode.accountType!=="admin")
        {
            return next(new ErrorHandler("This is the protected route and it is for admin only",404))

        }
        next()
    }
)