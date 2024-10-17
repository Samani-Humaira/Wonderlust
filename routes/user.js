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

router.get("/admin",(req,res) =>{
    res.render("./user/admin");
})
router.post("/adminLogin",
    userCont.adminLogin
);

router.route('/unApprovedListings')
.get(userCont.getUnapprove);

router.get("/logout",userCont.logout)

module.exports = router;