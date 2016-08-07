const request = require("request")
const cheerio = require("cheerio")
const async = require("async")
const ModelBlog = require("../model/blog")
const datas_articles = require(("../model/datos_articulos"))
/*
		 BUSCA TODOS LOS BLOGS
*/

exports.buscar = function(){
	var promise = new Promise(function(resolve, reject){
		var datos = []
		var query = ModelBlog.find({})
		query.select('site')
		query.exec(function(err, result){
			result.forEach(function(i, elem){
				//sites.push(result)
				//console.log(result[elem].site)
				datas_articles.
					find({}).
					where("site").in(result[elem].site).
					limit(1).
					exec(function(err, data){
						//console.log(data)
						datos.push(data[0])
						if (elem == result.length -1 ) {
							console.log("termina")
							console.log(datos)
							resolve(datos)
						}
					})

			})
		})

	})

	return promise
}



exports.guarda = function(data){
			var prueba = new ModelBlog({
				site : response_getInfo.name,
				title : response_getInfo.title,
				link_article : response_getInfo.link_article,
				date : response_getInfo.date,
				tagtitle : response_getInfo.tagtitle,
				tag_link_article : response_getInfo.tag_link_article,
				tag_date : response_getInfo.tag_date
			})
			prueba.save(function(err){
				if (err) { console.log("error")}
				console.log("Nuevo articulo añadido a la BD: " +response_getInfo.name)
				callback(null, response_getInfo)
			})
}

/*
	DEVUELVE DATOS DE UNA WEB

*/
exports.get_html__getInfo = function (array, callback) {
	async.waterfall(
		[
			function (callback){
				//console.log(array)
				get_html(array, callback)
			},
			function (response_descarga, callback){
				getInfo(array, response_descarga,  callback)
			}
		], 
		function(err, result){
			//console.log(result)
			callback(null, result)
	});
	//callback(null, null)
}
/*
	DESCARGA HTML, COGE ETIQUETAS Y GUARDA NUEVO CONTENIDO
*/

exports.inicia = function (array, callback) {
	//console.log(array)
	async.waterfall(
		[
			function (callback){
				//console.log(array)
				get_html(array, callback)
			},
			function (response_descarga, callback){
				getInfo(array, response_descarga,  callback)
			},
			function(response_getInfo, callback){
				comprueba(response_getInfo,  callback)
			}
		], 
		function(err, result){
			//console.log(result)
			callback(null, result)
	});
	//callback(null, null)
}


function get_html (site,callback){
	//console.log("get_html "+ site[0])
	//console.log(site.site)
	if (site.site.slice(0,4) != "http" ) {
		site.site = "http://"+site.site
	}
	//console.log(site.site)

	request(site.site,function(err, response){
		if (err) { console.log(err)}
		//console.log(response.request.uri.hostname)
		callback(null,  response)
	})
}



function getInfo(array, response_descarga, callback) {
	//console.log("getinfo: "+ array[1])
		$ = cheerio.load(response_descarga.body);

		var array_title = []
		$(array.tag_title).each(function(i, elem) {
  			array_title[i] = $(this).text();
		});
		//console.log(arrayTitlte)
		
		var array_link_article = []
		$(array.tag_link_article).each(function(i, elem){
			array_link_article[i] = $(this).attr("href")
		})
		//console.log(array_link_article)

		var array_date =[]
		$(array.tag_date).each(function(i, elem){
			array_date[i] = $(this).text()
		})
		//console.log(array_date)
		

		//var date = $(array.tag_date).first().html()
		//var link_article = $(array.tag_link_article).first().attr('href')
		//var title = $(array.tag_title).text()
		var array_article = []

		for (var i = 0; i < array_title.length; i++) {
			var siteweb = {}
			siteweb.name = response_descarga.request.uri.hostname
			siteweb.title = array_title[i]
			siteweb.link_article = array_link_article[i]
			siteweb.date = array_date[i]
			siteweb.tagtitle = array.tag_title
			siteweb.tag_link_article = array.tag_link_article
			siteweb.tag_date = array.tag_date
			array_article.push(siteweb)
			if (i == array_title.length -1) {
				//console.log(array_article)
				callback(null, array_article)

			}
		}



}

function comprueba(response_getInfo, callback) {
	//console.log("COMPURBEA "+ response_getInfo[0].title)

	response_getInfo.forEach(function(i, elem){
		//console.log(response_getInfo[elem])

		datas_articles.findOne({title: response_getInfo[elem].title}, function(err, data){
			if (data) {
				console.log("El articulo ya existe: " +data.site)
				//callback(null, null)
			}
			else{
				var prueba = new datas_articles({
					site : response_getInfo[elem].name,
					title : response_getInfo[elem].title,
					link_article : response_getInfo[elem].link_article,
					date : response_getInfo[elem].date,
					//tagtitle : response_getInfo[elem].tagtitle,
					//tag_link_article : response_getInfo[elem].tag_link_article,
					//tag_date : response_getInfo[elem].tag_date
				})
				prueba.save(function(err){
					if (err) { console.log("error")}
					console.log("Nuevo articulo añadido a la BD: " +response_getInfo[elem].name)
				})
				
			}
		})
		if (elem == response_getInfo.length -1 ) {
			console.log("ES EL ULTIMO")
			callback(null, response_getInfo)
		}
	})
}
