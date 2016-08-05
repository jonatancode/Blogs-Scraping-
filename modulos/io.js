const request = require("request")
const cheerio = require("cheerio")
const async = require("async")
const articulos = require("./descarga")
const ModelBlog = require("../model/blog")

module.exports = function(io){
	io.on('connection', function(socket){
		console.log("Alguien COnectado")
		socket.emit("mensaje", {hola: "jonatan"})

		socket.on("datos_sitio_web", function(data){
			articulos.promesa(data).then(
				function(result){
					console.log(result)
					socket.emit("respuesta_request", result)
				})
		})

		/*
		 GUARDA DATOS DEL BLOG
		*/

		socket.on("guardar_datos", function(data){
			var prueba = new ModelBlog({
				site : data.name,
				title : data.title,
				link_article : data.link_article,
				date : data.date
			})
			prueba.save(function(err){
				if (err) { console.log("error")}
				console.log("Nuevo articulo añadido a la BD: "  )
			})
		})
	})
}
