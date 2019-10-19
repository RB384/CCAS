var express=require("express");
var bodyParser=require('body-parser');
var session = require('express-session');
var connection = require('./config');
var app = express();


app.use(express.static('Homepage'));
app.use(express.static('Login'));
app.use(express.static('Registration'));
app.use(express.static('Student'));
app.use(express.static('SocietyHead'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

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
        var sql = "INSERT INTO student VALUES ?";
        var value =[[req.body.SID,req.body.name]];
  		connection.query(sql,[value], function (err, result) {
    	if (err) throw err;
    	console.log("1 record inserted");
  });
       
      
});

app.get('/StudentFunc', function(req,res){
	if(req.session.loggedin){
		con.query("SELECT * FROM Student_Details where SID = ?", function (err, result, fields) {
    	if (err) throw err;
    	console.log(result);
		res.render('Student',{data:res});
});
}
});

app.get('/SocietyHeadFunc', function(req,res){
	/*if(req.session.loggedin){
		req.session.destroy();
	}*/
	var name = 'hello';

	res.render('SocietyHeadFunc',{name:name});
});


app.listen(3000, '0.0.0.0', function() {
	console.log('Hosting started...');
});