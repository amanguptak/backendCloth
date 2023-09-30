const Razorpay = require('razorpay')
const dotenv = require("dotenv")

// const cors = require('cors')

dotenv.config({path:"backend/config/config.env"})
// app.use(cors({
//     origin:"http://localhost:8080",
//     credentials:true,
// }))

exports.instance = new Razorpay({
    key_id: process.env.ROZAR_API_KEY,
    key_secret: process.env.ROZAR_SECRET_KEY,
  })