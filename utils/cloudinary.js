const cloudinary=require("cloudinary").v2;




const fileUpload=async(file, folder)=>
{
    const options={
        folder
    }
    options.resource_type="auto"
    const response= await cloudinary.uploader.upload(file.tempFilePath,options)
    return response.secure_url;

}

module.exports=fileUpload