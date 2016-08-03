const express = require("express");
const app = express();
const path = require('path');
const articulo = require("./modulos/descarga")
const async = require("async")
const mongoose = require("mongoose");


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

var actualizado = false
app.get("/blogs", function(res, res, next){
		/*if (!actualizado) {
			async.waterfall([
			function (callback){
				articulo.descarga(callback)
			},
			function (response, callback){
				articulo.guarda(response, callback)
			}

			], function(err, result){
				actualizado = true
				console.log("descarga, guarda y envia")	
			});

		}else{
		}*/
		console.log("busca y envia")	
		articulo.buscar().then(function(result){
			//console.log(actualizado)	
			res.render("blogs", {html: result});
			//res.json(result);

		})


	}//callback app.get
)

app.listen(8080, function(){
	console.log("Corriento en http://apacheandnode.com:8080/blogs")
	console.log("Verificando blogs");
	async.waterfall([
		function (callback){
			articulo.descarga(callback)
		},
		function (response, callback){
			articulo.guarda(response, callback)
		}
		], function(err, result){
				console.log("actualizado")
		}
	);//waterfall
})