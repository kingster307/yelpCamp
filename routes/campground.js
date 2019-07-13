const express 		= require('express'),
	  router		= express.Router(),
	  Campground	= require("../models/campground"),
	  middleware	= require("../middleware");



// INDEX route - show all campgrounds
router.get('/', (req,res) => {
	
	// get all campgrounds from db 
	Campground.find({}, (err, allCampgrounds)=>{
		if(err){
			console.log(`error: ${err}`);
		}else{
			// then render file
			res.render("campgrounds/index", {campground: allCampgrounds});
		}				
	});
});

// CREATE add new campgrounds to db
router.post("/", middleware.isLoggedIn, (req,res)=>{
	
	// get data from form && add to campgrounds array redirect to campgrounds page
	
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username,
	};
	var newCampground = {name: name, image: image, description: description, author: author};
	// no longer works without array
	// campgrounds.push(newCampground); 
	
	// create new campground & push into db
	Campground.create(newCampground, (err,newCampsites)=>{
		if(err){
			console.log(`error: ${err}`);
		}else{
			res.redirect("/campgrounds");		
		}
	});
	
});

// NEW Route
router.get("/new", middleware.isLoggedIn, (req, res) =>{
	res.render('campgrounds/new');
});  

// SHOW - shows more info about 1 campground
router.get("/:id", (req,res)=>{
	// find the campground with provided id
		Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
		if(err){
			console.log(`error: ${err}`);
			// res.send('<srcipt>alert("invalid entry")</srcipt>');
			res.redirect('/campgrounds');
		}else{
			// console.log(`after reference population: ${foundCampground}`);
			// render show template with that item 
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});


//EDIT 
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
		Campground.findById(req.params.id, (err, foundCampground)=>{
			res.render("campgrounds/edit", {campground: foundCampground });		
	});
		
});


//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if(err){
			console.log(`Error: ${err}`);
			return res.redirect('/campgrounds');
		}
		res.redirect(`/campgrounds/${req.params.id}`);
	});
});

//DESTROY ---> doesnt delete the associated comments from comments collection, just deletes the association
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
		console.log(`Error: ${err}`);
		}
		res.redirect("/campgrounds");
	});
});


module.exports = router;