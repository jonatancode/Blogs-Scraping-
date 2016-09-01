const request = require("request")
const ModelContenido = require("../model/contenido")
const cheerio = require("cheerio")
const Entrada = require("./entrada")


const Siteweb = function(id, site, tag_title, tag_link, tag_date, request_body, entradas){
	this.id = id || 0;
	this.site = site;
	this.tag_title = tag_title;
	this.tag_link = tag_link;
	this.tag_date =tag_date;
	this.entradas =  entradas || []

	this.request_body = request_body || null

	this.prev_request_body =  "" 
	// eventos


	this.set_id = (new_id) => this.id = new_id
	this.add_entrada = (entrada) => {this.entradas.push(entrada)}

	this.get_entradas = () => this.entradas

	this.length_entradas = () => this.entradas.length

	this.reload_request = (event)=>{
		var _this = this
		var promisa = new Promise(function(resolve, reeject){
			request(_this.site, function(err, response){
				if (err) {
					event.emit("error_", err)
					reeject(err)
				}
				if( !_this.request_body){
					_this.request_body = response.body
					//console.log("NO existe request, ahora si: ", _this.request_body.length)

				}
				else if (_this.request_body != response.body) {
					_this.prev_request_body = _this.request_body
					_this.request_body = response.body		
					//console.log("Cmabio el body, ahora si: ", _this.request_body.length)
				}
				if (event) {
					event.emit("reload_request", _this)
				}
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
	}

	this.generate_last_entrada = ()=>{
		let _this = this
		$ = cheerio.load(_this.request_body);
  		var title = $(_this.tag_title).first().text();
		var link = $(_this.tag_link).first().attr("href")
		var date = $(_this.tag_date).first().text()
		let entrada = {
			id_site : this.id,
			title : title,
			link : link,
			date : date
		}
		return entrada
	}
	this.last_entrada = ()=> {

		let last = this.entradas[this.entradas.length-1] 
		return last
		
	}
	this.generate_all_entrada = () => {
		console.log("Busca Todas entradas")
		var _this = this
		var id = this.id
		var promise = new Promise(function(resolve, reeject){
			$ = cheerio.load(_this.request_body);

			var array_title = []
			$(_this.tag_title).each(function(i, elem) {
	  			array_title[i] = $(this).text();
			});
			//console.log(array_title.length)
			
			var array_link_article = []
			$(_this.tag_link).each(function(i, elem){
				array_link_article[i] = $(this).attr("href")
			})
			//console.log(array_title.array_link_article)

			var array_date =[]
			$(_this.tag_date).each(function(i, elem){
				array_date[i] = $(this).text()
			})


			for (var i = 1; i < array_title.length+1; i++) {
				var new_entrada ={
					id_site : id,
					title : array_title[array_title.length-i],
					link : array_link_article[array_link_article.length-i],
					date :array_date[array_date.length-i]
				}
				_this.entradas.push(new_entrada)
				if (i == array_title.length-1){
					resolve()
				}
			}
		})
		return promise
	}

	/*
	 Guarda todo el objeto en mongodb
	*/
	this.save_in_db = function(){
		var _this  = this
		ModelContenido.update(
			{ site: _this.site},
			{ $set : 
				{
					id : _this.id,
					site : _this.site,
					tag_title : _this.tag_title,
					tag_link : _this.tag_link,
					tag_date : _this.tag_date,
					entradas : _this.entradas,
					request_body : _this.request_body
				}
			},
			{ upsert: true }, 
			function(err, res){
				console.log(res, _this.id)
			}
		)
	}
}

module.exports = Siteweb