const express = require("express");
const app = express();
const server = require("http").Server(app)

const path = require('path');
const articulo = require("./modulos/descarga")
const buscar_articulos = require("./modulos/buscas")
const async = require("async")
const mongoose = require("mongoose");
const cheerio = require("cheerio")
const request = require("request")
const ModelBlog = require("./model/blog")
const articulos = require("./model/datos_articulos")

const Blogs = require("./modulos/blogs")
const Siteweb = require("./modulos/siteweb")
const Entrada = require("./modulos/entrada")
const blogs = new Blogs()
const io = require("socket.io")(server)


require("./modulos/io")(io)
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogs');

app.use( express.static('public'))
app.use( express.static('node_modules/bootstrap/dist'))
app.use('/jquery',   express.static(__dirname + '/node_modules/jquery/dist/jquery.js'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get("/", function(req, res,next){
	res.send("HOla MUndo")
})

var dia_cero = new Date();
var dia_referencia = 17

app.get("/blogs", function(res, res, next){
	var all_blogs = blogs.get_all_blogs()
	var entradas = []
	for (var i = 0; i < all_blogs.length; i++) {
		entradas.push(all_blogs[i].get_entradas())
		if (i == all_blogs.length-1) {
			res.json(entradas)
		}
	}

	}
)

app.get("/search_blog/:site", function(req, res, next){
	var site = req.params.site
	if (site.slice(0,6) != "http://") {
		site = "http://" +req.params.site
	}
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
		res.send(siteweb)

	})

})

app.get("/search/:id", function(req, res, next){
	var id = req.params.id
	var blog = blogs.get_blog_for_id(id)
	var entradas = blog.get_entradas()
	res.json(entradas)
})







var cargaSitio = function(){
	var promise = new Promise(function(resolve, reeject){
		var query = ModelBlog.find({})
		query.select('site tag_title tag_link_article tag_date')
		query.exec(function(err, result){
			blogs.settamano(result.length)
			var sitios_webs = result.map(function(sitio, index, array){
				var sitio = new Siteweb(index+1, sitio.site, sitio.tag_title, sitio.tag_link_article, sitio.tag_date)
				blogs.addblog(sitio)
				if (index == array.length-1){
					resolve()
				}
			})
		})



	})
	return promise

}
var cargarEntradas = function(id_site){
	var promise = new Promise(function(resolve, reeject){
		var query = articulos.find({})
		query.exec(function(err, result){
			var entradas = result.map(function(rentrada, index, array){
				var entrada = new Entrada(index+1, rentrada.title, rentrada.link_article, rentrada.site)
				site_web = blogs.get_blog(rentrada.site)
				site_web.addentradas(entrada)
				//console.log(entrada)
				if (index == array.length -1){
					resolve()
				}
			})
		})	
		
	})
	return promise
}

app.get("/addblog/:id", function (req, res, next) {

	//res.render('addblog')
	var id = req.params.id
	var blog = blogs.get_blog_for_id(id)
	res.json(blog)


})




const datas_articles = require(("./model/datos_articulos"))
server.listen(5000, function(){
	console.log("Corriento en el puerto 5000")
	if ( blogs.vacio() ) {
		cargaSitio().then(function(){
			cargarEntradas().then(function(){
				console.log("Todo listo")
			})
		})
	}

})