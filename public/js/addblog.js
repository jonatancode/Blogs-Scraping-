

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
	document.getElementById("respuesta_servidor").innerHTML ="...";
	socket.emit("datos_sitio_web", objeto)
}
var socket = io.connect("http://192.168.1.9:5000")
var site_web = {

}

socket.on("mensaje", function(data){
	console.log(data.hola)
})

socket.on("respuesta_request", function(data){
	console.log(data)
	document.getElementById("blog_preview__site").innerHTML = "Sitio web: "+data[0].name;
	document.getElementById("blog_preview__title").innerHTML = "Titulo articulo: "+data[0].title;
	document.getElementById("blog_preview__link").innerHTML = "Link articulo: "+data[0].link_article;
	document.getElementById("blog_preview__date").innerHTML = "Fecha: "+data[0].date;


	site_web.site = data[0].name,
	site_web.title = data[0].title,
	site_web.link_article = data[0].link_article,
	site_web.date = data[0].date,
	site_web.tagtitle = data[0].tagtitle,
	site_web.tag_link_article = data[0].tag_link_article,
	site_web.tag_date = data[0].tag_date
})

function guardar_datos(){
	socket.emit("guardar_datos", site_web)
	
}

socket.on("datos_guardados_OK", function(data){
	/* muestar mensaje*/
	document.getElementById("respuesta_servidor").innerHTML = "..."
	document.getElementById("respuesta_servidor").innerHTML = "BLOG GUARDADO CORRECTAMENTE"
})
