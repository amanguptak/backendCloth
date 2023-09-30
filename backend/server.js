




const app = require("./app")
const connectDB = require("./config/database")
const dotenv = require("dotenv")

//Handleing uncaught exceptions

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`shutting down the server due to uncaught exception`)
    process.exit(1)
})

dotenv.config({path:"backend/config/config.env"})
connectDB()



app.listen(process.env.PORT,()=>{
    console.log(`server listening on ${process.env.PORT}`)
})

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });