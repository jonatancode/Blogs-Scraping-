var mongoose = require("mongoose")
var Schema = mongoose.Schema

var blog = new Schema({
	id: Number,
	site : String,
	tag_title : String,
	tag_link : String,
	tag_date : String,
	entradas : Array,
	hash_request : String,
	request_body : String,


})

var objBlog = mongoose.model('contenido', blog);

module.exports = objBlog;