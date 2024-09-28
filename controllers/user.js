const User = require("../models/user");

module.exports.getsign = (req,res) =>{
    res.render("./user/signup.ejs",{isIndex:false});
};

module.exports.postsign = async(req,res) =>{
    try{
        let {username , password , email } = req.body;
        const user1 =  new User({email , username});
        const registerdUSer = await User.register(user1 , password);
        console.log(registerdUSer);
        req.login(registerdUSer,(err) =>{
            if(err){
                return next(err);                 
            }
            req.flash("success","Welcome to wonderlust");
            res.redirect("/listings");
        });
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
    res.redirect(redirect);
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