const blogschema=require("../models/blog");
const userschema=require("../models/user");
const categoryschema=require("../models/category");
const cathAsyncError = require("../utils/catchAsyncError");
const ErrorHandler=require("../utils/errorHandler")
const fileUpload=require("../utils/cloudinary")
const categoryschema=require("../models/category");
const userschema=require("../models/user")


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

// also applied pagination here 


//get blogs by category 
exports.getBlogsByCategory=cathAsyncError(
    async(req,res,next)=>
    {

        const {limit, page}=req.params;
        const skip=(page-1)* limit;
        const categoryId=req.body.categoryId;
        if (!categoryId)
        {
            return next(new ErrorHandler("please provide Category Id", 404))

        }

        const response=await categoryschema.findById({_id:categoryId}).populate("blogs").skip(skip).limit(limit);


        res.status(200)
        .json(
            {
                success:true, 
                message:"blogs with respect to categories are fetched", 
                data:response
            }
        )


    }
)

// get blogs by author name 

exports.getBlogsByAuthorName=cathAsyncError(
    async(req,res,next)=>
    {
        const authorName=req.body;
        const {limit, page}=req.params;
        const skip=(page-1)* limit;

        const arr=authorName.split(" ");

        if(!authorName)
        {
            return next(new ErrorHandler("please provide Author name", 404))
            
        }

        const response=await userschema.find({$and :[{firstName:{$regex:arr[0]}},{lastName:{$regex:arr[1]}}]}).skip(skip).limit(limit);
        
        res.status(200)
        .json(
            {
                success:true, 
                message:"blogs are retrieved according to the Author Name", 
                data:response
            }
        )




    }
)

// get blogs by blog title 


exports.getBlogsByBlogTitle=cathAsyncError(
    async(req,res,next)=>
    {
        const blogTitle=req.body.blogTitle;
        const {limit, page}=req.params;
        const skip=(page-1)* limit;
        if(!blogTitle)
        {
            return next(new ErrorHandler("please provide title of the blog", 404))
            
        }

        const response=await blogschema.find({title:blogTitle}).skip(skip).limit(limit);

        res.status(200)
        .json(
            {
                success:true,
                message:"blogs are retrievd with the help of title", 
                data:response
            }
        )

    }
)