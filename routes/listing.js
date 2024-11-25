const express = require("express");
const router = express.Router();
const {ListingSchema} = require("../schema.js");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {isLoggedin} = require("../middleware");
const {isOwner} = require("../middleware")
const listContro = require("../controllers/listings.js");
const {storage} = require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage})

const validate = (req,res,next) =>{
    let {error} = ListingSchema.validate(req.body);
 
    if(error){
     throw new ExpressError(400,"Error Occured");
 
    }else{
     next();
    }
 }

 //Index
router.get("/",wrapAsync(listContro.index));

router.route("/new")
.post(isLoggedin,upload.single('listing[image]'),
wrapAsync(listContro.postnewList)) 
.get(isLoggedin,
    listContro.newList);

   
router.route("/:id")
.get(wrapAsync(listContro.showList))
.patch(
 isLoggedin,
 isOwner ,
 upload.single('listing[image]'),
 validate,
   wrapAsync(listContro.update))
   .delete(
   isLoggedin,
   isOwner,
   wrapAsync(listContro.delete));
   

 //Listing Edit
 router.get("/:id/edit",isLoggedin, isOwner ,
 wrapAsync(listContro.renderEdit));

 router.patch("/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the listing and update the `approved` field to true
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true, runValidators: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing approved successfully", listing: updatedListing });
  } catch (error) {
    console.error("Error approving listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;