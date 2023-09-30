const mongoose = require('mongoose');

const connect =async()=>{
    
        await mongoose.connect(process.env.MONGO);
        console.log('connectd to mongodb')
    
}
mongoose.connection.on('disconnected',()=>{
    console.log("mongoDb disconnected")
})
mongoose.connection.on('connected',()=>{
    console.log("mongoDb connected")
})

module.exports= connect