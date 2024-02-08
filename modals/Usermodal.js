const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true      //trim ka matlab he side me se space ko hatana
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum:["Admin", "Student", "Visitor"]            //Is code mein, role field ke liye enum set kiya gaya hai. Iska arth hai ki role field keval "Admin", "Student", ya "Visitor" mein se kisi ek value ko hi sweekar karega
    }


})

module.exports = mongoose.model("User", userSchema);

