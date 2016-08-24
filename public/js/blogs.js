window.addEventListener('load', function(){
	document.getElementById("actualiza").addEventListener('click', act_db, false)
	
}, false)
var socket = io.connect("http://192.168.1.9:5000")

		function act_db(e){
	console.log("va actulizar")
	socket.emit("actualiza", {})
}

socket.on("actuzalidado", function(data){
	console.log(data)
})