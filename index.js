const express=require("express");
const app=express();
require("dotenv").config()


//middlewares 
app.use(express.json());
const cookie=require("cookie-parser");
app.use(cookie())



//db connection 
const dbconnect=require("./config/database");
dbconnect()


const authRoutes=require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes)



app.get("/", (req,res)=>
{
    res.status(200)
    .json(
        {
            success:true, 
            message:"This is default route for server zahid, server is up and running smoothly"
        }
    )
})

//global error handler 
app.use((error, req, res, next)=>
{
    console.log(error);
    return res.status(error.statusCode || 500)
    .json({
        success:false, 
        message:error.message
    })
})

//rate limiting
const rate_limiter=require("express-rate-limit");

const limiter=rate_limiter(
    {
        windowMs:60*60*1000,
        max:100
    }
)
app.use(limiter);


//listening at port
const PORT=process.env.PORT || 4000;
const server=app.listen(PORT, ()=>
{
    console.log("server started at ", PORT)
})



//shutting down the server
process.on("SIGINT", ()=>
{
    server.close(()=>
    {
        console.log("shutting down the server gracefully");
        process.exit(0)
    })
})