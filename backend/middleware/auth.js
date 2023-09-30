const ErrorHandler = require('../utils/errorHandler')
const asyncErrror = require("./catchAsync")
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const isAuthenticatedUser = asyncErrror( async (req,res,next) => {
   const {token} = req.cookies;
   if(!token) {
    return next(new ErrorHandler("Please Login to access this feature", 401));
   }  

   // we pass id in user model when we are creating jwt signin
   const idData = jwt.verify(token, process.env.JWT_SECRET_KEY);

   req.user = await User.findById(idData.id);
   next()
})

isAdmin = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  };


module.exports = {isAuthenticatedUser,isAdmin}