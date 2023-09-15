const nodemailer=require("nodemailer");




const sendEmail=async(email, sub, body)=>
{
    const transporter=nodemailer.createTransport(
        {
            host:"smtp.gmail.com", 
            auth:{
                user:process.env.USER, 
                pass:process.env.PASS
            }
        }
    )

    const mailinfo=await transporter.sendMail(
        {
            from:"khushal Dhale", 
            to:email,
            subject:sub, 
            html:body
        }
    )

    console.log(mailinfo);

}

module.exports=sendEmail