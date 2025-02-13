if(process.env.NODE_ENV != "production") {
require('dotenv').config()
}


const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const selectOptions = require("./routes/selectOptions.js");
const adminRouter = require("./routes/admin.js");

app.set("view engine","ejs");
app.engine("ejs",ejsMate)
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

//changes feb 25

main()
.then(res => console.log("mongoose connected"))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://hummasamani:z3p2DpEYicuSlpx5@cluster0.gyy0kgm.mongodb.net/Wonderlust?retryWrites=true&w=majority&appName=Cluster0');
}

const sessionOptions = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    expires : Date.now() + 7 * 24 * 60 * 1000 ,
    maxAge : 7 * 24 * 60 * 1000,
    httpOnly: true ,
}

};

app.use(session(sessionOptions));

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));  
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.currUser = req.user;
    next();
});

// checking working of APi's
app.get("/home",(req,res) =>{

});

app.use("/listings/find", selectOptions);
app.use('/admin',adminRouter);
app.use("/",userRouter);
app.use("/listings", listingRouter);

app.use("/listings/:id",reviewRouter);

app.get("/Reserve",(req,res) =>{
    res.render("")
});

app.get("/",async (req,res) =>{
    
    const listing = await Listing.aggregate([
        { $sample: { size: 4} }
      ]);
      
    res.render("./listing/Home",{listing,isIndex:true});
})

app.post("/Reserve",(req,res) =>{
    let {name,email,country,phoneNumber} = req.body;

    console.log("Booking done");
});

app.listen(3000,(req,res) =>{
    console.log(`app is running on port 3000`);
});