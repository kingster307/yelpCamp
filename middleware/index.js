const Campground	= require("../models/campground"),
	  Comments		= require("../models/comment");

let middlewareObj ={};

middlewareObj.checkCampgroundOwnership = (req, res, next)=>{
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground)=>{
		if(err){
			console.log(`Error - ${err}`);
			return res.render("back");
		}
		if(foundCampground.author.id.equals(req.user._id)){
			// res.render("campgrounds/edit", {campground: foundCampground });
			next();
		}else{
			req.flash("error", "You dont have proper permissions to do that");
			res.redirect("back");
		}
	});
		
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}	
};

	
middlewareObj.checkEditOwnership = (req, res, next)=>{
	if(req.isAuthenticated()){ 
		
		Campground.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			req.flash("error", "Campground not found");
			console.log(`Error - ${err}`);
			return res.render("back");
		}
		if(foundComment.author.id.equals(req.user._id)){
			// res.render("campgrounds/edit", {campground: foundCampground });		
			next();
		}else{
			req.flash("error", "You dont have proper permissions to do that");
			res.redirect("back");
		}
	});
		
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
	
};

middlewareObj.isLoggedIn = (req, res, next)=>{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;

