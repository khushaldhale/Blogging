const mongoose=require("mongoose");
require("dotenv").config()



const dbconnect=()=>
{
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser:true, 
        useUnifiedTopology:true
    })
    .then((data)=>
    {
        console.log("connection established at ", data.connection.host)
    })
    .catch((error)=>
    {
        console.log(error)
    })
}


module.exports=dbconnect