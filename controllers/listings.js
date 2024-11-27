const Listing = require("../models/listing");

module.exports.index = async (req,res) =>{
    const listing =  await Listing.find({approved:true});
     res.render("./listing/index.ejs",{listing,isIndex:false});
};

 module.exports.newList =  (req,res) =>{
    res.render("./listing/new.ejs",{isIndex:false});
};

module.exports.postnewList = async (req,res,next) =>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename);
    const result =  new Listing(req.body.listing);
     result.owner = req.user._id;
    result.image = {url,filename};
    result.approved = false;
    const newList = await result.save();
    console.log(newList);
    req.flash("success","Your listing has been submitted! Please wait for approval.");
    res.redirect("/listings");
};

module.exports.renderEdit = async (req,res) =>{
    const {id} = req.params;
    const listi = await Listing.findById(id);
    if(!listi){
        req.flash("failure","Listing does not exist");
        res.redirect("/listings");
    }
    let originalImgUrl = listi.image.url;
    originalImgUrl = originalImgUrl.replace("/upload","/upload/w_250");
    res.render("./listing/edit.ejs",{listi,originalImgUrl,isIndex:false});

};

module.exports.update = async (req,res) =>{
    const {id} = req.params;
     const listing =await Listing.findById(id);
     const updated = await Listing.findByIdAndUpdate(id,{...req.body.listing});

     if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     updated.image = {url,filename};
     await updated.save();
     }

     // res.send(updated);
     await updated.save();
     console.log(updated);
     req.flash("success","listing updated");
     res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req,res) =>{
    let {id} = req.params;
    let del =  await Listing.findByIdAndDelete(id);
    console.log("deleted");
    console.log(del);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};

module.exports.showList = async(req,res) =>{
    let {id} = req.params;
const list = await Listing.findById(id)
.populate({path: "reviews",
populate : {
   path : "author"
}})
.populate("owner");
if(!list){
   req.flash("failure","No such listing exist");
   res.redirect("/listings");
}
console.log(list);
res.render("./listing/show",{list,isIndex:false});
};