

window.addEventListener('load', function () {
 	var preview_blog = document.getElementById("preview_blog")
	preview_blog.addEventListener('click', envia_datos, false)

	var addblog = document.getElementById("addblog")
	addblog.addEventListener("click", guardar_datos, false)

}, false)

function envia_datos(e){
	var site = document.getElementById("site").value
	var tag_title = document.getElementById("tag-title").value
	var tag_link = document.getElementById("tag-link").value
	var tag_date = document.getElementById("tag-date").value

	var objeto = {
		site :site,
		tag_title :tag_title,
		tag_link_article :tag_link,
		tag_date :tag_date
	}
	socket.emit("datos_sitio_web", objeto)
}
var socket = io.connect("http://192.168.1.9:8080")
var site_web = {

}

socket.on("mensaje", function(data){
	console.log(data.hola)
})

socket.on("respuesta_request", function(data){
	console.log(data)
	document.getElementById("blog_preview__site").innerHTML = "Sitio web: "+data.name;
	document.getElementById("blog_preview__title").innerHTML = "Titulo articulo: "+data.title;
	document.getElementById("blog_preview__link").innerHTML = "Link articulo: "+data.link_article;
	document.getElementById("blog_preview__date").innerHTML = "Fecha: "+data.date;


	site_web.site = data.name,
	site_web.title = data.title,
	site_web.link_article = data.link_article,
	site_web.date = data.date,
	site_web.tagtitle = data.tagtitle,
	site_web.tag_link_article = data.tag_link_article,
	site_web.tag_date = data.tag_date
})

function guardar_datos(){
	socket.emit("guardar_datos", site_web)
	
}

socket.on("datos_guardados_OK", function(data){
	/* muestar mensaje*/
	document.getElementById("respuesta_servidor").innerHTML = "BLOG GUARDADO CORRECTAMENTE"
})