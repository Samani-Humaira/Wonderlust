const Listing = require("../models/listing");

module.exports.filteredListing = async (req,res) =>{
    const filter = req.query.filter;
    console.log("Humaira filter is now : ",filter);
    let filteredListing =await Listing.find({category:filter});
    res.render("./selectOptions/filteredIndex.ejs",{filteredListing,isIndex:false});
};

module.exports.search = async (req,res) =>{
    try{
        const { filter, srch } = req.query; // Get filter type and search term from the query
        let query = {};
    
        if (srch) {
          switch (filter) {
            case 'country':
              query.country = srch; // Filter by country
              break;
            case 'title':
              query.title = new RegExp(srch, 'i'); // Filter by title (case-insensitive)
              break;
            case 'price':
              const priceValue = parseFloat(srch);
              if (!isNaN(priceValue)) {
                query.price = { $lte: priceValue }; // Filter by price (less than or equal to the specified price)
              }
              break;
            default:
              break;
          }
        }
        let a = await Listing.find(query);
        console.log(a);
       if(a.length == 0){
           req.flash("failure","Listing with this country does not exist");
           res.redirect("./");
           
       }else{
           res.render("./selectOptions/search.ejs",{a,isIndex:false});
       }
    }catch(err){
       next(err);
    } 
};