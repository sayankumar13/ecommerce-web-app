const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter a name of the product"],
        trim:true
    },
    description:{
        type:String,
        required:[true, "Please enter a description of the product"],
        maxLength:[4000, "Description can not exceed 4000 characters"]
    },
    offerPrice:{
    type: String,
    maxLength:[3, "Discount percent can not exceed then 2numbers"]
    },
    price:{
        type: Number,
        required:[true, "Please enter the product price "],
        maxLength:[8, "price can not exceed 8 characters"]
    },
    color:{
     type:String,
    },
    size:{
      type:String,
    },
    ratings:{
        type: Number,
        default:0
    },
    images:[
        {
        public_id:{
            type:String,
            required:true 
        },
        url:{
            type:String,
            required:true 
          }  
        }
    ],
    category:{
        type:String,
        required:[true,"Please add a category of your product"],
    },
    Stock:{
        type:Number,
        required:[true, "Please enter product stock"],
        maxLength:[4,"Stock can not exceed 4 characters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
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
          profile_img: {
            type:String,
            ref:"User",
              },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
          },
          time:{
            type: Date,
            default:  Date.now()
          },
        },
      ],    
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("product",productSchema)