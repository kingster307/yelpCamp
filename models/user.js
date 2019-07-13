 const mong 					= require('mongoose'),
	   passportLocalMongoose 	= require("passport-local-mongoose");

const userSchema = new mong.Schema({
	username: String,
	password: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mong.model("User", userSchema);