const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.postrev = async(req,res) =>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    let rew =  new Review(req.body.review);
    rew.author = req.user._id;
    const rev = list.reviews.push(rew);
    const reww = await rew.save();
    const frev = await list.save();
    res.redirect(`/listings/${id}`);
};

module.exports.destroy =  async (req,res) =>{
    let {id,reviewId} = req.params;
     const revv = await Review.findById(id);
    await  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     const rev = await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
};