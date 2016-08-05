

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

	var array = [
		site,
		tag_title,
		tag_link,
		tag_date
	]
	socket.emit("datos_sitio_web", array)
}
var socket = io.connect("http://192.168.1.9:8080")
var site_web = {

}

socket.on("mensaje", function(data){
	console.log(data.hola)
})

socket.on("respuesta_request", function(data){
	console.log(data)
	document.getElementById("blog_preview__site").innerHTML = data.name;
	document.getElementById("blog_preview__title").innerHTML = data.title;
	document.getElementById("blog_preview__link").innerHTML = data.link_article;
	document.getElementById("blog_preview__date").innerHTML = data.date;
	site_web.name = data.name
	site_web.title = data.title
	site_web.link_article = data.link_article
	site_web.date = data.date
})

function guardar_datos(){
	socket.emit("guardar_datos", site_web)
	
}