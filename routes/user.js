const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const isLoggedin = require("../middleware");
const {saveRedirectUrl} = require("../middleware");
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


router.get("/logout",userCont.logout)

module.exports = router;