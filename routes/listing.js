const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedin , isOwner ,validateListing} = require("../middleware.js");
const {index , renderNewForm , createListing,showListing,renderEditForm,updateLising,deleteListing} = require("../controllers/listings.js");
const multer  = require('multer');

const {storage} = require("../cloudConfig.js")

const upload = multer({ storage });

router.route("/")
   .get(wrapAsync(index))
   .post(
       isLoggedin ,  
       upload.single("listing[image]") , 
       validateListing,
       wrapAsync(createListing),
);

// .post(upload.single("listing[image]") , (req,res) =>{
//     res.send(req.file.path);
// });

router.get("/new" ,isLoggedin,renderNewForm);

router.route("/:id")
    .get( wrapAsync(showListing))
    .put(
         isLoggedin ,
         isOwner,
         upload.single("listing[image]"),
         validateListing,
         wrapAsync(updateLising)
    )
    .delete(
        isLoggedin , 
        isOwner,  
        wrapAsync(deleteListing)
    );


  //new route

//edit route
router.get("/:id/edit" , 
    isLoggedin ,
    isOwner,
    wrapAsync(renderEditForm)
);

module.exports = router;