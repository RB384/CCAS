var express=require("express");
var bodyParser=require('body-parser');
var session = require('express-session');
var connection = require('./config');
var app = express();
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}));


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
	if(req.session.loggedin){
		req.session.destroy();
	}
	res.sendFile(__dirname + '/Login/Login.html');
});

app.post('/authenticate', function(req, res) {

	if(req.session.loggedin)	req.session.destroy();
	var username=req.body.username;
  var password=req.body.pass;
	var interface = req.body.interface;

  connection.query('SELECT * FROM login_details WHERE username = ? and password = MD5(?) and interface = ?',[username,password,interface], function (error, results, fields) {
        if(results.length >0){

							 if(interface == "Student"){ req.session.loggedin = true;  req.session.SID=username;  res.redirect('/StudentFunc');}
							 else if(interface == "SocietyHead") {
								 var societyname = req.body.Society;
								 connection.query('SELECT * FROM login_details WHERE username = ? and password = MD5(?) and interface = ? and Societyname =?',[username,password,interface,societyname],function (error, results2, fields) {
									 	if(results2.length >0){
															req.session.loggedin = true;
															req.session.Sname= societyname;
															res.redirect('/SocietyHeadFunc');
												}
											else 	res.send("<h1>Incorrect Username and/or password !!!  Please <a href=\"/login\"> Login</a> again with correct credentials");
										});
									}
               else if(interface == "CollegeAdmin") {req.session.loggedin = true;res.redirect('/CollegeAdmin');}
            }
            else
							res.send("<h1>Incorrect Username and/or password !!!  Please <a href=\"/login\"> Login</a> again with correct credentials");
});
});

app.get('/Register', function(req,res){
	if(req.session.loggedin){
		req.session.destroy();
	}
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
		connection.query("SELECT * FROM Student_Details where SID = ?",[req.session.SID],function (err, result, fields) {
    	if (err) throw err;
    res.render('Student',{data:result[0]});
});
}
		else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});

app.post('/UpdateStProfile', function(req,res){
	if(req.session.loggedin){
		var values= [req.body.address,req.body.Email,req.body.Mobile,req.body.Year,req.body.CGPA,req.body.Backlog,req.session.SID];
		connection.query("Update Student_Details set address= ? ,email = ?, Mobile= ? ,Year= ?, CGPA= ? , backlog= ? where SID = ?",values,function (err, result, fields) {
    if (err) throw err;
	});
		connection.query("SELECT * FROM Student_Details where SID = ?",[req.session.SID],function (err, result, fields) {
		if (err) throw err;
		res.redirect('/StudentFunc');
});
}
	else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});

app.get('/SocietyHeadFunc', function(req,res){
	if(req.session.loggedin){
		res.sendFile(__dirname + '/SocietyHead/SocietyheadMain.html')
}
	else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});

app.post('/AddEventDetails', function(req,res){
	 console.log("Hello");
	if(req.session.loggedin){
		var p,a,o;
		if(req.body.P_Certification) p = 1; else p=0;
		if(req.body.A_Certification) a = 1;	else a=0;
		if(req.body.O_Certification) o = 1;  else o=0;
		var values= [req.session.Sname,req.body.Event_name,req.body.Event_Location,req.body.Event_Date,req.body.Event_Sponsor,
			req.body.Event_Type,req.body.Participation_Count,p,o,a];


			connection.query("Insert into Event_Details(Society_Name,Event_Name,Event_Location,Event_Date,Event_Sponsor,Event_Type,Participation_Count,P_Certification,O_Certification,A_Certification) Values (?,?,?,?,?,?,?,?,?)",values,function (err, result, fields) {
			if (err) throw err;
	});
		res.redirect('/SocietyHeadFunc');
}
	else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});

app.post('/AddWorkshopDetails', function(req,res){
	if(req.session.loggedin){
		var p,o;
		if(req.body.P_Certification) p = 1; else p=0;
		if(req.body.O_Certification) o = 1;  else o=0;
		var values= [req.session.Sname,req.body.Workshop_name,req.body.Workshop_Location,req.body.Workshop_Date,req.body.Workshop_Sponsor,
			req.body.Workshop_Type,req.body.Participation_Count,p,o];


			connection.query("Insert into Workshop_Details(Society_Name,Workshop_Name,Workshop_Location,Workshop_Date,Workshop_Sponsor,Workshop_Type,Participation_Count,P_Certification,O_Certification,) Values (?,?,?,?,?,?,?,?,?)",values,function (err, result, fields) {
			if (err) throw err;
	});
	
		res.redirect('/SocietyHeadFunc');
}
	else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});


app.get('/CollegeAdmin', function(req,res){
	if(req.session.loggedin){
		res.render('CollegeAdmin');
	}
	else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});

app.get('/logout', function(req,res){
	if(req.session.loggedin){req.session.destroy();}
	res.redirect('/');
});

app.get('/homeredirect', function(req,res){
	if(req.session.loggedin){}
	else res.send("<h1>To access this functionality Please <a href=\"/login\"> Login</a>");
});

app.listen(3000, '0.0.0.0', function() {
	console.log('Hosting started...');
});
