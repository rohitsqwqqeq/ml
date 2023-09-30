const mongoose = require('mongoose');

// This was accepted in older verssion
// const connectDB = () => {
//     mongoos.connect(process.env.MONGO_URI, ()=>{
//         console.log("Connected to MongoDB Successfully");
//     })
// }
// module.exports = connectDB;

// In newer version this is accepted (without callback)
const connectDB = () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGO_URI) 
        console.log("Connected to MongoDB Successfully")
    } catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectDB;
