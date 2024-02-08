const bcrypt = require('bcrypt');

const User = require('../modals/Usermodal');

const signup = async(req,res)=>{
    try{
        const{name, email, password, role} = req.body;

        //check if user already exists then return failure and kill further process


        const existinguser = await User.findOne({email})
 
        if(existinguser)
        {
            return res.status(400).json({
                success: "false",
                message: "User already exists",
                
            })
        }


        let hashedPassword;

        try{
            hashedPassword = await bcrypt.hash(password,10);      //bcrypt.hash() function ek asynchronous function hai jo bcrypt library mein available hai. Iska basic kaam hai ek di gayi string (password) ko hash value mein convert karna, jo fir store kiya ja sakta hai.

        }catch(error)
        {
            return res.status(500).json({
                success: "false",
                message: "error in hashing password"
            })
        }

        const user = await User.create({name, email, password:hashedPassword, role})

        res.status(200).json({
            success: "true",
            message: "User created successfully"
        })



    }catch(error){
        console.log(error);
        res.status(400).json({
            success: "false",
            message: "user cannot be registored,  please try again"
        })
    }


}

module.exports = {signup};