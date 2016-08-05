const request = require("request")
const cheerio = require("cheerio")
const async = require("async")
const ModelBlog = require("../model/blog")
/*
		 BUSCA TODOS LOS BLOGS
*/
exports.buscar = function(){
	var promise = new Promise(function(resolve, reject){

			ModelBlog.find({}, function(err, data){
				resolve(data)
			})
	})

	return promise
}


exports.busca_primer_articulo = function (response, callback) {
	console.log(response[0].request.uri.hostname)
}

exports.inicia = function (array, callback) {
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
			callback(null, result)
	});
	//callback(null, null)
}


function get_html (site,callback){
	console.log(site[0])
	request(site[0],function(err, response){
		if (err) { console.log(err)}
		console.log(response.request.uri.hostname)
		callback(null,  response)
	})
}



function getInfo(array, response_descarga, callback) {
	if (response_descarga === null) { callback(null, null) }
	if (array[1] == "") {
		response.title = "NUll"
		callback(null, response_descarga)
	}
		$ = cheerio.load(response_descarga.body);

		var title = $(array[1]).first().text()
		var link_article = $(array[1]).first().attr('href')
		var date = $(array[2]).first().html()


		var siteweb = {}
		siteweb.name = response_descarga.request.uri.hostname
		siteweb.title = title
		siteweb.link_article = link_article
		siteweb.date = date

		callback(null, siteweb)
}

function comprueba(response_getInfo, callback) {
	ModelBlog.findOne({title: response_getInfo.title}, function(err, data){
		if (data) {
			console.log("El articulo ya existe: " +data.site)
			callback(null, null)
		}
		else{
			var prueba = new ModelBlog({
				site : response_getInfo.name,
				title : response_getInfo.title,
				link_article : response_getInfo.link_article,
				date : response_getInfo.date
			})
			prueba.save(function(err){
				if (err) { console.log("error")}
				console.log("Nuevo articulo añadido a la BD: " +response_getInfo.name)
				callback(null, response_getInfo)
			})
			
		}
	})
}
