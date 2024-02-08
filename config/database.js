const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = ()=>{
    
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log('DB Connected');
    })  
    .catch((err)=>{
        console.log("error in database connection");
        console.log(err.message);
        process.exit(1);
    })  


}

module.exports = connectDB;