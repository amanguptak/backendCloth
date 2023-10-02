const express = require('express');
const app = express();
const products = require('./routes/productRoute');
const user = require("./routes/userRoute")
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute')
const errorMiddleware = require("./middleware/error")
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors({
    origin:process.env.FRONT_URL,
    credentials:true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/api",products)
app.use("/api",user)
app.use("/api",order)
app.use("/api",payment)
// middleware for error
app.use(errorMiddleware)



module.exports =app