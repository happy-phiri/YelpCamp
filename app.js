const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");
const mongoose = require("mongoose");

//Requiring Routes
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelpcampDB", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //Seed the Database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Am not ready to quit.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})