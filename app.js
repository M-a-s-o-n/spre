var http = require("http");
var fs = require("fs");
var data;
var DB = fs.readFileSync("appDB.json");
DB = JSON.parse(DB);
setInterval(function () {
	fs.writeFileSync("appDB.json", JSON.stringify(DB));
}, 3600000);
var html = fs.readFileSync("index.html");
var login = fs.readFileSync("login.html");
var createGroupHtml = fs.readFileSync("createGroup.html");
var server = http.createServer(function (request, response) {
	response.write(getData(request));
	response.end();
})
server.listen(8080);
console.log("Server running");
function getData(req) {
	var requests = req.url.toString().split("/");
	var intRequest = requests[1];
	var secReq = requests[2];
		if (intRequest == "post") {
			post(secReq);
			data = "data";
		} if (intRequest == "getPosts") {
			data = getPosts(secReq)
		} if (intRequest == "login") {
			data = login;
		} if (intRequest == "group"){
			data = group(secReq);
		} if (intRequest == "password"){
			data = password(secReq);
		} if (intRequest == "index"){
			data = html;
		} if (intRequest == "creategroup"){
			data = createGroup(secReq);
		} if (intRequest == "create"){
			data = createGroupHtml;
		} if (intRequest == ""){
			data = "<h1>ERROR 404:</h1><br/>Page Not Found"
		}
	return data;
}
function post(uri) {
	var decodedData = decodeURI(uri);
	var d = decodedData.split("|");
	var group = d[0];
	var color = "#" + d[1];
	var msg = d[2];
	var posts = DB["group"][group]["msgs"];
	if (posts == undefined){} else {
	posts.push(eval('["' + color + "|" + msg + '"]'));}
	return "Done"
}
function getPosts(uri) {
	var data = decodeURI(uri);
	var d = data.split("|");
	var group = d[0];
	var id = parseInt(d[1]);
	var dataBase = DB["group"][group]["msgs"];
	if (dataBase == undefined){return "ERROR"} else {
	var postDataArray = dataBase.slice();
	var newData = postDataArray.splice(id, postDataArray.length + 50);
	var packagedData = newData.join();
	return packagedData;
	}
}
function group(uri){
	var data = decodeURI(uri);
	var keys = Object.keys(DB["group"]);
	var search = keys.indexOf(data);
	if (search == -1){
		return "fail"
	} else {
		return"success"
	}
}
function password(uri){
	var data = decodeURI(uri);
	var d = data.split("|");
	var pass = DB["group"][d[0]];
	if (pass != undefined){
	pass = pass["password"];
	} else {
		return "fail";
	}
	if (pass != d[1]){
		return "fail";
	} else {
		return"success";
	}
}
function createGroup(uri){
	var data = decodeURI(uri);
	var d = data.split("|");
	var nameOfGroup = d[0];
	var password = d[1];
	DB.group[nameOfGroup] = {"msgs":[],"password":password};
	return "success";
}