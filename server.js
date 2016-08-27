const express = require("express");
const app = express();
const server = require("http").Server(app)

const path = require('path');

const Blogs = require("./modulos/blogs")
const Siteweb = require("./modulos/siteweb")
const Entrada = require("./modulos/entrada")
const blogs = new Blogs()
const funciones = require("./modulos/funciones")


const articulo = require("./modulos/descarga")
const mongoose = require("mongoose");

const io = require("socket.io")(server)
require("./modulos/io")(io, blogs)


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogs');

app.use( express.static('public'))
app.use( express.static('node_modules/bootstrap/dist'))
app.use('/jquery',   express.static(__dirname + '/node_modules/jquery/dist/jquery.js'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.get("/", function(res, res, next){
	var all_blogs = blogs.get_all_blogs()
	var entradas = []
	for (var i = 0; i < all_blogs.length; i++) {
		entradas.push(all_blogs[i].get_entradas())
		if (i == all_blogs.length-1) {
			res.render("blogs",{html:entradas})
			//res.json({html:entradas[0][0]})
		}
	}

	}
)


app.get("/search/:id", function(req, res, next){
	var id = req.params.id
	var blog = blogs.search_id(id)
	var entradas = blog.get_entradas()
	res.json(entradas)
})


app.get("/addblog", function (req, res, next) {

	res.render('addblog')
	//console.log("Entradas:", blogs.get_max_id_entrada())
	//console.log("SItio:",blogs.get_max_id_site_web())
})
app.get("/nuevos", function (req, res, next) {
	var nuevos = blogs.nuevos()
	funciones.guardar_nuevos(blogs)
	res.render('addblog')
	console.log(nuevos)
	//console.log("Entradas:", blogs.get_max_id_entrada())
	//console.log("SItio:",blogs.get_max_id_site_web())
})

const Sitios = require("./model/blog")
const Articulos = require("./model/datos_articulos")

server.listen(5000, function(){
	console.log("Corriento en el puerto 5000")
	if ( blogs.vacio() ) {
	 	funciones.cargaSitio(blogs).then(function(){
			funciones.cargarEntradas(blogs).then(function(){
				console.log("Todo listo")
				funciones.exportar_a(blogs) 
			})
		})
	}


	/*
		Eliminar propiedades en MongoDB usando Mongosee
	*/
	/*Sitios.find({}, function(err, data){
		for(let sitio of data){
			Sitios.update({"site":sitio.site},{$unset:{"title": 1,"link_article": 1}},{ multi: true }, function(err){
				console.log(err)

			})
		}
	})*/

	/*
		Añadiendo las entradas al apropiedad entrada de Blog
	*/
	/*Articulos.find({site: "http://hipertextual.com/software"}, function(err, data){
		console.log(data.length)
		for (let entrada of data ){
			Sitios.findOne({site : entrada.site}, function(err, result){
				Sitios.update({site : entrada.site}, {$push: {"entradas": entrada}}, function(err){
					console.log(err)
				})
			})

		}
		console.log(data)
	})*/

	/*Sitios.find({}, function(err, data){
		for (let web of data){
			Sitios.update(
				{"site": , "entradas.link_article": "https://hipertextual.com/2016/08/windows-10-anniversary-update-analisis"},
				{ $set : {"entradas.$._id": 1}}, 
				function(err,data){
					console.log(err, data)
				}
			)
			
		}

	})*/
})
