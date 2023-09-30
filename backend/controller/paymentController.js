const catchAsyncErrors = require("../middleware/catchAsync");
const { instance } = require("../razorpayInstance");
const crypto = require("crypto");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.checkOut = async (req, res) => {
  var options = {
    amount: Number(req.body.amount * 100), // amount in the smallest currency unit
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  // console.log(order);
  res.status(200).json({
    success: true,
    order,
  });
};

exports.paymentVerification = async (req, res) => {
 
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =  req.body;

 

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.ROZAR_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

const isAuthentic = expectedSignature === razorpay_signature
if(isAuthentic){

res.redirect(`${process.env.FRONT_URL}/paymentsuccess?reference=${razorpay_payment_id}`)
}else{
  res.status(400).json({
    success: false,
  });
}


 
};

exports.getPaykey = async (req, res) => {
  res.status(200).json({ key: process.env.ROZAR_API_KEY });
};
// module.exports = {
//   checkOut
// }
