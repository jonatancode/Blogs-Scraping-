
var cargador = {
	cargaSitio : function(){
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

	},
	cargarEntradas : function(id_site){
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

}

module.exports = cargador