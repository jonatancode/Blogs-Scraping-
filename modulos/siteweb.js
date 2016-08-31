const request = require("request")
const ModelContenido = require("../model/contenido")
const cheerio = require("cheerio")


const Siteweb = function(id, name, tag_title, tag_link, tag_date, hash_request, entradas){
	this.id = id;
	this.name = name;
	this.tag_title = tag_title;
	this.tag_link = tag_link;
	this.tag_date =tag_date;

	this.entradas =  entradas || []

	this.hash_request = hash_request
	this.request_body = ""

	this.new_request_ =  "" 
	this.new_hash_ =  ""
	/*PROTITPES*/

	this.info = function(){
		var obj = {
			id :this.id, 
			name : this.name, 
			tag_title: this.tag_title, 
			tag_link : this.tag_link, 
			tag_date: this.tag_date,
			hash_request : this.hash_request
		}
		return obj
	}
	this.addentradas = function(entrada){
		this.entradas.push(entrada)
	}

	this.get_entradas = function(){
		return this.entradas
	}

	this.ultima_entrada = function(){
		return this.entradas[this.entradas.length-1]
	}

	this.length_entradas = () => this.entradas.length

	this.search_blog_for_title = (titulo) =>{
		for (var i = 0 ;i < this.entradas.length; i++){
			if(titulo == this.entradas[i].title){
				return true
			}
		}
		return false
	}
	/*

		DESCARGA BODY DE LA WEB,
		GENERA UN HASH Y COMPARA CON EL ANTERIOR HASH
	*/
	this.actualizar_request = ()=>{
		var _this = this
		var promisa = new Promise(function(resolve, reeject){
			request(_this.name, function(err, response){
				_this.new_request_ = response.body	
				console.log("desscargar")		
				resolve()
			})

			
		})
		return promisa
	}

	/*
		genera el hash
	*/
	this.generateHashCode = () => {
		var hash = 0;
		if (this.new_request_.length == 0) return hash;
		for (i = 0; i < this.new_request_.length; i++) {
			char = this.new_request_.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		this.new_hash_ = hash.toString();
		return true
	}
	//this.comprueba = ()=> this.new_hash_ ==  this.hash_request 
	/*
		Devuelve el ultimo articulo
	*/
	this.get_lasted_article = ()=>{
		$ = cheerio.load(this.new_request_);
  		var title = $(this.tag_title).first().text();
		var link = $(this.tag_link).first().attr("href")
		var date = $(this.tag_date).first().text()
		var article = []
		var siteweb = {}
		siteweb.title = title
		siteweb.link_article = link
		siteweb.date = date
		article.push(siteweb)
		return article

	}
	/*
		Devuelve todos los articulos de la pagina
	*/
	this.all_get_articles = (id_site, identrada) => {
		console.log("Busca Todas entradas")
		var _this = this
		var id_site = id_site
		let id_entrada = identrada
		var promise = new Promise(function(resolve, reeject){
			$ = cheerio.load(_this.request_body);

			var array_title = []
			$(_this.tag_title).each(function(i, elem) {
	  			array_title[i] = $(this).text();
			});
			
			
			var array_link_article = []
			$(_this.tag_link).each(function(i, elem){
				array_link_article[i] = $(this).attr("href")
			})
			//console.log(array_link_article)

			var array_date =[]
			$(_this.tag_date).each(function(i, elem){
				array_date[i] = $(this).text()
			})

			var array_article = []

			for (var i = 1; i < array_title.length+1; i++) {
				var siteweb = {}
				siteweb.title = array_title[array_title.length-i]
				siteweb.link_article = array_link_article[array_link_article.length-i]
				siteweb.date = array_date[array_date.length-i]
				siteweb.id = id_entrada++
				siteweb.id_site = id_site

				_this.entradas.push(siteweb)
				if (i == array_title.length -1) {
	  				console.log(array_article.reverse())
					resolve(array_article)

				}
			}
		})
		return promise
	}
	/*
	 Guarda el articulo que le pasas a entradas
	*/
	this.save_articulo = (blogs, entrada)=>{
		var lasted_id = blogs.max_id_entrada++
		if (entrada == "None") {
			console.log("No hay contenido None\nSitio:", this.id)
		}
		else if (entrada.length == 1){
			var entrada  = {
				id_site : this.id,
				id : lasted_id,
				title : entrada[0].title,
				link : entrada[0].link_article,
				date : entrada[0].date,
			}
			console.log(entrada)
			this.entradas.push(entrada)
			lasted_id++
			console.log("Articulo añadido\nSitio", this.id)
		}
		else if (entrada.length > 1){
			var reverse = entrada.reverse()
			for (var i = 1; i < reverse.length+1; i++) {
				console.log("guardandno")
				var entrada  = {
					id_site : this.id,
					id : lasted_id,
					title : entrada[i].title,
					link : entrada[i].link_article,
					date : entrada[i].date,
				}
				this.entradas.push(entrada)
				lasted_id++
				if (i == reverse.length -1) {
					socket.emit("datos_guardados_OK", {res: "OK"})
				}
			}	
		}
	}
	/*
	 Guarda todo el objeto en mongodb
	*/
	this.save = function(){
		var _this  = this
		ModelContenido.update(
			{ site: name},
			{ $set : 
				{
					id : _this.id,
					site : _this.name,
					tag_title : _this.tag_title,
					tag_link : _this.tag_link,
					tag_date : _this.tag_date,
					entradas : _this.entradas,
					hash_request : _this.hash_request,
					request_body : _this.request_body
				}
			},
			{ upsert: true }, 
			function(err, res){
				console.log(res)
			}
		)
	}
}

module.exports = Siteweb