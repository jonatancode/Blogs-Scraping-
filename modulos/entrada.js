const Entrada = function(id, title, link, site){
	this.id_site = 0
	this.id = id
	this.title = title
	this.link = link
	this.site = site

	this.set_id_site = function(id_site){
		this.id_site = id_site
	}
}
module.exports = Entrada