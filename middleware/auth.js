//auth, isStudent, isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config();

 

const auth = (req, res, next)=>{
    try{
        //extract jwt token 
        //Note: we can fetch token by three different ways 1.grom req.body  2.from cookies and 3.from header 


        const { token } = req.body;

        if(!token)
        {
            return res.status(401).json({
                success: "false",
                message: "You are not logged in because  your token is missing"
            })
        }   

        //varify the token
        try{    
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload;

        }catch(err){
            return res.status(401).json({
                success:false,
                message: "You are not logged in because  your token is invalid"

            })

        }


        next();


    }
    catch(error){
        return res.status(401).json({
            success:false,
            message: "somthing went wrong in varifying token"
        })
    }
}




const isStudent = (req,res,next)=>{
    try{
        if(req.user.role !== "Student")
        {
            return res.status(401).json({
                success: "false",
                message: "You are not logged in because you are not a Student" 
            })
        }

        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message: "error in finding user role"
        }) 
    }
    
}


const isAdmin = (req,res,next)=>{
    try{
        if(req.user.role !== "Admin")
        {
            return res.status(401).json({
                success: false,
                message: "You are not logged in because you are not an Admin"
            })
        }

        next()
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message: "error in finding user role"
        }) 
    }
    
}

 



module.exports = {auth, isStudent, isAdmin}; 