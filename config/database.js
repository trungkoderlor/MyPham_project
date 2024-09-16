const mongoose = require('mongoose'); 
module.exports.connect =async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database successfully");

    } catch (error) {
        console.log("Error connecting to database");
    }
}