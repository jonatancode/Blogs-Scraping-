const Blogs = function(){
	this.lista = []
	this.max_id_entrada = 0
	this.max_id_site_web = 0
	this.nuevos_blogs = []
	/*
		Se utiliza en la carga del sitio web
	*/
	this.addblog = (blog) =>{
		this.lista.push(blog)
		if (blog.id > this.max_id_site_web) {
			this.max_id_site_web = blog.id
		}
	}
	/*
	ESta funcion se utiliza para ñadir un blog
	*/
	this.new_blog = (blog) =>{ 
		this.lista.push(blog)
		this.max_id_site_web++
		this.nuevos_blogs.push(blog.id)
	}
	this.nuevos = ()=> this.nuevos_blogs

	this.get_lista = ()=> this.lista

	this.get_max_id_entrada = () => this.max_id_entrada
	this.get_max_id_site_web = () => this.max_id_site_web
	
	this.search  = (name_site) => {
		for (var i = 0; i < this.lista.length; i++) {
			
			if (this.lista[i].name == name_site) {
				return this.lista[i]
			}
		}
	}	

	this.search_id  = (id_site) => {
		for (var i = 0; i < this.lista.length; i++) {
			
			if (this.lista[i].id == id_site) {
				return this.lista[i]
			}
		}
	}
	
	this.vacio = () => this.lista.length == 0


	
	this.info = () => {
		return {lista: this.lista.length, maxE: this.max_id_entrada, MaxS: this.max_id_site_web}
	}
	this.length_entradas = ()=>{
		var n = 0
		for (var i = 0; i < this.lista.length; i++) {
			var length_blog = this.lista[i].length_entradas()
			n = n + length_blog
			if (i ==this.lista.length -1) {
				return n 
			}
		}
	}
	this.actualizar_valor_entradas = () =>{
		var n = 0
		for (var i = 0; i < this.lista.length; i++) {
			var length_blog = this.lista[i].length_entradas()
			n = n + length_blog
			if (i ==this.lista.length -1) {
				this.max_id_entrada =  n 
			}
		}	
	}
	this.get_all_url = ()=>{
		var url = []
		for (var i = 0; i < this.lista.length; i++) {
			var name = this.lista[i].name
			url.push(name)
			if (i == this.lista.length -1) {
				return url
			}
		}
	}
}




module.exports = Blogs