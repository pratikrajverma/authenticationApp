//auth, isStudent, isAdmin
const jwt = require('jsonwebtoken');
require("dotenv").config();

 

const auth = (req, res, next)=>{
    try{
        //Note: we can fetch token by three different ways 1.grom req.body  2.from cookies and 3.from header 
        
        
        //extract jwt token 
        const {token}  = req.body;
 

        if(!token)
        {
            return res.status(401).json({
                success: "false",
                message: "  your token is missing"
            })
            
        }   
         
        //varify the token
        try{    
            const payload = jwt.verify(token, process.env.JWT_SECRET);      //here we are checking token is write or wronge with secret key
            console.log(payload);
 
            req.user = payload;             // Ab jab control agle middleware ko pass hota hai next() ke zariye, toh woh agle middleware ke saath saath req.user property ko bhi sath mein le jata hai.

        }catch(err){
            
            return res.status(401).json({
                success:false,
                message: " your token is invalid"

            })

        }


        next();         
                        //Yeh process middleware chain ke andar hoti hai. Har middleware ke andar next() ko call karne se control agle middleware mein jata hai aur uss middleware ko execute karne ka mauka milta hai. Aur jab last middleware execute ho jata hai, toh control request ke final destination (endpoint) tak pahunch jata hai. Saath hi, req.user property har middleware ke saath sath chalti hai, jisse har middleware ko user ke details ka access milta hai.

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