const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
// const campground = require("../models/campground");

//INDEX - Show all Campgrounds
router.get("/campgrounds", function(req, res){
    Campground.find(function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

//NEW - Show form to create new Campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

//CREATE - Add new Campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image:image, description: description, author: author};
    Campground.create(newCampground, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("campgrounds");
        }
    });
});

//SHOW - Shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT ROUTE - Shows Form for Editing Campground
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("./campgrounds/edit", {campground: foundCampground});    
    });  
});

//UPDATE ROUTE - Updates Campground
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY ROUTE - Deletes Campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findOneAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds"); 
        }
    });
});

module.exports = router;