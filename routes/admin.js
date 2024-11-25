const express = require("express");
const router = express.Router();
const userCont = require("../controllers/user");
const {isAdmin} = require("../middleware");

router.get("/",(req,res) =>{
    const { email, password } = req.body;

    // Check if the email and password match the admin credentials
    // if (email == "admin@gmail.com" && password == "12as!@AS") {
    //     // If correct, redirect to the admin page
        res.render("./user/admin/aLogin");
    // } else {
        // If incorrect, flash a message and redirect to the home page
        // req.flash('error', 'Wrong details. Please try again.');
        // res.redirect('/admin/adminLogin');  // Redirect to the homepage
    // }
});

// router.post("/Home",(req,res) =>{
//     const { email, password } = req.body;

//     // Check if the email and password match the admin credentials
//     // if (email === "admin@gmail.com" && password === "12as!@AS") {
//         // If correct, redirect to the admin page
//         res.render("");
    
// });

router.get("/approved",
    userCont.getApprove
);

router.post("/Home",
    userCont.getUnapprove
);

module.exports = router;