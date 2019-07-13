const express 			= require('express'),
 	  app 	  			= express(),
 	  bodyParser		= require('body-parser'),
	  mong 	  			= require('mongoose'),
	  Campground		= require('./models/campground'),
	  seedDB			= require("./seeds"),
	  flash				= require("connect-flash"),
	  Comments			= require("./models/comment"),
	  passport			= require("passport"),
	  localStrategy		= require("passport-local"),
	  User				= require("./models/user"),
	  commentsRoutes 	= require("./routes/comments"),
	  methodOverride	= require("method-override"),
	  campgroundRoutes	= require("./routes/campground"),
	  indexRoutes		= require("./routes/index");

mong.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
mong.set('useFindAndModify', false);
app.use(flash());
// seed the database ---> seedDB();

//passport config
app.use(require("express-session")({
	secret: "No one will break this code",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);




app.listen(2468,()=>{
	console.log('yelpCamp server has started');
});

