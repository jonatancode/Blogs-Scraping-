const Entrada = require("./entrada")

const Siteweb = function(id, name, tag_title, tag_link, tag_date){
	this.id = id;
	this.name = name;
	this.tag_title = tag_title;
	this.tag_link = tag_link;
	this.tag_date =tag_date;

	this.entradas = []
	/*PROTITPES*/
	this.info = function(){
		return [this.id, this.name, this.tag_title, this.tag_link, this.tag_date]
	}
	this.addentradas = function(entrada){
		entrada.set_id_site(this.id)
		this.entradas.push(entrada)
	}

	this.get_entradas = function(){
		return this.entradas
	}

	this.get_id = function(){
		return this.id
	}
	this.primera_entrada = function(){
		return this.entradas[0]
	}

	this.length_entradas = () => this.entradas.length
}

module.exports = Siteweb