const cathAsyncError=(callback)=> (req,res,next)=>
{
    Promise.resolve(callback(req,res,next)).catch(next)
}


module.exports=cathAsyncError