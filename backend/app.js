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



app.use(express.json())
app.use(cors())
// {
//     origin:'https://animeuchiha-da53ppzam-imamangupta600-gmailcom.vercel.app',
//     credentials:true,
// }
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api",products)
app.use("/api",user)
app.use("/api",order)
app.use("/api",payment)
// middleware for error
app.use(errorMiddleware)



module.exports =app