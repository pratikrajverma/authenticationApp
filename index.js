const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
 
const connectDB = require('./config/database');
connectDB(); 

const user = require("./routes/users")
app.use('/api/v1', user);
 
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})