const async = require("async")

const Siteweb = require("./siteweb")

const Funciones = require("./funciones")

/* 
	Antes de guardar en el objeto Blogs = All_Blogs
*/
var new_sitio = ""

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();


module.exports = function(io, Blogs){
	io.on('connection', function(socket){
		console.log("Alguien COnectado")
		socket.emit("mensaje", {hola: "jonatan"})

		socket.on("datos_sitio_web", function(data){
			console.log("Datos nuevo sitio", data)
			new_sitio = ""
			new_sitio = new Siteweb( 0 , data.site, data.tag_title, data.tag_link, data.tag_date)

			new_sitio.reload_request()
			 .then(function(){
				var ultima_entrada = new_sitio.generate_last_entrada()
				console.log("NUevo sitio")
				socket.emit("respuesta_request", ultima_entrada)
				
			})
		})

		socket.on("save_new_site", function(){
			let lasted_id = Blogs.get_max_id_site_web()
			new_sitio.set_id(lasted_id+1)
			Blogs.new_site(new_sitio)
			console.log("Este es el ultimo id", lasted_id)
			new_sitio.generate_all_entrada()
			console.log("Entradas generadas", new_sitio.id)
			
		})

		/*
				ACTUALIZA
		*/

		socket.on("actualiza", function(data){	

			Funciones.actualizar(Blogs).then(function(){
			 	socket.emit("res_actuzaliza")
			 })

		})
		/*

			SAVE ALL DB
		*/
		socket.on("save", function(){
			Funciones.save(Blogs)
			socket.emit("res_save", {res: "OK"})
				

		})
	})
}
