const Siteweb = require("./modulos/siteweb")

const ModelContenido = require("./model/contenido")

const Blogs = require("./modulos/blogs")

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogs');


var cargaSitio = function  (blogs){
	var promise = new Promise(function(resolve, reeject){
		var query = ModelContenido.find({id:11})

		query.exec(function(err, result){
			let sitio = result[0]
		 	var new_sitio = new Siteweb(sitio.id, sitio.site, sitio.tag_title, sitio.tag_link, sitio.tag_date, sitio.hash_request ,sitio.request_body, sitio.entradas)
			//console.log(new_sitio)
			resolve()
		})


	})
	return promise
}

cargaSitio(Blogs)
	.then(function(){
		console.log("Hecho")
	})