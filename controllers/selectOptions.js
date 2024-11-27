const Listing = require("../models/listing");

module.exports.filteredListing = async (req,res) =>{
    const filter = req.query.filter;
    console.log("Humaira filter is now : ",filter);
    let filteredListing =await Listing.find({category:filter,approved:true});
    res.render("./selectOptions/filteredIndex.ejs",{filteredListing,isIndex:false});
};

module.exports.search = async (req, res, next) => {
  try {
      const { filter, srch } = req.query;
      let query = {};

      if (srch) {
          switch (filter) {
              case 'country':
                  query.country = srch;
                  break;
              case 'title':
                  query.title = new RegExp(srch, 'i');
                  break;
              case 'price':
                  const priceValue = parseFloat(srch);
                  if (!isNaN(priceValue)) {
                      query.price = { $lte: priceValue };
                  }
                  break;
              default:
                  break;
          }
      }
      
      let a = await Listing.find(query); // Fetch listings based on query
      
      if (a.length == 0) {
        req.flash("failure", `No listings found for ${srch}. Please try searching with a different country or title .`);
        // Flash message if no results
          res.redirect("/listings"); // Redirect to the home page or search page
      } else {
          res.render("./selectOptions/search.ejs", { a, isIndex: false }); // Render search page with results
      }
  } catch (err) {
      next(err); // Handle any errors
  }
};
