const Blogs = function(){
	this.lista = []
	this.tamano = 0
	this.settamano = function(tamano){
		this.tamano = tamano
	}
	this.gettamano = function(){
		return this.tamano
	}
	this.length_lista = function(){
		return this.lista.length
	}
	this.addblog = function(blog){
		this.lista.push(blog)
	}
	this.get = function(){
		return this.lista
	}
	this.removeblog = function(id){
	}
	this.get_blog  = function(name_site){
		for (var i = 0; i < this.lista.length; i++) {
			
			if (this.lista[i].name == name_site) {
				return this.lista[i]
			}
		}
	}	
	this.get_blog_for_id  = function(id_site){
		for (var i = 0; i < this.lista.length; i++) {
			
			if (this.lista[i].id == id_site) {
				return this.lista[i]
			}
		}
	}
	this.vacio = function(){
		v = this.lista.length
		if (v == 0) {
			return true
		}
		return false
	}
	this.first = function(){
		return this.lista[0]
	}
	this.get_all_blogs = function(){
		return this.lista
	}
}




module.exports = Blogs