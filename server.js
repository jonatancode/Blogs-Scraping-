const express = require("express");
const app = express();
const path = require('path');
const articulo = require("./modulos/descarga")
const buscar_articulos = require("./modulos/buscas")
const async = require("async")
const mongoose = require("mongoose");
const cheerio = require("cheerio")
const request = require("request")

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogs');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", function(req, res,next){
	res.send("HOla MUndo")
})
app.get("/contacto", function(req, res,next){
	console.log(req.route);
	var options ={
		root : __dirname + '/',
		dotfiles : 'deny',
		headers : {
			'x-timestamp': Date.now(),
        	'x-sent': true
		}

	}
	res.sendFile( "contacto.html", options, function(err){
		if (err) {
			console.log(err);
			res.status(err.status).end()
		}else{
			console.log("enviado")

		}
	});
	//res.send("Contacto")
})


app.get("/blogs", function(res, res, next){
		console.log("busca y envia")	
		articulo.buscar().then(function(result){
			//console.log(actualizado)	
			//res.render("blogs", {html: result});
			res.json(result);
		})

	}//callback app.get
)

app.get("/blog/:site", function(req, res, next){
	var site = req.params.site
	if (site.slice(0,6) != "http://") {
		site = "http://" +req.params.site
	}
	//if (site.slice(0,6) == "www.") { site = site.slice(4,site.length)}

	/*buscar_articulos.articulos_antiguos(site).then(function(result){
		console.log(result)
		res.send(result);
	})*/
	/* 
	debianhackers.net/ ".post-title a", ".posted-on a time"
	blog.capacityacademy.com/ ".entry-title a", ".entry-meta time"
	http://www.securitybydefault.com/ ".entry-title a", ".postmeta .clock"
	http://www.elclubdelprogramador.com/ "entry-title a", ".meta-date time"
	www.dragonjar.org/ ".et-description h2 a", ".post-meta span"
	*/
	console.log(site)
	request(site, function(err, response){
		if (err) {
			console.log(err)
		}
		$ = cheerio.load(response.body);

		var title = $(".et-description h2 a").first().text()
		var link_article = $(".et-description h2 a").first().attr('href')
		var date = $(".post-meta span").first().html()


		var siteweb = {}
		siteweb.name = response.request.uri.hostname
		siteweb.title = title
		siteweb.link_article = link_article
		siteweb.date = date
		//console.log(siteweb.name)
		//console.log(siteweb)
		res.send(siteweb)

	})

})


app.listen(8080, function(){
	console.log("Corriento en http://apacheandnode.com:8080/blogs")
	console.log("Verificando blogs");
	var array = 
	[
			["http://www.flaviocorpa.com/","ol li", "h2", ".posts li a", ".post.meta time"],
			["http://debianhackers.net/", ".post-header", "h1 a"],
			["http://blog.capacityacademy.com/",".entry-header", "h2 a"],
			["http://www.securitybydefault.com/", ".bposttitle", "h2 a"],
			["http://www.elclubdelprogramador.com/", ".post-content-body"],
			["http://www.muylinux.com/",".entry-title"],
			["http://www.dragonjar.org/",".et-description"],
			["http://carlosazaustre.es/blog/",".Post-item-header"],
			["http://www.etnassoft.com/",".entry-title"],
			["http://blog.desdelinux.net/",".entry-title.td-module-title"],
			["http://nebul4ck.wordpress.com/how-to/", "h2"],
			["http://picandocodigo.net/",".post-title"],
			["http://barrapunto.com/", ".generaltitle"],
			["http://robustiana.com/", ".catItemHeader"],
			["http://blog.nursoft.cl/", ".post-header"],
			["http://itblogsogeti.com/", ".sticky-header"],
			["http://hat.hexacta.com/", "h2"],
			["http://pensandoensoa.com/",".entry-title"],
			["http://www.arquitecturajava.com/", ".title"],
			["http://elrinconde.miguelra.com/articulos/", ".post-content .entry-title"],
			["http://blog.koalite.com/archive/", ".post-list li"],
			["http://www.dbigcloud.com/", ".article-header.clearfix"]
	]
	async.map(array, function (array, callback) {
		articulo.inicia(array, callback)
	}, function(err, result){
		console.log("Blogs Actuzalizados")
	})	

})