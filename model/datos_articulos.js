var mongoose = require("mongoose")
var Schema = mongoose.Schema

var article = new Schema({
	site : String,
	title : String,
	date : String,
	link_article : String
})

var objBlog = mongoose.model('data_articles', article);

module.exports = objBlog;