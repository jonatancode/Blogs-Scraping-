const Blogs = function(){
	this.lista = []
	this.max_id_site_web = 0
	this.nuevos_blogs = []

	this.add_site = (blog) =>{
		this.lista.push(blog)
		if (blog.id > this.max_id_site_web) {
			this.max_id_site_web = blog.id
		}
	}
	this.new_site = (blog) =>{ 
		this.lista.push(blog)
		this.max_id_site_web++
		this.nuevos_blogs.push(blog.id)
	}
	this.nuevos = ()=> this.nuevos_blogs

	this.get_lista = ()=> this.lista

	this.get_max_id_site_web = () => this.max_id_site_web

	this.search_id  = (id_site) => {
		for (var i = 0; i < this.lista.length; i++) {
			
			if (this.lista[i].id == id_site) {
				return this.lista[i]
			}
		}
	}
	
	this.vacio = () => this.lista.length == 0

}




module.exports = Blogs