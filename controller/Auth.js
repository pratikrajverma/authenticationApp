const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require('../modals/Usermodal');


//signup kar rahe he
const signup = async(req,res)=>{
    try{
        const{name, email, password, role} = req.body;

        if(!email || !password || !role || !name)
        {
            return res.status(400).json({
                success: "false",
                message: "Please provide all details"
            }) 
        }

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


        const user = await User.create({name, email, password:hashedPassword, role})        //storing data to database

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



// .............................................................................................
//login kar rahe he



const login = async (req, res) => {
    try{
        //fetch data by user
        const {email, password} = req.body;
        //validation on email and password that email and password user khali to nahi bheja he
        if(!email || !password)
        {
            return res.status(400).json({
                success: "false",
                message: "Please fill email and password"
            })
        }

        //check email database me he ki nahi he agar he to uska sara document ka details user me dal do
        let user = await User.findOne({email})

        if(!user)   
        {
            return res.status(401).json({
                success: "false",
                message: "User not found"
            })
        }
        

        const payload ={                //making payload for jwt token
            id: user._id,
            email: user.email,
            role: user.role
        }  
 
        //varify password and generate JWT token
        if(await bcrypt.compare(password, user.password))
        {
            //password matched so now we will make jwt token
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"2h"});
 
              
            user = user.toObject();
            user.token = token; //here we are sending jwt token in user object 
            user.password = undefined;  //we are hiding password form user object
            
            //create cookies  
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),    //expires: Yeh property cookies ka expiration time define karta hai. Is example mein, expires property ko new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) ke saath set kiya gaya hai. Yeh current time (milliseconds mein) se 3 din baad ka time ko represent karta hai. Matlab, yeh cookie 3 din tak valid rahega, uske baad expire ho jayega aur browser use automatically delete kar dega
                httpOnly: true                      // httpOnly property cookies ko server se hi access karne ki anumati deta hai, lekin client-side JavaScript code se nahi. Isse cookies ke misuse ka khatra kam ho jata hai.
            }    
  
            res.cookie("cookieName", token, options)        //res.cookie() Express.js ka function hai jo cookies ko client ke browser mein set karta hai. Yahan, "token" cookie ka naam hai, token variable ki value jo ki JWT (JSON Web Token) hota hai, aur options object cookie ke options ko define karta hai, jaise ki expiration time, secure attribute, etc
                .status(200).json({                         //ye json() function Express.js ka hai jo JavaScript objects ko JSON format mein convert karta hai. Yahan diye gaye object mein success, token, user, aur message keys hai, jo ki client ko successful login ka indication dete hain.
                success: true,
                token,                                      // JWT token hai jo user ko authenticate karne ke liye istemal kiya jata hai.
                user,                                       //: User object hai jo user ke details ko represent karta hai, jaise ki naam, email, role, etc.
                message: "User Login successfully"
            })

        }
        else{
            return res.status(403).json({
                success: "false",
                message: "Invalid password"
            })
        }

    } 
    catch(error) 
    { 
        console.log('error he loging karne me');
        res.status(500).json({
            success: "false",
            message: "Login failure"    
        })

    }
}

module.exports = {signup, login };

 

//important points
//1.  Cookies ko server ke dwara set kiya jata hai, lekin ek server ke dwara malicious code ya virus cookies mein set kiya ja sakta hai. Ye prakriya "cookie injection" ya "cookie poisoning" ke roop mein jaani jaati hai.

// Jab koi server kisi user ke browser ko cookies bhejta hai, toh woh cookies server ke dwara generate kiya gaya data hota hai. Lekin, ek hacker ya malicious actor agar server ke dwara bheje gaye cookies ko modify kar deta hai, toh woh browser ke memory mein aane wale cookies mein malicious code ko inject kar sakta hai. Jab browser uss cookies ko accept karta hai, toh woh code browser ke local storage mein store ho jata hai.

// Is tarah se, cookies ko set karne ka prakriya toh server handle karta hai, lekin agar cookies mein koi modification ya injection ho gaya hai, toh woh browser ke local storage mein store ho sakta hai aur potential security risks create kar sakta hai.
