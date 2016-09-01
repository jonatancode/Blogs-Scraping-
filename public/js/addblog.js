

window.addEventListener('load', function () {
 	var preview_blog = document.getElementById("preview_blog")
	preview_blog.addEventListener('click', envia_datos, false)

	var addblog = document.getElementById("addblog")
	addblog.addEventListener("click", guardar_datos, false)

	var actualiza = document.getElementById("actualiza")
	actualiza.addEventListener("click", actualizad, false)	

	var save_data = document.getElementById("save_data")
	save_data.addEventListener("click", save_all_data, false)
}, false)

function envia_datos(e){
	var site = document.getElementById("site").value
	var tag_title = document.getElementById("tag-title").value
	var tag_link = document.getElementById("tag-link").value
	var tag_date = document.getElementById("tag-date").value

	var objeto = {
		site :site,
		tag_title :tag_title,
		tag_link :tag_link,
		tag_date :tag_date
	}
	document.getElementById("respuesta_servidor").innerHTML ="...";
	socket.emit("datos_sitio_web", objeto)
}

function guardar_datos(){
	socket.emit("save_new_site")
}

function actualizad(){
	socket.emit("actualiza")
}

function save_all_data(){
	socket.emit("save")
}

var socket = io.connect("http://192.168.1.9:5000")

socket.on("mensaje", function(data){
	console.log(data.hola)
})

socket.on("respuesta_request", function(data){
	console.log(data)

	document.getElementById("blog_preview__title").innerHTML = "Titulo articulo: "+data.title;
	document.getElementById("blog_preview__link").innerHTML = "Link articulo: "+data.link;
	document.getElementById("blog_preview__date").innerHTML = "Fecha: "+data.date;

})



socket.on("datos_guardados_OK", function(data){
	/* muestar mensaje*/
	document.getElementById("respuesta_servidor").innerHTML = "..."
	document.getElementById("respuesta_servidor").innerHTML = "BLOG GUARDADO CORRECTAMENTE"
})

socket.on("res_actuzaliza", function(data){
	alert("Actuzalizada", data)
})

socket.on("res_save", function(data){
	alert("Datos guardado: ", data)
})

