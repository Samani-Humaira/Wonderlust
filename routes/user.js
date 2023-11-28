const express = require('express');
const router = express.Router();
let User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const {signUp , renderSignup , renderLoginForm , login ,logout } = require("../controllers/users.js");

router.route("/signUp")
    .get(renderSignup)
    .post(wrapAsync(signUp));

// router.get("/signUp",renderSignup);

// router.post("/signUp",wrapAsync(signUp));

router.route("/login")
    .get(renderLoginForm)
    .post(
      saveRedirectUrl, 
      passport.authenticate("local",{
      failureRedirect : '/login' , failureFlash: true
      }) 
    ,login
   );


// router.get("/login",renderLoginForm);

// router.post(
//    "/login",
//    saveRedirectUrl, 
//    passport.authenticate("local",{
//    failureRedirect : '/login' , failureFlash: true
//    }) 
//  ,login
// );

router.get("/logout",logout);

module.exports = router;