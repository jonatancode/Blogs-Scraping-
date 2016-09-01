const express = require("express");
const app = express();
const server = require("http").Server(app)

const path = require('path');

const All_blog = require("./modulos/blogs")
const Siteweb = require("./modulos/siteweb")
const blogs = new All_blog()

const funciones = require("./modulos/funciones")

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogs');

const io = require("socket.io")(server)
require("./modulos/io")(io, blogs)

app.use( express.static('public'))
app.use( express.static('node_modules/bootstrap/dist'))
app.use('/jquery',   express.static(__dirname + '/node_modules/jquery/dist/jquery.js'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.get("/", function(res, res, next){
	var all_blogs = blogs.get_lista()
	let entradas = []
	for (var i = 0; i < all_blogs.length; i++) {
		let last_entrada = all_blogs[i].last_entrada()
		entradas.push(last_entrada)
	}
	//console.log(entradas[11])
	res.render("blogs", {html : entradas})
	//res.json(entradas)
})


app.get("/search/:id", function(req, res, next){
	var id = req.params.id
	var blog = blogs.search_id(id)
	console.log(blog)
	var entradas = blog.get_entradas()
	res.render("search_blog",{entradas:entradas})
	//res.json(entradas)
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

})
app.get("/ver", function(req, res, next){
	var sitios = blogs.get_lista()
	var info = []
	for (var i = 0; i < sitios.length; i++) {
		let blog = sitios[i].info()
		info.push(blog)
		if (i == sitios.length -1 ) {
			res.send(info)
		}
	}
})
/*
	Listar url de los Blogs
*/

app.get("/list", function(req, res, next){	
	var urls = blogs.get_all_url()
	res.send(urls)
})


app.get("/prueba", function(req, res, next){
	res.render("prueba")
})

app.get("/save", function(req, res, next){
	funciones.save(blogs)
	res.send("f")
})

server.listen(5000, function(){
	console.log("Corriento en el puerto 5000")
	if ( blogs.vacio() ) { 
	 	funciones.cargaSitio(blogs)
	 		.then(function(){
				console.log("Sitio Cargados")
				funciones.actualizar(blogs)
					.then(function(){
						console.log("Sitios Actualizando")
					})
			})
			
	}
})
