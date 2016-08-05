const ModeloArticulo = require("../model/blog")
const cheerio = require("cheerio")

exports.articulos_antiguos = function(site){
	var promise = new Promise(function(resolve, reject){
		ModeloArticulo.find({ site : site}, function(err, data){
			if (err) { return console.log(err)}
			if (data.length == 0){ resolve(null)}
			if (data){ resolve(data)}
		})
		
	})

	return promise
}


exports.titulo_articulo = function(html){
	ModeloArticulo.find({}, function(err, data){
			if (err) { return console.log(err)}
			if (data.length == 0){ resolve(null)}
			if (data){ 
				//$ = cheerio.load(data.content)
				//var titulo = $("a").text()
				console.log(data[0].content)

			}

	})
}

