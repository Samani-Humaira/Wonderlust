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


module.exports = router;