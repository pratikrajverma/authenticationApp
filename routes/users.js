const express = require('express');
const router = express.Router();

const{signup, login} = require('../controller/Auth');
const {auth, isStudent, isAdmin} = require('../middleware/auth');   

router.post("/signup", signup);
router.post("/login", login) 

//testing routes
router.get("/test", auth, (req, res) => {
    res.json({
        success:true,
        message:"welcome to protected routes for testing purposes"
    });
})




//protected routes
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success:true,
        message:"welcome to protected routes of stuent"
    });
})


router.get("/admin", auth, isAdmin, (req, res) =>{
    res.json({
        success:true,
        message:"welcome to protected routes of admin"
    });
} )



  
module.exports = router;
