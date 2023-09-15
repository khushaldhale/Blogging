const mongoose=require("mongoose");


const categoryschema=new mongoose.Schema(
    {
        categoryName:{
          type:String,
          required:[true, "please enter the name of category"]
        },
        decsription:{
            type:String,
            required:[true, "please enter the description"]
        }, 
        adminId:{
            type:String,
            required:[true, "please enter the name of category"]
        },
        blogs:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"BLOG"
            }
        ]
    }
)

module.exports=mongoose.model("CATEGORY", categoryschema)