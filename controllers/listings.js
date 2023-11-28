const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res) =>{
    let allListings = await Listing.find({});
     res.render("./listings/index",{allListings});

};

module.exports.renderNewForm = (req,res) =>{
 res.render("listings/new");
};

module.exports.createListing = async (req,res,next) =>{

  let response =  await geocodingClient
  .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
       


    let url = req.file.path;
    let filename = req.file.filename;

    const newListing =  new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename };

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();

    console.log(savedListing);

    req.flash("success","New Listing created");
    res.redirect("/Listings");
    // console.log(newListing);  
};

module.exports.showListing = async (req,res) =>{
    let {id} =req.params;
    const listing  = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate:{
            path:"author" 
        },
    })
    .populate("owner");
    if(!Listing){
        req.flash("error","Listing does not exist");
        res.redirect(`./listings/index`);
    }
    console.log(listing);
    res.render("./listings/show",{listing}); 
};

module.exports.renderEditForm = async (req,res) =>{
    let {id} =req.params;
    const listing  = await Listing.findById(id);  
    if(!Listing){
        req.flash("error","Listing you req does not exist");
        res.redirect(`/Listings`);
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250");
    // console.log(originalUrl);
    res.render("./listings/edit",{listing,originalUrl});   
};

module.exports.updateLising = async (req,res) =>{


    let {id} = req.params;
  let itListing = await  Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file !== "undefined"){

    let url = req.file.path;
    let filename = req.file.filename;
    itListing.image = {url,filename};
    await itListing.save();

   }
 
   req.flash("success","Listing updated");
  res.redirect(`/Listings/${id}`);

};

module.exports.deleteListing = async (req,res) =>{
    let {id} =req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing Deleted");
   res.redirect("/Listings");
};