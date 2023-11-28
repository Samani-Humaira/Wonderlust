const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
// const { reviewSchema } = require("../schema.js")
const { validateReview ,isLoggedin , isReviewAuthor} = require("../middleware.js");
const {createReview , destroyReview} = require("../controllers/reviews.js")
//LISTINGS INDEX - SHOWS ALL LISTINGS
//Reviews
router.post("/",
    isLoggedin , 
    validateReview , wrapAsync(createReview)
);

router.delete("/:reviewId",
isLoggedin , 
isReviewAuthor ,  
wrapAsync(destroyReview));

module.exports=router;