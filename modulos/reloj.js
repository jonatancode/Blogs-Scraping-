const articulos = require("./descarga")
const articulos = require("./buscas")
const dia = 0;
var actualizado = false;

exports.cambio = function(req, res, next){
	if (!actualizado) {
		articulos.descarga(res,next)
		actualizado = true;
	}
	buscas.busca(req, res, next)
}

exports.busca= function(){
	
}