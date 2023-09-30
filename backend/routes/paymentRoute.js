const express = require('express');
const router = express.Router();
const { isAuthenticatedUser} = require("../middleware/auth");
const {checkOut,paymentVerification,getPaykey} = require("../controller/paymentController")

// router.post("/payment/process",isAuthenticatedUser, processPayment);

// router.get("/stripeapikey",isAuthenticatedUser, sendStripeApiKey);
router.post("/checkout",isAuthenticatedUser,checkOut)
router.post("/paymentverification",paymentVerification)

router.get("/getPay",isAuthenticatedUser,getPaykey)



module.exports = router;