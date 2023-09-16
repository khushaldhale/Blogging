const blogschema=require("../models/blog");
const userschema=require("../models/user");
const categoryschema=require("../models/category");
const cathAsyncError = require("../utils/catchAsyncError");
const ErrorHandler=require("../utils/errorHandler")
const fileUpload=require("../utils/cloudinary")

exports.createBlog=cathAsyncError(
    async(req,res,next)=>
    {

        const {title,content, categoryId}=req.body;
        const userId=req.decode._id;
        const file=req.files.file;

        if(!title || !content || !categoryId || !userId || !file)
        {
            return next(new ErrorHandler("please provide all details", 404))
        }


        // first i have to upload image
       const imageUrl= await fileUpload(file, "Blogging");

       const response1=await blogschema.create({title, content, categoryId, userId, imageUrl});

       const response2=await userschema.findByIdAndUpdate({_id:userId}, {$push:{blogs:response1._id}}, {new:true}).populate("blogs");

       const response3=await categoryschema.findByIdAndUpdate({_id:categoryId},{$push:{blogs:response1._id}}, {new:true});


       res.status(200)
       .json(
        {
            success:true, 
            message:'blog is created succesfully', 
            data:response2
        }
       )


    }
)


exports.updateBlog=cathAsyncError(
    async(req,res,next)=>
    {
        const blogId=req.params.id;
        const {title,content, categoryId}=req.body;
        const file=req.files.file;

        if(!title || !content || !categoryId || !file)
        {
            return next(new ErrorHandler("please provide all details", 404))
        }

        const imageUrl=await fileUpload(file, "Blogging");

        const response=await blogschema.findByIdAndUpdate({_id:blogId},{title, content,categoryId, imageUrl},{new:true});


        res.status(200)
        .json(
            {
                success:true,
                message:"blog is updated succesfully", 
                data:response
            }
        )


        
    }
)



exports.deleteBlog=cathAsyncError(
    async(req,res,next)=>
    {
        const blogId=req.params._id;
        
        if(!blogId)
        {
            return next(new ErrorHandler("please provide blog Id ", 404))
        }

        const response1=await blogschema.findByIdAndDelete({_id:blogId});

        const response2=await userschema.findByIdAndUpdate({_id:response1.userId}, {$pull:{blogs:blogId}}).populate("blogs");

        const response3=await categoryschema.findByIdAndUpdate({_id:response1.categoryId}, {$pull:{blogs:blogId}});


        res.status(200)
        .json(
            {
                success:true, 
                message:"blog is deleted succesfully",
                data:response2
            }
        )
        
    }
)

exports.getallBlogs=cathAsyncError(
    async(req,res,next)=>
    {

        const response=await blogschema.find({});

        res.status(200)
        .json(
            {
                success:true, 
                message:"all blogs are retrievd succesfully",
                data:response
            }
        )
        
    }
)


exports.getSpecificBlog=cathAsyncError(
    async(req,res,next)=>
    {
        const blogId=req.params.id;
          
        if(!blogId)
        {
            return next(new ErrorHandler("please provide blog Id ", 404))
        }

        const response=await blogschema.findById({_id:blogId});
        res.status(200)
        .json(
            {
                success:true,
                message:"specific blog is retrived", 
                data:response
            }
        )

    }
)


exports.getUserBlogs=cathAsyncError(
    async(req,res,next)=>
    {
        const userId=req.decode._id;
          
        if(!userId)
        {
            return next(new ErrorHandler("please provide blog Id ", 404))
        }

        const response=await blogschema.find({userId});

        res.status(200)
        .json(
            {
                success:true, 
                message:"blogs for particular users are rtetrived succesfully", 
                data:response
            }
        )

    }
)