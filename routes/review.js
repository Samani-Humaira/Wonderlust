const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");
const {isLoggedin , isReviewAuthor} = require("../middleware.js");
const revContro = require("../controllers/Review.js");

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
     throw new ExpressError(500,"review Required");
    }else{
     next();
    }
}

router.post("/Review", isLoggedin , validateReview ,revContro.postrev );


router.delete("/Review/:reviewId",
  isLoggedin ,
  isReviewAuthor,
  revContro.destroy);

module.exports = router;