const express 		= require('express'),
	  router		= express.Router({mergeParams: true}), //--> need this to pick up params from app.js use statement 
	  Campground	= require("../models/campground"),
	  Comments		= require("../models/comment"),
	  middleware	= require("../middleware");


//NEW Route
router.get("/new", middleware.isLoggedIn , (req,res)=>{
	Campground.findById(req.params.id, (err, dbObject) => {
		if(err){
			console.log(`Error: ${err}`);
		}else{
			// console.log(`Campground comment ----- ${dbObject}`);
			res.render('comments/new', {campground: dbObject});	
		}
	});	
});

//CREATE Route
router.post("/", middleware.isLoggedIn, (req,res) =>{
	Campground.findById(req.params.id, (err, campground) =>{
			if(err){
				console.log(`Error: ${err}`);
				res.redirect('/campgrounds');
			}else{
				Comments.create(req.body.comment, (err, comment)=>{
					if(err){
						req.flash("error", "something went wrong");
						console.log(`Error: ${err}`);
					}else{
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						comment.save();
						// console.log(`this is what your looking for ${comment}`);
						campground.comments.push(comment); // creating comment then using the return to push it into the array of objects stored in other collection
						campground.save();
						req.flash("success", "Successfully added a comment");
						res.redirect(`/campgrounds/${campground._id}`);
					}
				});
			}
	});
	
});
//Comments edit comment
router.get("/:comment_id/edit", middleware.checkEditOwnership, (req, res)=>{
	Comments.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			console.log(`Error: ${err}`);
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});	
		}
	});
});

//UPDATE route 
router.put("/:comment_id", middleware.checkEditOwnership, (req,res)=>{
	Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComments)=>{
		if(err){
			console.log(`Error: ${err}`);
			res.redirect("back");
		}else{
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

//comment DESTROY route 
router.delete("/:comment_id", middleware.checkEditOwnership, (req, res)=>{
	Comments.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			console.log(`Error: ${err}`);
			res.redirect("back");
		}else{
			req.flash("sucess", "Comment Deleted");
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});


module.exports = router;