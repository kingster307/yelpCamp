const mong = require('mongoose'); 

//create schema --> structure for data 
let commentSchema = mong.Schema({
	text: String,
	author: {
		id: {
			type: mong.Schema.Types.ObjectId,
			ref: "User",
		},
		username: String ,
	},
});



//exporting schema model --> model has ODM(Object Document Mapper) methods that can be used
module.exports = mong.model("Comment", commentSchema);