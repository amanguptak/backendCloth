const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsync");
const Product = require("./../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");

//create a new Product for admin

exports.createProduct = catchAsyncError(async (req, res, next) => {

  req.body.user = req.user.id;  //  here we are getting user id from cookie and assign it to body
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, product });
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "Product not found" });
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Product deleted" });
});

//get a single products

exports.getProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
});

exports.getAllProducts = catchAsyncError(async (req, res,next) => {

  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    

  let products = await apiFeatures.query;
  let filterProductsCount = products.length

  apiFeatures.pagination().limitPerPage();
 // use clone for avoiding error "Query was already executed: Product.find({ price: { } })"
   
  products = await apiFeatures.query.clone()

  
  res.status(200).json({
    success: true,
    products,
    productCount,
    filterProductsCount
  });
});




// new reviews and updates reviews


exports.addReview= catchAsyncError(async (req, res, next) => {

const {rating,comment,productId}= req.body;

const review = {
  user: req.user._id,
  name: req.user.name,
  rating: Number(rating),
  comment,

}

const product = await Product.findById(productId);
const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

if (isReviewed){
  product.reviews.forEach((rev) => {
    if (rev.user.toString() === req.user._id.toString())
      (rev.rating = rating), (rev.comment = comment);
  });
}

else {
  product.reviews.push(review);
  product.numOfReviews = product.reviews.length;
}

let avg = 0;
product.reviews.forEach((rev) => {
  avg += rev.rating;
});

product.ratings = avg / product.reviews.length;
await product.save({validateBeforeSave:false})

res.status(200).json({
  success:true,

})
})

exports.getReviews = catchAsyncError( async(req, res,next) => {

const product = await Product.findById(req.query.id);
if(!product){
  return next(new ErrorHandler(`Product is not avilable with this ${req.query.id}`,404));
}
res.status(200).json({

  success: true,
  reviews: product.reviews
})

})


exports.deleteReview= catchAsyncError( async(req, res,next) => {

  const product = await Product.findById(req.query.productId);
  if(!product){
    return next(new ErrorHandler(`Product is not avilable with this ${req.query.id}`,404));
  }

  // for removing the review which we want to delete

const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );


  // for finding the new avg after deleting the particular review
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  // for updating the changes

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );


  res.status(200).json({
  
    success: true,

  })
  
  })