const Siteweb = require("./siteweb")

const ModelContenido = require("../model/contenido")

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on("reload_request", function(obj){

	var new_entrada = obj.generate_last_entrada()
	var lasted = obj.last_entrada()
	console.log(obj.id)
	if (lasted === undefined ){
		console.log(lasted)
		obj.generate_all_entrada().then(function(){console.log("guardado")})
	}
	else if (lasted.title == new_entrada.title){
		console.log("NO hay nuevos contenidos")
	}
	else if (lasted.title != new_entrada.title){
		console.log("HAY NUEVO CONTENIDO")
		obj.add_entrada(new_entrada)

	}

})

myEmitter.on("error_", function(err){
	console.log(err)
})

exports.cargaSitio = function  (Blogs){
	var promise = new Promise(function(resolve, reeject){
		var query = ModelContenido.find({})
		query.exec(function(err, result){
			var sitios = result.map(function(elem, index, array){
				let sitio = new Siteweb(elem.id, elem.site, elem.tag_title, elem.tag_link, elem.tag_date, elem.request_body, elem.entradas)
				Blogs.add_site(sitio)
			})
			resolve()
		})		

	})
	return promise
}

exports.actualizar = function(Blogs){
	var promesa = new Promise(function(resolve, reeject){
		let all_blog = Blogs.get_lista()
		all_blog.map(function(elem, i, array){
			elem.reload_request(myEmitter)
		})
		resolve()
		
	})
	return promesa
}


exports.add_new_entradas = function(Blogs){
	let all_blog = Blogs.get_lista()
	all_blog.map(function(elem){
		//console.log(elem.request_body ? "existe":  "NO hay")
		var new_entrada = ele
	})
}

exports.save = function(Blogs){
	var sitios = Blogs.get_lista()
	for (var i = 0; i < sitios.length; i++) {
		sitios[i].save_in_db()
	}
}