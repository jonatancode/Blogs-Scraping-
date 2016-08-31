const Siteweb = require("./siteweb")

const ModelContenido = require("../model/contenido")

exports.cargaSitio = function  (blogs){
	var promise = new Promise(function(resolve, reeject){
		var query = ModelContenido.find({})
		query.exec(function(err, result){
			var sitios_webs = result.map(function(sitio, index, array){
				let hash = sitio.hash_request.toString()
				var new_sitio = new Siteweb(sitio.id, sitio.site, sitio.tag_title, sitio.tag_link, sitio.tag_date, hash ,sitio.entradas)
				// Actuzalizamos el request
				new_sitio.actualizar_request()
				.then(function(result){
					let new_hash_code = new_sitio.generateHashCode()
					if (new_hash_code == new_sitio.hash_request) {
						console.log("NO hay nuevos datos")
					}
					else{
						let lasted_article = new_sitio.get_lasted_article()
						new_sitio.save_articulo(lasted_article)
					}
				})


				blogs.addblog(new_sitio)

				if (index == array.length-1){
					blogs.actualizar_valor_entradas()
					//console.log(new_sitio)
					resolve()
				}
			})
		})

	})
	return promise
}

exports.actualizar = function(Blogs){
	var promesa = new Promise(function(resolve, reeject){
		var all_blogs = Blogs.get_lista()
		for (var i = 0; i < all_blogs.length; i++) {
			console.log("ACTUALIZANDO...", i)
			all_blogs[i].actualizar_request().then(function(result){
				if ( result == "stop"){
					console.log("No hay nuevo contenido\nSitio: ", all_blogs[i].id)

				}else{
					//console.log("Hay nuevo contenido")
					var new_entrada = all_blogs[i].get_lasted_article()
					all_blogs[i].save_articulo(Blogs, new_entrada)
				}
			})
			 if (i == all_blogs.length -1 ) {
				console.log("Fin de la actulizacion")
			 	resolve()
			 }
		}	
	})
	return promesa
	
}


exports.save = function(Blogs){
	var sitios = Blogs.get_lista()
	for (var i = 0; i < sitios.length; i++) {
		sitios[i].save()
	}
}