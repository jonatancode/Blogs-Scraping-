var mongoose = require("mongoose")
var Schema = mongoose.Schema

var blog = new Schema({
	site : String,
	title : String,
	date : String,
	link_article : String
})

var objBlog = mongoose.model('blogs', blog);

module.exports = objBlog;