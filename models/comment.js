const mongoose=require("mongoose");


const commentschema=new mongoose.Schema(
    {
        comment:{
            type:String, 
            required:[true, "pleasse enter the comment"]
        }, 
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"USER"
        },
        blogId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"BLOG"
        }
    }
)

module.exports=mongoose.model("COMMENT", commentschema)