const User = require("../models/user");
const Listing = require("../models/listing");



module.exports.getsign = (req,res) =>{
    res.render("./user/signup.ejs",{isIndex:false});
};

module.exports.postsign = async(req,res) =>{
    try{
        let {username , password , email } = req.body;
        console.log("Humaira here it is : ");
        const user1 =  new User({email , username});
        const registerdUSer = await User.register(user1 , password);
        console.log(registerdUSer);
        req.flash("success","Congratulation! you have signed up successfully , Now Login");
        res.redirect("/login");
    }
  catch(err){
    req.flash("failure","User already exist");
    res.redirect("/signup");
  }
};

module.exports.getLogin = (req,res) =>{
    res.render("./user/login.ejs",{isIndex:false});
};

module.exports.postLogin = async(req,res) =>{
    // res.send("welcome ");
    req.flash("success","Welcome back to wonderlust");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect('/listings');
};

module.exports.logout = (req,res) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    });
};


module.exports.getUnapprove = async(req,res) =>{
    try{
        console.log(req.body.email);
        console.log(req.body.password);
        if(req.body.email == "admin@gmail.com" & req.body.password == '12as!@AS'){
            const unApprovedListing = await Listing.find({approved:false});
            req.admin = true;
            res.render("./user/admin/aIndex.ejs",{UnAppListing:unApprovedListing,admin:req.admin});
        }
        else{
            req.flash("failure","You are not authorized to view this page");
            res.redirect("/listings");
        }

    
    }catch(err){
        console.log(err);
    }
}

module.exports.getApprove = async(req,res) =>{
    try{
        // console.log(req.body.email);
        // console.log(req.body.password);
        // if(req.body.email == "admin@gmail.com" & req.body.password == '12as!@AS'){
            const ApprovedListing = await Listing.find({approved:true});
            req.admin = true;
            res.render("./user/admin/aAppIndex.ejs",{AppListing:ApprovedListing,admin:req.admin});
        // }
        // else{
        //     req.flash("failure","You are not authorized to view this page");
        //     res.redirect("/listings");
        // }

    
    }catch(err){
        console.log(err);
    }
}

// // Approve a listing by ID





module.exports.adminLogin = async (req,res) =>{
    // let {email,password} = req.body;
    // console.log("Humaira in controller now!! admin middle ware works fine");
    // console.log(req.Admin);
    
    // // console.log(req.body);
    // // try{
    // //     if(email != process.env.admin_email && password != admin_password){
    // //         req.flash("failure","Invalid email or password");
    // //         res.redirect("/admin");
    // //         console.log("not login");
    // //     }else{
    // //         // const unApprovedListing = await Listing.find({approved:false});
    // //         req.flash("success","Welcome to admin dashboard");
    // //         // req.admin = true;
    // //         console.log("login admin");
    // //         // res.render("./user/admin/aIndex.ejs",{UnAppListing:unApprovedListing});
    // //         res.redirect("/unApprovedListings");
    // //     }
    // // }catch(err){
    // //     console.log(err);
    // // }
    // if(req.Admin){
    //     res.redirect("/unApprovedListings");
    // }
    // req.flash("wron")
    res.render("./user/admin/aLogin");
}