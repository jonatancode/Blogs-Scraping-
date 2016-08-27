var mongoose = require("mongoose")
var Schema = mongoose.Schema

var blog = new Schema({
	site : String,
	tag_title : String,
	tag_link : String,
	tag_date : String,
	entradas : Array

})

var objBlog = mongoose.model('contenido', blog);

module.exports = objBlog;