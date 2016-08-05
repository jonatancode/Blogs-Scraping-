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

exports.inicia = function (array, callback) {
	console.log(array)
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
	console.log(site.site)
	if (site.site.slice(0,4) != "http" ) {
		site.site = "http://"+site.site
	}
	console.log(site.site)

	request(site.site,function(err, response){
		if (err) { console.log(err)}
		//console.log(response.request.uri.hostname)
		callback(null,  response)
	})
}



function getInfo(array, response_descarga, callback) {
	//console.log("getinfo: "+ array[1])
		$ = cheerio.load(response_descarga.body);

		var title = $(array.tag_title).first().text()
		var link_article = $(array.tag_link_article).first().attr('href')
		console.log(link_article)
		var date = $(array.tag_date).first().html()


		var siteweb = {}
		siteweb.name = response_descarga.request.uri.hostname
		siteweb.title = title
		siteweb.tagtitle = array.tag_title
		siteweb.link_article = link_article
		siteweb.tag_link_article = array.tag_link_article
		siteweb.date = date
		siteweb.tag_date = array.tag_date

		callback(null, siteweb)
}

function comprueba(response_getInfo, callback) {
	//console.log("COMPURBEA "+ response_getInfo.name)
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
	})
}


exports.promesa = function(data){
	//console.log("promesa "+data)
	var promise = new Promise(function(resolve, reject){
		async.waterfall(
			[
				function (callback){
					//console.log(array)
					get_html(data, callback)
				},
				function (response_descarga, callback){
					getInfo(data, response_descarga,  callback)
				},

			], 
			function(err, result){
				resolve(result)
		});
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