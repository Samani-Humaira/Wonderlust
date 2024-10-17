const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema =new  Schema({
     title :{
        type : String,
        required:true,
     },
     description:String,
     image: {
      url : String,
      filename : String
      },
     price :{
      type:Number,
      required:true,
     },
     location : {
      type:String,
      required:true,
     },
     country :{
      type:String,
      required:true,
      lowercase: true
     },
     approved:{
      type:Boolean
     },
     reviews :[
      {
        type:Schema.Types.ObjectId,
        ref:Review,
      }
     ],
     owner:{
      type:Schema.Types.ObjectId,
      ref:User,
     },
     category:{
     type: [{
      type: String,
      lowercase: true
    }],
    enum: ["mountain", "trending", "rooms", "cities", "farms", "domes", "arctic", "castles", "boats"],
    required: true
     }
});

listingSchema.pre('save', function(next) {
  this.category = this.category.map(value => value.toLowerCase());
  next();
});

listingSchema.post("findOneAndDelete",async (list) =>{
  if(list){
    await  Review.deleteMany({_id :{$in : list.reviews}});
  }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;