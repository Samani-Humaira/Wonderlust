const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const isLoggedin = require("../middleware");
const {saveRedirectUrl,isAdmin} = require("../middleware");
const userCont = require("../controllers/user");

router.route("/signup")
.get(userCont.getsign)
.post(wrapAsync(userCont.postsign));


router.route("/login")
.get(userCont.getLogin)
.post(
    saveRedirectUrl,
    passport.authenticate("local" ,{
        failureFlash : true,
    failureRedirect : "/login",
}), 
userCont.postLogin);


router.post("/adminLogin",
    userCont.adminLogin
);

router.route('/unApprovedListings')
.get(
    // isAdmin,
    userCont.getUnapprove
)
;

router.route('/ApprovedListings')
.get(
    // isAdmin,
    userCont.getApprove
);

router.get("/logout",userCont.logout)

// Route for showing the verification page
router.get('/verify', (req, res) => {
    res.render('verify');
  });
  
  // Route to handle the code validation
  router.post('/verify', (req, res) => {
    const { code } = req.body;
  
    // Check if the verification code exists and has not expired
    if (!req.session.verificationCode || Date.now() > req.session.codeExpiry) {
      req.flash('error', 'The verification code has expired.');
      return res.redirect('/login');
    }
  
    // Check if the entered code matches the generated code
    if (code === req.session.verificationCode) {
      // Code is valid, clear the session data and proceed
      delete req.session.verificationCode;
      delete req.session.codeExpiry;
  
      req.flash('success', 'Code verified! Welcome back.');
      return res.redirect(req.session.redirectUrl || '/listings');
    }
  
    // Code is invalid
    req.flash('error', 'Invalid code. Please try again.');
    res.redirect('/verify');
  });
  

module.exports = router;