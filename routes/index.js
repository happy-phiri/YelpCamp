const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//LANDING PAGE
router.get("/", function(req, res){
    res.render("landing");
});

//Show registration form
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//Handle Login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){

});

//Logout Logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully Logged Out!");
    res.redirect("/campgrounds");
});

module.exports = router;