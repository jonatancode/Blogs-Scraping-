const async = require("async")

const Siteweb = require("./siteweb")

const Funciones = require("./funciones")

/* 
	Antes de guardar en el objeto Blogs = All_Blogs
*/
var new_sitio = ""

module.exports = function(io, Blogs){
	io.on('connection', function(socket){
		console.log("Alguien COnectado")
		socket.emit("mensaje", {hola: "jonatan"})

		socket.on("datos_sitio_web", function(data){
			//console.log(data)
			var lasted_id = Blogs.get_max_id_site_web()
			new_sitio = ""
			new_sitio = new Siteweb(lasted_id+1, data.site, data.tag_title, data.tag_link, data.tag_date)
			new_sitio.actualizar_request()
			 .then(function(result){
				var ultimo = new_sitio.get_lasted_article()
				console.log("despues de descargar")
				console.log(new_sitio.id)
				new_sitio.request_body = new_sitio.new_request_

				//console.log(new_sitio)
				socket.emit("respuesta_request", ultimo[0])
				
			})
		})

		socket.on("guardar_datos", function(){
			let id_site = new_sitio.id
			let id_entrada = Blogs.max_id_entrada
			new_sitio.all_get_articles(id_site, id_entrada)
			 .then(function(array){
			 	console.log(array.length)
				Blogs.new_blog(new_sitio)
				new_sitio.save_articulo(Blogs, array, socket)
				//socket.emit("datos_guardados_OK", {res: "OK"})
				
			})

			
		})

		/*
				ACTUALIZA BASE DE DATOS
		*/

		socket.on("actualiza", function(data){	

			Funciones.actualizar(Blogs).then(function(){
			 	socket.emit("res_actuzaliza")
			 })

		})

		socket.on("save", function(){
			Funciones.save(Blogs)
				socket.emit("res_save", {res: "OK"})
				

		})
	})
}
