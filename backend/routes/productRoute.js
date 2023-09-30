const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  addReview,
  getReviews,
  deleteReview
} = require("../controller/productController");
const router = express.Router();
const { isAuthenticatedUser, isAdmin } = require("../middleware/auth");

router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);

// we should follow the sequence of middleware
router.post(
  "/addProduct",
  isAuthenticatedUser,
  isAdmin("admin"),
  createProduct
);
router.put(
  "/product/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  updateProduct
);
router.delete(
  "/product/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  deleteProduct
);


router.put("/review",isAuthenticatedUser,addReview)
router.get("/review",getReviews) //we need to give product id
router.delete("/review",isAuthenticatedUser,deleteReview) // we need to give productId and reviewId as id in params

module.exports = router;
