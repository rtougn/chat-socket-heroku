var socket = io("https://mamamathuat.herokuapp.com/");

socket.on("server-send-dki-thatbai", function(){
	alert("Co nguoi da dang ki roi!");
});

socket.on("server-send-danhsach-users", function(data){
	$("#userOnline").html("");
	data.forEach(function(i){
		$("#userOnline").append("<div class='user'>" + i + "</div>");
	});
});

socket.on("server-send-dki-thanhcong", function(data){
	$("#currentUser").html(data);
	$("#frmLogin").hide(2000);
	$("#frmChat").show(1000);
});

socket.on("server-send-messages", function(data){
	$("#listMessages").prepend("<div class='messages'>" + data.un + ": " + data.nd + "</div>");
});

socket.on("server-send-typing", function(){
	$("#typing").html("ai do dang nhap...");
});
socket.on("server-send-stop-typing", function(data){
	$("#typing").html("");
});

$(document).ready(function(){
	$("#frmLogin").show();
	$("#frmChat").hide();

	$("#btnRegister").click(function(){
		socket.emit("client-send-username", $("#txtUsername").val());
	});
	
	$("#btnLogout").click(function(){
		socket.emit("logout");
		$("#frmChat").hide(1000);
		$("#frmLogin").show(2000);
	});

	$("#btnSend").click(function(){
		socket.emit("user-send-messages", $("#txtMessages").val());
		$("#listMessages").prepend("<div class='mymessages'>" + $('#txtMessages').val() + "</div>");
		$("#txtMessages").val("");
	});

	$("#txtMessages").focusin(function(){
		socket.emit("dang-go-chu");
	});
	$("#txtMessages").focusout(function(){
		socket.emit("stop-go-chu");
	});

});