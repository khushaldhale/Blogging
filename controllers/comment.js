const commentschema=require("../models/comment");
const blogschema=require("../models/blog");
const cathAsyncError = require("../utils/catchAsyncError");
const ErrorHandler=require("../utils/errorHandler")



exports.createComment=cathAsyncError(
    async(req,res,next)=>
    {
        const userId=req.decode._id;
        const {comment, blogId}=req.body;

        if(!userId || !comment || !blogId)
        {
            return next(new ErrorHandler("please provide all details ", 404))
        }
        const response1=await commentschema.create({userId, comment, blogId});

        const response2=await blogschema.findByIdAndUpdate({_id:blogId}, {$push:{comments:response1._id}}, {new:true}).populate("comments");

        res.status(200)
        .json(
            {
                success:true, 
                message:"comment is created"
            }
        )
    }
)



exports.deleteComment=cathAsyncError(
    async(req,res,next)=>
    {
        const commentId=req.params.id;

        if(!commentId)
        {
            return next(new ErrorHandler("please provide an Id", 404))
        }

        const response1=await commentschema.findByIdAndDelete({_id:commentId});

        const response2=await blogschema.findByIdAndUpdate({_id:response1.blogId}, {$pull:{comments:commentId}}, {new:true}).populate("comments")

        res.status(200)
        .json(
            {
                success:true, 
                message:'comment is deleted', 
                data:response2
            }
        )
    }
)





exports.updateComment=cathAsyncError(
    async(req,res,next)=>
    {
        const commentId=req.params.id;
        const {comment}=req.body

        if(!commentId || !comment)
        {
            return next(new ErrorHandler("please provide an Id", 404))
        }
        
        const response=await commentschema.findByIdAndUpdate({_id:commentId}, {comment}, {new:true});


        res.status(200)
        .json(
            {
                success:true, 
                message:'comment is updated succesfully', 
                data:response
            }
        )
    }
)





exports.getAllComments=cathAsyncError(
    async(req,res,next)=>
    {
        const blogId=req.body.blogId;
        if(!blogId)
        {
            return next(new ErrorHandler("please provide an Id", 404))
        }
        
        const response=commentschema.find({blogId});

        res.status(200)
        .json(
            {
                success:true, 
                message:'all commenst are retrievd', 
                data:response
            }
        )


        
    }
)






