const express = require('express');
const router = express.Router();

const {placeOrder,myOrders,getOrderDetail,getAllOrders,updateOrder,deleteOrder} = require("../controller/orderController")
const { isAuthenticatedUser ,isAdmin} = require("../middleware/auth");

router.post('/order',isAuthenticatedUser,placeOrder)
router.get("/order/:id",isAuthenticatedUser,getOrderDetail)
router.get('/myOrders',isAuthenticatedUser,myOrders)
router.get("/admin/orders",isAuthenticatedUser,isAdmin("admin"),getAllOrders)
router.put("/admin/order/:id",isAuthenticatedUser,isAdmin("admin"),updateOrder)
router.delete("/admin/order/:id",isAuthenticatedUser,isAdmin("admin"),deleteOrder)

module.exports = router;
