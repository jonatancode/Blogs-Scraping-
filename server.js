const express = require("express");
const app = express();
const child_process = require("child_process")
const request = require("request")
const cheerio = require("cheerio")
const path = require('path');
const articulo = require("./modulos/descarga")
const mongoose = require("mongoose");
const ModelBlog = require("./model/blog")

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
app.get("/descarga", function(req, res, next){
	for (var i = 16; i < 23; i++) {
		var n = "0"
		if (i < 10) {
			n += i
		}
		else{
			n = i
		}
		descarga(n)
	}

})
function descarga(i){
	try{
		var des = "wget  http://www.mejortorrent.com/uploads/torrents/series/The_Flash_2_720_"+ i+".torrent";

		var pro = child_process.exec(des, function( error, stdout, stderr){
			if (error){
				console.log("eeorr" + error)
			}else{
				console.log(stdout)
				
			}
		})

	}
	catch(err){
		
	}

}

app.get("/blogs", articulo.controla, 
	function(res, res, next){
	var respuesta = res.locals.sitiosweb
	console.log("res.locals.sitiosweb[0].name")
	/*Guardar dato en MOngo*/
	/*var prueba = new ModelBlog({
		site : res.locals.sitiosweb[0].name,
		title : "Prueba",
		date : new Date(),
		content : res.locals.sitiosweb[0].body
	})
	prueba.save(function(err){
		if (err) { console.log("error")}
		console.log("Guardado")
	})*/

	//res.send("listo")
	//res.jsonp(respuesta)
	res.render("blogs", {html :respuesta})
})

app.listen(8080)