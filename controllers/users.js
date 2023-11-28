const User = require("../models/user");

module.exports.renderSignup = (req,res) =>{
    res.render("./users/signup.ejs");
};

module.exports.signUp = async (req,res) =>{
    try{
       let {username,email,password} = req.body;
       let user1 = new User({
          username,
          email,
       });
       const registeredUser = await User.register(user1,password);
         console.log(registeredUser);
         req.login(registeredUser,(err) =>{
          if(err){
             return next(err)
          }
          req.flash("success","Welcome to Wonderlust");
         res.redirect("./Listings");
         });
    }
    catch(err){
       req.flash("error",err.message);   
       res.redirect("/signUp");
    }
 };

module.exports.renderLoginForm = (req,res) =>{
    res.render("users/login.ejs")
};

module.exports.login =  async (req,res) =>{
    req.flash("success","Welcome back to wonderlust");
    let redirectUrl = res.locals.redirectUrl || '/Listings';
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) =>{
    req.logOut((err) =>{
       if(err){
          return next(err);
       }
       req.flash("success","you are logout");
       res.redirect("/Listings");
    });
};