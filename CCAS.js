var express=require("express");
var bodyParser=require('body-parser');
var session = require('express-session');
var connection = require('./config');
const multer = require('multer');
const path = require('path');
const mime = require('mime');
var app = express();

app.use(express.static('Homepage'));
app.use(express.static('Login'));
app.use(express.static('Registration'));
app.use(express.static('Student'));
app.use(express.static('SocietyHead'));
app.use(express.static('uploads'));
app.use(express.static('DisplayCriteria'));

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      cb(null,"UploadCertificationData.xlsx");
  }
});
var upload = multer({ storage: storage });
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
        var sql = "INSERT INTO student_details VALUES ?";
        var value =[[req.body.SID,req.body.UG_PG,req.body.Branch,req.body.Year,req.body.name,req.body.email
					,req.body.Mobile,req.body.CGPA,req.body.Backlog,req.body.D_A,req.body.F_name,req.body.Address]];
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

app.post('/AddEventDetails', upload.single('Upload_Certification_Data'),function(req,res){
	if(req.session.loggedin){
		var p,a,o;
		if(req.body.P_Certification) p = 1; else p=0; if(req.body.A_Certification) a = 1;	else a=0;
		if(req.body.O_Certification) o = 1;  else o=0;
		/*var values= [req.session.Sname,req.body.Event_name,req.body.Event_Location,req.body.Event_Date,req.body.Event_Sponsor,
			req.body.Event_Type,req.body.Participation_Count,p,o,a];
			connection.query("Insert into Event_Details(Society_Name,Event_Name,Event_Location,Event_Date,Event_Sponsor,Event_Type,Participation_Count,P_Certification,O_Certification,A_Certification) Values (?,?,?,?,?,?,?,?,?,?)",values,function (err, result, fields) {
			if (err) throw err;
	});*/

	const XLSX =require('xlsx');
	const workbook = XLSX.readFile(__dirname + '/uploads/UploadCertificationData.xlsx');
	const sheet_names = workbook.SheetNames;
	var p_obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_names[0]]);
	var a_obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_names[1]]);
	var o_obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_names[2]]);

	var p=0;
	while(p_obj[p++])
  console.log(p_obj[p-1].SID);

	/*console.log(o_obj);
	console.log(a_obj);*/









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
		connection.query("SELECT * FROM participation_marks, organizing_marks ,eligibilty,award_distribution LIMIT 1",function (err, result, fields) {
		if (err) throw err;
		res.render('CollegeAdmin',{pmarks:result[0],omarks:result[0],eligibility:result[0],award:result[0]});
	});
	}
	else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});

app.post('/UpdateCriteria', function(req,res){
	if(req.session.loggedin){

		var sql1 = "UPDATE participation_marks SET PEC_Participation= ? ,Pec_Award = ?,Pr_Participation=?,Pr_Award=?,Int_Participation=?,Int_Award=?";
		var value1 =[req.body.PEC_Participation,req.body.PEC_Award,req.body.Pr_Participation,req.body.Pr_Award,req.body.Int_Participation,req.body.Int_Award];
		connection.query(sql1,value1, function (err, result) {	if (err) throw err;});

		var sql2 = "UPDATE organizing_marks SET Lt250 = ?,Gt250 =? ,Max_Organizers=?";
		var value2 =[req.body.Lt250,req.body.Gt250,req.body.Max_Organizers];
		connection.query(sql2,value2, function (err, result) {	if (err) throw err;});

		var sql3 = "UPDATE eligibilty SET IC=?,COA=?,COE=?";
		var value3 =[req.body.IC,req.body.COA,req.body.COE];
		connection.query(sql3,value3, function (err, result) {	if (err) throw err;});

		var sql4 = "UPDATE  award_distribution SET Max_IC_Technical= ?,Max_IC_Cultural=?,COA_times=?,COE_times=?";
		var value4 =[req.body.Max_IC_Technical,req.body.Max_IC_Cultural,req.body.COA_times,req.body.COE_times];
		connection.query(sql4,value4, function (err, result) {	if (err) throw err;});

		connection.query("SELECT * FROM participation_marks, organizing_marks ,eligibilty,award_distribution LIMIT 1",function (err, result, fields) {
		if (err) throw err;
		res.render('CollegeAdmin',{pmarks:result[0],omarks:result[0],eligibility:result[0],award:result[0]});
	});
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

app.get('/DisplayCriteria', function(req,res){
		connection.query("SELECT * FROM participation_marks, organizing_marks ,eligibilty,award_distribution LIMIT 1",function (err, result, fields) {
		if (err) throw err;
		res.render('DisplayCriteria',{pmarks:result[0],omarks:result[0],eligibility:result[0],award:result[0]});
	});
});

app.listen(3000, '0.0.0.0', function() {
	console.log('Hosting started...');
});
