const request = require("request")
const cheerio = require("cheerio")
const EventEmitter = require('events');
const ModelBlog = require("../model/blog")
const async = require("async")

exports.controla = function(req, res, next){
	async.parallel([
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
		}
	], function(err, results) {
		res.locals.sitiosweb = results

		console.log(results.length)
		next()
	});
}

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

function ejecuta(site, tag, asyncsCallback){
	var site = site;
	var tag = tag

	async.waterfall([
		function (callback){
			getResponse(site, callback)
		},
		function (response, callback){
			getFirstArticle(response, tag, callback)
		}

	], function(err, result){
		asyncsCallback(null, result)
	});
}
