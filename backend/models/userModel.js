const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
        name :{
            type : String,
            required : [true ,"Please enter your name"],
            maxLength :[30 ,"Name can not exceed 30 characters"],
            minLength :[ 2,"Please enter valid name"]
        },
        email:{
            type : String,
            required : [true ,"Please enter your email"],
            unique : true,
            validate:[validator.isEmail,"Please enter a valid email"]
        },
        password:{
            type : String,
            required : [true ,"Please enter password"],
            minLength :[ 6,"Password should be at least 6 characters"] ,
            select: false, 
            //by using select false this will not appear in api response
        },
        mobileNo:{
            type : Number,
            required : [true ,"Please enter Contact number"],
            minLength :[ 10,"Number should be at least 10 digits"] ,
            
        },
        avatar:{

            publric_id:{
                type : String,
                required:true
            },
            url:{
                type : String,
                required:true
            }
        },
        role:{
            type : 'String',
            default : 'user',
        },
       
        resetPasswordToken: String, // reset password store in this var
        resetPasswordExpire: Date,

})

userSchema.pre('save', async function(next)
{
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)

})

//jwt  validation token
// .methods for creating methods
userSchema.methods.getJWToken = function(){

    return jwt.sign({id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE
    })

}

//password validation
userSchema.methods.validatePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
};

// reset password
userSchema.methods.getResetpasswordtoken = async function(){

    const resetToken = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken= crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

}

module.exports = mongoose.model('User',userSchema)