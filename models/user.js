const mongoose=require("mongoose");


const userschema=new mongoose.Schema(
    {
        firstName:{
            type:String, 
            required:[true, "please provide a first name"]
        },
        lastName:{
            type:String, 
            required:[true, "please provide a last name"]
        },
        email:{
            type:String, 
            required:[true, "please provide a email"]
        },
        password:{
            type:String, 
            required:[true, "please provide a password"]
        },
        contactNo:{
            type:Number, 
            required:[true, "please provide a contact number"]
        },
        accountType:{
            type:String, 
            required:[true, "please provide a account type"], 
            enum:["user", "admin"]
        }, 
        blogs:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"BLOG"
            }
        ],
        categories:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"CATEGORY"
            }
        ],
        blocked:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"USER"
            }
        ],
        profileUrl:{
            type:String
        },
        isblocked:{
            type:Boolean,
            default:false
        }, 
        token:String, 
        resetPasswordExpiry:String

    }
)

module.exports=mongoose.model("USER", userschema)