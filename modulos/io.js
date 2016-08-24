const async = require("async")
const articulos = require("./descarga")
const ModelBlog = require("../model/blog")

module.exports = function(io){
	io.on('connection', function(socket){
		console.log("Alguien COnectado")
		socket.emit("mensaje", {hola: "jonatan"})

		socket.on("datos_sitio_web", function(data){
			articulos.get_html__getInfo(data, function(err, result){
					//console.log("result callback "+result)
					socket.emit("respuesta_request", result)
			})
		})

		/*
		 GUARDA DATOS DEL BLOG
		*/

		socket.on("guardar_datos", function(data){
			if (data.site.slice(0,4) != "http" ) {
				data.site = "http://"+data.site
			}
			var prueba = new ModelBlog({
				site : data.site,
				title : data.title,
				link_article : data.link_article,
				date : data.date,
				tag_title : data.tagtitle,
				tag_link_article : data.tag_link_article,
				tag_date : data.tag_date
			})
			prueba.save(function(err){
				if (err) { console.log("error")}
				console.log("Nuevo articulo añadido a la BD: "+ data.site )
				socket.emit("datos_guardados_OK", {res: "OK"})


			})
		})

		/*
				ACTUALIZA BASE DE DATOS
		*/
		socket.on("actualiza", function(err){
			var query = ModelBlog.find({})
			query.select('site tag_title tag_link_article tag_date')
			query.exec(function(err, result){
				//console.log(result)
				async.map(result, 
					function (result, callback) {
						articulos.inicia(result, callback)
					}, 
					function(err, result){
						console.log("Blogs Actuzalizados")
						//console.log(result)
						socket.emit("actuzalidado", {datos: result})
					}
				)
			})		
		})
	})
}
