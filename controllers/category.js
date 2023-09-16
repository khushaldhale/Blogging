const { response } = require("express");
const categoryschema=require("../models/category");
const userschema=require("../models/user");
const cathAsyncError = require("../utils/catchAsyncError");
const ErrorHandler=require("../utils/errorHandler")



exports.createCategory=cathAsyncError(
    async(req,res,next)=>
    {
        const adminId=req.decode._id;
        const {categoryName, decsription}=req.body;

        if(!adminId || !categoryName || !decsription)
        {
            return next(new ErrorHandler("please provide all details ", 404))
        }

        const response1=await categoryschema.create({adminId, categoryName, decsription});

        const response2=await userschema.findByIdAndUpdate({_id:adminId}, {$push:{categories:response1._id}}, {new:true}).populate("categories");
        

        res.status(200)
        .json(
            {
                success:true, 
                message:"category is created",
                data:response2
            }
        )
    }
)


exports.updateCategory=cathAsyncError(
    async(req,res,next)=>
    {
        const {categoryName, decsription}=req.body;
        const categoryId=req.params.id

        if(!categoryId || !categoryName || !decsription)
        {
            return next(new ErrorHandler("please provide all details ", 404))
        }

        const response=await categoryschema.findByIdAndUpdate({_id:categoryId}, {categoryName, decsription}, {new:true}).populate("categories");

        res.status(200)
        .json(
            {
                success:true,
                message:"category is updated succesfully", 
                data:response
            }
        )

        
    }
)



exports.deleteCategory=cathAsyncError(
    async(req,res,next)=>
    {
        const adminId=req.decode._id;
        const categoryId=req.params.id;

        if(!adminId || !categoryId)
        {
            return next(new ErrorHandler("please provide all details ", 404))

        }

        const response1=await categoryschema.findByIdAndDelete({_id:categoryId});

        const response2=await userschema.findByIdAndUpdate({_id:adminId}, {$pull:{categories:categoryId}}, {new:true}).populate("categories");


        res.status(200)
        .json(
            {
                success:true, 
                message:"category is deleted succesfully",
                data:response2
            }
        )
        
    }
)



exports.getAllCategory=cathAsyncError(
    async(req,res,next)=>
    {
        const response=await categoryschema.find({});

        res.status(200)
        .json(
            {
                success:true, 
                message:"all categories are retrievd", 
                data:response
            }
        )
    }
)



exports.getSpecificCategory=cathAsyncError(
    async(req,res,next)=>
    {
        const categoryId=req.params.id;

        if(!categoryId)
        {
            return next(new ErrorHandler("please provide category Id ", 404))

        }

        const response=await categoryschema.findById({_id:categoryId});

        res.status(200)
        .json(
            {
                success:true, 
                message:"specific category is retrieved", 
                data:response
            }
        )

    }
)




