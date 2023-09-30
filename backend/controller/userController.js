const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsync");
const User = require("../models/userModel");
const sendToken = require("../utils/token");
const sendEmail = require("../utils/emailSend");
const createUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password,mobileNo } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    mobileNo,
    avatar: {
      publric_id: "this is sample id",
      url: "sample url",
    },
  });
  sendToken(user, 201, res);
});

//Login user

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter email or password", 400));
  }

  // we should put await for finding user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  // we should put await for finding user
  const isPasswordverified = await user.validatePassword(password);
  if (!isPasswordverified) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  sendToken(user, 200, res);
});

const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetpasswordtoken();
  await user.save({ validateBeforeSave: false });

  //for making url dynaminc
  // const resetPasswordurl = `${//for https: or http}`://${req.get("host") for local or another host were we host our api}

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const message = `Your password reset token is : \n\n${resetPasswordUrl}\n\n if you did not request this mail so please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "animeUchiha password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `email sent to ${user.email} successfully`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

const updatePassword = catchAsyncError(async (req, res, next) => {
  // in middleware authjs we are storeing user in req.user

  const user = await User.findById(req.user.id).select("+password");
  // here we are passing prev password in  request body

  const isPasswordverified = await user.validatePassword(req.body.prevPassword);
  if (!isPasswordverified) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

const updateUser = catchAsyncError(async (req, res, next) => {
  // const { name, email, password,mobileNo } = req.body;
  const updateUserData = {
    mobileNo:req.body.mobileNo,
    name: req.body.name,
    email: req.body.email,
   
  };

  const user = await User.findByIdAndUpdate(req.user.id, updateUserData,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
 


  res.status(200).json({
    success: true,
    user
  });
});

const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});


 // for admin------------- 
const getAllUsers = catchAsyncError(async (req, res, next)=>{
   const users = await User.find()

   res.status(200).json({
    success: true,
    users,
   })

})


const getUser = catchAsyncError(async (req, res, next)=>{

  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`User is not avilable with this ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  })

})


const updateRole = catchAsyncError(async (req, res, next) => {
  const updateUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };
  const user = await User.findByIdAndUpdate(req.params.id, updateUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message:"role has been changed successfully",
    user,
  });
});

const deleteUser = catchAsyncError( async(req, res, next) => {

  const user = await User.findByIdAndDelete(req.params.id)

  if(!user){
    return next(new ErrorHandler(`User is not avilable with this ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    message:"user deleted successfully",
    user

  })


})


module.exports = {
  createUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  getUserDetails,
  updateUser,
  getAllUsers,
  getUser,
  updateRole,
  deleteUser
};
