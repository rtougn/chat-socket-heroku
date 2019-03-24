var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var mangUsers = ["admin"];

io.on("connection", function(socket){

	socket.on("disconnect", function(){
		if(mangUsers.indexOf(socket.Username)>0){
			mangUsers.splice(
				mangUsers.indexOf(socket.Username), 1
			);
			socket.broadcast.emit("server-send-danhsach-users", mangUsers);
		}
	});

	socket.on("client-send-username", function(data){
		if(mangUsers.indexOf(data)>=0){
			socket.emit("server-send-dki-thatbai");
		} else{
			socket.Username = data;
			mangUsers.push(socket.Username);
			socket.emit("server-send-dki-thanhcong", data);
			io.sockets.emit("server-send-danhsach-users", mangUsers);
		}
	});

	socket.on("logout", function(){
		mangUsers.splice(
			mangUsers.indexOf(socket.Username), 1
		);
		socket.broadcast.emit("server-send-danhsach-users", mangUsers);
	});

	socket.on("user-send-messages", function(data){
		socket.broadcast.emit("server-send-messages", {un:socket.Username, nd:data});
	});

	socket.on("dang-go-chu", function(){
		socket.broadcast.emit("server-send-typing");
	});
	socket.on("stop-go-chu", function(){
		socket.broadcast.emit("server-send-stop-typing");
	});
});
app.get("/", function(req, res){
	res.render("trangchu");
});