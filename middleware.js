const Listing = require("./models/listing");
const {ListingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedin = (req,res,next) => {
    if(!req.isAuthenticated()){
        //redirect
        req.session.redirectUrl = req.originalUrl;
   req.flash("error","You must be logged in to create a list");
   return res.redirect("/login");
}   
next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) =>{
    let {id} =req.params;
    let listing = await  Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
      req.flash("error","You don't have permission to edit");
      return  res.redirect(`/Listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id , reviewId} =req.params;
    let review = await  Review.findById(reviewId);
    console.log(review);
    if(!review.author.equals(res.locals.curUser._id)){
      req.flash("error","You are not the author of this review");
      return  res.redirect(`/Listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    let {error} = ListingSchema.validate(req.body);
   
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 ,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
   
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 ,errMsg);
    }else{
        next();
    }
};