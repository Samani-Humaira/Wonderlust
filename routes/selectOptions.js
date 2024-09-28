const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const selectOptions = require("../controllers/selectOptions");

router.get("/",
    selectOptions.filteredListing
);

router.get("/search",selectOptions.search);

module.exports=router;