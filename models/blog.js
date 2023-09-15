const mongoose=require("mongoose");


const blogschema=new mongoose.Schema(
    {
        title:{
            type:String, 
            required:[true, "plesae enter the title"]
        },
        content:{
            type:String, 
            required:[true, "plesae enter the content"]
        },
        imageUrl:{
            type:String, 
            required:[true, "plesae enter the image"]
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"USER", 
            required:[true, "please provide an user Id"]
        },
        categoryId:{
            type:String, 
            required:[true, "please provide an user Id"]
        },
        comments:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"COMMENT"
            }
        ]

    }
)

module.exports=mongoose.model("BLOG", blogschema)