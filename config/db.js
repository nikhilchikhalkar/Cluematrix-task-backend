const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI

console.log("url", URI)
const connectDB = async ()=>{
    try {
        // await mongoose.connect('mongodb+srv://unikpatner:6mySaBETC9juBBzT@cluster0.3l0cg68.mongodb.net/Cluematrix-test?retryWrites=true&w=majority&appName=Cluster0')
        await mongoose.connect(URI)
        console.log('connection successful to db');
        
    } catch (error) {
        console.error("database connection failed",error)
        process.exit(0);
        
    }
}



module.exports = connectDB

