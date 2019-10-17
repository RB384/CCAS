var express=require("express");
var bodyParser=require('body-parser');
var session = require('express-session');

var connection = require('./config');
var app = express();


app.use(express.static('Homepage'));
app.use(express.static('Login'));
app.use(express.static('Registration'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req,res){
	res.sendFile(__dirname + '/Homepage/index.html');
});

app.get('/Login', function(req,res){
	/*if(req.session.loggedin){
		req.session.destroy();
	}*/
	res.sendFile(__dirname + '/Login/Login.html');
});

app.get('/Register', function(req,res){
	/*if(req.session.loggedin){
		req.session.destroy();
	}*/
	res.sendFile(__dirname + '/Registration/Registration.html');
});

app.post("/postSignup", function (req, res) {
        console.log(req.body.name);
        res.send(req.body.name);
});
app.listen(3000, '0.0.0.0', function() {
	console.log('Hosting started...');
});