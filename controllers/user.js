const User = require("../models/user");
const Listing = require("../models/listing");

const nodemailer = require('nodemailer');

module.exports.getsign = (req,res) =>{
    res.render("./user/signup.ejs",{isIndex:false});
};



module.exports.postsign = async(req,res) =>{
    try{
        let {username , password , email } = req.body;

        const otp = Math.floor(1000 + Math.random() * 9000);
        req.session.username = username;
        req.session.password = password;
        req.session.otp = otp;
        req.session.email = email;

        const mailOptions = {
            from:process.env.email,
            to: email,
            subject: 'Welcome to StaySphere! Your OTP for Signup',
            text: `
            Hello,
            Welcome to StaySphere, the platform where you can manage your stays with ease and convenience! We are excited to have you on board.
            To complete your registration, please use the following One-Time Password (OTP) to verify your account:
            OTP: ${otp}
            This OTP is valid for a limited time. Please enter it on the verification page to proceed with your sign-up process.
            If you did not request this, please ignore this email.
            Thank you for choosing StaySphere!

            Best regards,
            The StaySphere Team
            `
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.email,
                pass: process.env.pass
            }
        });
        

        // Send the email
        await transporter.sendMail(mailOptions);

        console.log("Humaira in sign up , just now rendering the verify page");
        console.log(otp);

        res.render("./user/otpVerify", { email });
    }
  catch(err){
    req.flash("failure","User already exist");
    res.redirect("/signup");
    console.log(err);
  }
};

module.exports.verifyOtp = async (req, res) => {
    const { otp } = req.body;
    console.log("humaira in verify backend ",otp);
    console.log("otp in verify : session hummi",req.session.otp);
    if (parseInt(otp) === req.session.otp) {
        try {
            console.log("in verify try block");
            const { email, username ,password} = req.session;

            console.log(req.body);
            const user1 = new User({ email, username });

            console.log("user1" ,user1);
            const registeredUser = await User.register(user1, password);
            console.log(registeredUser);

            req.flash("success", "Congratulations! You have signed up successfully, now login.");
            res.redirect("/login");
        } catch (err) {
            console.log("in verify catch block");
            console.error(err);
            req.flash("failure", "Error while registering user.");
            res.redirect("/signup");
        }
    } else {
        req.flash("failure", "Incorrect OTP. Please try again.");
        res.redirect("/signup"); 
        console.log("in else block of verify");
    }
};

module.exports.getLogin = (req,res) =>{
    res.render("./user/login.ejs",{isIndex:false});
};

module.exports.postLogin = async(req,res) =>{
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
        if(req.body.email == "admin@gmail.com" & req.body.password == '12as!@AS'){
            const unApprovedListing = await Listing.find({approved:false});
            req.admin = true;
            res.render("./user/admin/aIndex.ejs",{UnAppListing:unApprovedListing,admin:req.admin});
        }
        else{
            req.flash("failure","You are not allowed to access the page");
            res.redirect("/listings");
        }

    
    }catch(err){
        console.log(err);
    }
}

module.exports.getApprove = async(req,res) =>{
    try{
            const ApprovedListing = await Listing.find({approved:true});
            req.admin = true;
            res.render("./user/admin/aAppIndex.ejs",{AppListing:ApprovedListing,admin:req.admin});

    
    }catch(err){
        console.log(err);
    }
}

module.exports.adminLogin = async (req,res) =>{
    res.render("./user/admin/aLogin");
}