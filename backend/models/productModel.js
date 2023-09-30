const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  
    name: {
        type: String,
        required:[true,"Please enter a product name"],
        trim:true
    },
    description:{
        type: String,
        required:[true,"Please enter a description"]
    },
    price:{
        type: Number,
        required:[true,"Please enter a price"],
        maxLength:[8,"Please enter a valid price"]
    },
    ratings:{
        type: Number,
        default: 0,
    },
    images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],

      varient:[
        {
          size:{
            type: String
          },
          priceV:{
            type: Number
          }

        }
      ],
      category: {
        type: String,
        required: [true, "Please Enter Product Category"],
      },
      Stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ], user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
      createdAt: {
        type: Date,
        default: Date.now,
      },

})

module.exports = mongoose.model("Product", productSchema);