const express 		= require('express'),
	  router		= express.Router(),
	  passport			= require("passport"),
	  User			= require("../models/user"),
	  middleware	= require("../middleware");


//root route
router.get("/", (req,res)=>{
	res.render('landing');
});


// AUTH routes

// SHOW register form
router.get("/register", (req,res)=>{
	res.render("register");
});

//Create New user
router.post("/register", (req, res)=>{
	User.register(new User({username: req.body.username}), req.body.password, (err,user)=>{
		if(err){
			console.log(`Error: ${err}`);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, ()=>{
			req.flash(`success", "Welcome to YelpCamp ${user.username}`);
			res.redirect("/campgrounds");
		});
	});
});

//SHOW login form 
router.get("/login", (req, res)=>{
	res.render("login");
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds", 
		failureRedirect: "/login",
	}),(req, res)=>{
});

// logout route
router.get("/logout", (req, res)=>{
	req.logout();
	req.flash("success", "You have logged out");
	res.redirect("/campgrounds");
});

module.exports = router;