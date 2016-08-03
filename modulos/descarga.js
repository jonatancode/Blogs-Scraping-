const request = require("request")
const cheerio = require("cheerio")
const async = require("async")
const ModelBlog = require("../model/blog")
const descarga = require("./descarga")

exports.descarga = function(asyncsCallback){
	async.parallel([
		function flaviocorpa (callback){
			ejecuta("http://www.flaviocorpa.com/","ol li",callback)
		},
		function debianhackers (callback){
			ejecuta("https://debianhackers.net/", ".post-header",callback)
		},
		function capacityacademy (callback){
			ejecuta("http://blog.capacityacademy.com/",".entry-header",callback)
		},
		function securitybydefault (callback){
			ejecuta("http://www.securitybydefault.com/", ".bposttitle",callback)
		},
		function elclubdelprogramador (callback){
			ejecuta("http://www.elclubdelprogramador.com/", ".post-content-body",callback)
		},
		function muylinux (callback){
			ejecuta("http://www.muylinux.com/",".entry-title",callback)
		},
		function dragonjar (callback){
			ejecuta("http://www.dragonjar.org/",".et-description",callback)
		},
		function carlosazaustre (callback){
			ejecuta("https://carlosazaustre.es/blog/",".Post-item-header",callback)
		},
		function etnassoft (callback){
			ejecuta("http://www.etnassoft.com/",".entry-title",callback)
		},
		function desdelinux (callback){
			ejecuta("http://blog.desdelinux.net/",".entry-title.td-module-title",callback)
		},
		function nebul4ck (callback){
			ejecuta("https://nebul4ck.wordpress.com/how-to/", "h2",callback)
		},
		function picandocodigo (callback){
			ejecuta("http://picandocodigo.net/",".post-title", callback)
		},
		function barrapunto (callback){
			ejecuta("http://barrapunto.com/", ".generaltitle",callback)
		},
		function robustiana(callback){
			ejecuta("http://robustiana.com/", ".catItemHeader", callback)
		},
		function nursoft(callback){
			ejecuta("http://blog.nursoft.cl/", ".post-header", callback)
		},
		function itblogsogeti(callback){
			ejecuta("https://itblogsogeti.com/", ".sticky-header", callback)
		},
		function hexacta(callback){
			ejecuta("http://hat.hexacta.com/", "h2", callback)
		},
		function pensandoensoa(callback){
			ejecuta("https://pensandoensoa.com/",".entry-title", callback)
		},
		function arquitecturajava(callback){
			ejecuta("http://www.arquitecturajava.com/", ".title", callback)
		},
		function miguelra(callback){
			ejecuta("https://elrinconde.miguelra.com/articulos/", ".post-content .entry-title", callback)
		},
		function (callback){
			ejecuta("http://blog.koalite.com/archive/", ".post-list li", callback)
		},
		function (callback){
			ejecuta("http://www.dbigcloud.com/", ".article-header.clearfix", callback)
		}

	], function(err, results) {
		//res.locals.sitiosweb = results
		console.log(results.length)
		asyncsCallback(null, results)
		
	});
}

/*
http://blog.nursoft.cl/
*/
function getResponse (site,callback){
	request(site,function(err, response){
		if (err) { console.log(err)}
		//console.log(response.request.uri.hostname)
		callback(null, response)
	})
}

function getFirstArticle(response, tag, callback){
	$ = cheerio.load(response.body);
	var articulo = $(tag).first().html()
	var siteweb = {}
	siteweb.body = articulo
	siteweb.name = response.request.uri.hostname
	//console.log(siteweb)

	callback(null, siteweb)
}

function busca_content(response, callback){
	ModelBlog.findOne({content: response.body}, function(err, data){
		if (data) {
			console.log("Existe: " +data.site)
			callback(null, null)
		}
		else{
			console.log("No existe: " +response.name)
			callback(null, response)
		}
	})
}

function ejecuta(site, tag, asyncsCallback){
	var site = site;
	var tag = tag

	async.waterfall([
		function (callback){
			getResponse(site, callback)
		},
		function (response, callback){
			getFirstArticle(response, tag, callback)
		},
		function(response,callback){
			busca_content(response, callback)
		}
	], function(err, result){
		asyncsCallback(null, result)
	});
}



exports.guarda = function(result_descrgar, callback){
	var articulos = result_descrgar
	for (var i = 0; i < articulos.length; i++) {
		if (articulos[i] === null) {
			//console.log(articulos[i])
			//callback(null, result_descrgar)
		}else{
			var prueba = new ModelBlog({
				site : articulos[i].name,
				title : "Prueba",
				date : new Date(),
				content : articulos[i].body
			})
			prueba.save(function(err){
				if (err) { console.log("error")}
			})
			
		}
		if (i == articulos.length-1) {
			callback(null, result_descrgar)
		}
	}
}

exports.buscar = function(){
	var promise = new Promise(function(resolve, reject){

			ModelBlog.find({}, function(err, data){
				resolve(data)
			})
	

	})

	return promise
}
