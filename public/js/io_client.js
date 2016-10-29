var socket = io.connect("localhost:5000")

socket.on("mensaje", function(data){
	console.log(data.hola)
})

socket.on("respuesta_request", function(data){
	console.log(data)
	document.getElementById("blog_preview__site").innerHTML = "Sitio web: "+data.name;
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

