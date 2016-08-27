const async = require("async")
const articulos = require("./descarga")
const ModelBlog = require("../model/blog")


const Siteweb = require("./siteweb")
const Entrada = require("./entrada")

const Funciones = require("./funciones")


module.exports = function(io, blogs){
	io.on('connection', function(socket){
		console.log("Alguien COnectado")
		socket.emit("mensaje", {hola: "jonatan"})

		socket.on("datos_sitio_web", function(data){
			console.log(data)
			articulos.get_html__getInfo(data, function(err, result){
					//console.log("result callback "+result)
					socket.emit("respuesta_request", result)
			})
		})

		/*
		 GUARDA DATOS DEL BLOG
		*/

		socket.on("guardar_datos", function(data){
			/*
				GUARDAR EN EL OBJETO
			*/
			var lasted_id = blogs.get_max_id_site_web()
			var new_blog = new Siteweb(lasted_id+1, data.site, data.tagtitle, data.tag_link_article, data.tag_date)
			blogs.new_blog(new_blog)

			var request = Funciones.request(new_blog)

			request.then(function(result){
				console.log("request")
				Funciones.buscar_entradas(result, new_blog)
					.then(function(result){
						var id_lastesd =  blogs.get_max_id_entrada()
						Funciones.añadir_entrada(result, id_lastesd, new_blog)
						console.log("Entradas:", blogs.get_max_id_entrada())
						console.log("SItio:",blogs.get_max_id_site_web())
						console.log(new_blog.info())
						socket.emit("datos_guardados_OK", {res: "OK"})
					})
			})
			//console.log(blogs.vacio())
			/*
			http://www.caceriadespammers.com.ar/
			.post-title.entry-title
			.post-title.entry-title a
			.date-header
			*/
			//id, name, tag_title, tag_link, tag_date){
			/*if (data.site.slice(0,4) != "http" ) {
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


			})*/
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
