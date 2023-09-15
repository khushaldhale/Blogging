const mongoose=require("mongoose");



const otpschema=new mongoose.Schema(
    {
        otp:{
            type:Number, 
            required:[true, "please provde an OTP"]
        }, 
        email:{
            type:String, 
            required:[true, "please provide an email"]
        }, 
        createdAt:{
            type:Date, 
            default:Date.now()
        }
    }
)

module.exports=mongoose.model("OTP", otpschema)