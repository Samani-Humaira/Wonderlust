const express = require("express");
const router = express.Router();
const userCont = require("../controllers/user");
const {isAdmin} = require("../middleware");

router.get("/",(req,res) =>{
    res.render("./user/admin");
});

router.post("/adminLogin",
    // isAdmin,
    userCont.adminLogin
);

module.exports = router;