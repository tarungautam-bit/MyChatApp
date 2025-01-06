const notFound=(req,res,next)=>{
    const error = new Error(`Not Found ${req.OrignalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler=(err,req,res,next)=>{
    res.status(res.statusCode);
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV==='production'?null:err.stack,
    });
};

module.exports={notFound,errorHandler};