const Listing = require("./models/listing");
const Review = require("./models/review")
module.exports.isLoggedin = (req,res,next) => {

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure","you must be logged in");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    const {id} = req.params;
    const listing =await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("failure","you don't have permission to edit");
    return  res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req,res,next) =>{
    const {reviewId , id } = req.params;
    const review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
    req.flash("failure","you don't have permission to edit");
    return  res.redirect(`/listings/${id}`);
    }
    next();
};