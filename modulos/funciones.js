const Siteweb = require("./siteweb")
const Entrada = require("./entrada")

const ModelBlog = require("../model/blog")
exports.cargaSitio = function  (blogs){
	var promise = new Promise(function(resolve, reeject){
		var query = ModelBlog.find({})
		query.select('site tag_title tag_link_article tag_date')
		query.exec(function(err, result){
			var sitios_webs = result.map(function(sitio, index, array){
				var new_sitio = new Siteweb(index+1, sitio.site, sitio.tag_title, sitio.tag_link_article, sitio.tag_date)
				blogs.addblog(new_sitio)
				if (index == array.length-1){
					console.log(sitio.tag_link_article)
					resolve()
				}
			})
		})

	})
	return promise
}

const articulos = require("../model/datos_articulos")
exports.cargarEntradas = function (blogs){
	var promise = new Promise(function(resolve, reeject){
		var query = articulos.find({})
		query.exec(function(err, result){
			var entradas = result.map(function(rentrada, index, array){

				var entrada = new Entrada(index+1, rentrada.title, rentrada.link_article, rentrada.site)
				site_web = blogs.search(rentrada.site)
				site_web.addentradas(entrada)
				//console.log(entrada)
				if (index == array.length -1){
					// Actualizar el valor de la las entradas this.max_id_entrada = 0
					blogs.actualizar_valor_entradas()
					resolve()
				}

			})
		})	
		
	})
	return promise
}

const request = require("request")
exports.request = function(blog){
	var name = blog.name
	var promise = new Promise(function(resolve, reeject){
		console.log(name)
		request(name,function(err, response){
			if (err) { console.log(err)}
			resolve(response)
		})
		
	})
	return promise
}

const cheerio = require("cheerio")
exports.buscar_entradas = function(request,blog){
	console.log("BUscar entradas")
	var tag_title = blog.tag_title
	var tag_link = blog.tag_link
	var tag_date = blog.tag_date
	var promise = new Promise(function(resolve, reeject){

		$ = cheerio.load(request.body);

		var array_title = []
		$(tag_title).each(function(i, elem) {
  			array_title[i] = $(this).text();
		});
		
		
		var array_link_article = []
		$(tag_link).each(function(i, elem){
			array_link_article[i] = $(this).attr("href")
		})
		//console.log(array_link_article)

		var array_date =[]
		$(tag_date).each(function(i, elem){
			array_date[i] = $(this).text()
		})

		var array_article = []

		for (var i = 0; i < array_title.length; i++) {
			var siteweb = {}
			siteweb.title = array_title[i]
			siteweb.link_article = array_link_article[i]
			siteweb.date = array_date[i]
			array_article.push(siteweb)
			if (i == array_title.length -1) {
  				//console.log(array_article)
				resolve(array_article)

			}
		}
	})
	return promise

}

exports.añadir_entrada = function(array, id, blog){
	var lasted_id = id
	for (var i = 0; i < array.length; i++) {
		var entrada  = new Entrada(lasted_id, array[i].title, array[i].link_article, array[i].date)
		blog.addentradas(entrada)
		lasted_id++
	}
	console.log(blog.id)
}


exports.guardar_nuevos = function(blog){
	var nuevos = blog.nuevos()
	for (let elem of nuevos){
		var Oblog = blog.search_id(elem)
		console.log(Oblog)
	}

}

const NewCOllections = require("../model/contenido.js")

exports.exportar_a = function(blogs){
	//console.log(blogs.search_id(1))
	for (var i = 0; i < blogs.lista.length; i++) {
			var primer_blog = blogs.lista[i]
		var probando = new NewCOllections({
			site : primer_blog.name,
			tag_title : primer_blog.tag_title,
			tag_link : primer_blog.tag_link,
			tag_date : primer_blog.tag_date,
			entradas : primer_blog.entradas
		})
		probando.save(function (err,data) {
			if(err){
				return console.log(err)
			}
			console.log(data)
		})
	}
	//console.log(blog.search_id(1))
}

