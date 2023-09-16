const user = require("../models/user");
const userschema=require("../models/user")
const ErrorHandler=require('../utils/errorHandler')



// specially admin  routes 

const cathAsyncError = require("../utils/catchAsyncError");



exports.getAllusers=cathAsyncError(
    async(req,res,next)=>
    {
      const response=await userschema.find({accountType:"user", isBlocked:false});

      res.status(200)
      .json(
        {
            success:true, 
            message:"all users are retrieved", 
            data:response
        }
      )
    }
)


exports.getSpecificuser=cathAsyncError(
    async(req,res,next)=>
    {
        const userId=req.params.id;

        if(!userId)
        {
            return next(new ErrorHandler("please provide an user Id", 404))
        }

        const response=await userschema.findById({_id:userId});

        res.status(200)
        .json(
            {
                success:true, 
                message:"specific user is retrieved", 
                data:response
            }
        )
        
    }
)


exports.blockUser=cathAsyncError(
    async(req,res,next)=>
    {
        // block user and insert it in the admin array
        const userId=req.params.id;
        const adminId=req.decode.id;

        if(!userId || !adminId)
        {
            return next(new ErrorHandler("please provide user Id", 404))
        }

        const response=await userschema.findByIdAndUpdate({_id:userId},{isBlocked:true},{new:true});

        const response1=await userschema.findByIdAndUpdate({_id:adminId}, {$push:{blocked:userId}}, {new:true}).populate("blocked");

        res.status(200)
        .json({
            success:true,
            message:"user is blocked", 
            data:response1
        })
        
    }
)