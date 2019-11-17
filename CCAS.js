var express=require("express");
var bodyParser=require('body-parser');
var session = require('express-session');
var connection = require('./config');
const multer = require('multer');
const path = require('path');
const mime = require('mime');
var app = express();
var async=require('async');


app.use(express.static('Homepage'));
app.use(express.static('Login'));
app.use(express.static('Registration'));
app.use(express.static('Student'));
app.use(express.static('SocietyHead'));
app.use(express.static('uploads'));
app.use(express.static('DisplayCriteria'));
app.use(express.static('uploads/Requests'));
app.use(express.static('SocietiesDetail'));

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

var storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './SocietyHead/Requests')
  },
  filename: function (req, file, cb) {
			var filename =file.fieldname + '-' + req.session.SID + '-' + Date.now();
			req.session.requestupload = filename;
      cb(null,filename);
  }
});
var upload = multer({ storage: storage });
var uploadrequest = multer({ storage: storage2 });
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
					,req.body.Mobile,req.body.CGPA,req.body.Backlog,req.body.D_A,req.body.F_name,req.body.Address,0,0,0]];
  		connection.query(sql,[value], function (err, result) {if (err) throw err;});

				var interface ="Student";
				var society ="NotApplicable"
				var sql2 = "INSERT INTO login_details VALUES(?,md5(?),?,?)";
				var value2 =[req.body.SID,req.body.pass,interface,society];
				connection.query(sql2,value2, function (err, result) {if (err) throw err;});

				res.redirect('/');

});

app.get('/StudentFunc', studen,participation,achievement,organizer);
function studen(req,res,next){
		if(req.session.loggedin){
	    	connection.query("SELECT * FROM Student_Details where Student_Details.SID = ?",[req.session.SID],function (err, result, fields) {
	      if (err) throw err;
	      req.data=result[0];
	      next();
	  });
	}
	else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
	}

function participation(req,res,next){
	if(req.session.loggedin){

		var type="Participation";
			var type1 ="Event";
			var type2="Workshop";
			var values =[req.session.SID,type,type1,req.session.SID,type,type2];
			var sql="(Select Marks,Activity_Type,Event_Name as Activity_Name,Event_Location as Activity_Location,Event_Date as Activity_Date, P_Certification as Consider_for_certification,Society_Name from Event_Details INNER JOIN activity_mapping on Event_ID = Activity_ID where activity_mapping.SID=? and activity_mapping.Achievement_Type=? and activity_mapping.Activity_Type=? ) UNION (Select Marks,Activity_Type,Workshop_Name as Activity_Name,Workshop_Location as Activity_Location,Workshop_Date as Activity_Date,P_Certification as Consider_for_certification,Society_Name from Workshop_Details INNER JOIN activity_mapping on Workshop_ID=Activity_ID where activity_mapping.SID=? and activity_mapping.Achievement_Type=? and activity_mapping.Activity_Type=?)";
			connection.query(sql,values,function (err, result, fields) {
			if (err) throw err;
	   	req.pdata=result;
	   	next();
});
	}
		else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
	}

function achievement(req,res,next){
	if(req.session.loggedin){
	var type="Event";
	var first,second,third,fourth;
	first ="First"; second="Second"; third="Third"; fourth="Fourth";
	var values =[req.session.SID,type,first,second,third,fourth];
	var sql="Select Marks,Activity_Type,Achievement_Type, Event_Name as Activity_Name,Event_Location as Activity_Location,Event_Date as Activity_Date, P_Certification as Consider_for_certification,Society_Name from Event_Details INNER JOIN activity_mapping on Event_ID = Activity_ID where activity_mapping.SID=? and activity_mapping.Activity_Type=? and Achievement_Type IN (?,?,?,?) ";
	connection.query(sql,values,function (err, result, fields) {
			if (err) throw err;
	   	req.adata=result;
	   next();
	});
	}
		else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
	}

	function organizer(req,res){
		if(req.session.loggedin){

			var type="organizers";
			var type1 ="Event";
			var type2="Workshop";
			var values =[req.session.SID,type,type1,req.session.SID,type,type2];
			var sql="(Select Marks,Activity_Type,Event_Name as Activity_Name,Event_Location as Activity_Location,Event_Date as Activity_Date, P_Certification as Consider_for_certification,Society_Name from Event_Details INNER JOIN activity_mapping on Event_ID = Activity_ID where activity_mapping.SID=? and activity_mapping.Achievement_Type=? and activity_mapping.Activity_Type=? ) UNION (Select Marks,Activity_Type,Workshop_Name as Activity_Name,Workshop_Location as Activity_Location,Workshop_Date as Activity_Date,P_Certification as Consider_for_certification,Society_Name from Workshop_Details INNER JOIN activity_mapping on Workshop_ID=Activity_ID where activity_mapping.SID=? and activity_mapping.Achievement_Type=? and activity_mapping.Activity_Type=?)";
			connection.query(sql,values,function (err, result, fields) {
			if (err) throw err;
	   res.render('Student',{data:req.data,parti:req.pdata,achi:req.adata,organi:result});

	});
	}
		else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
	}

app.get('/View_Marks/:Sname', function(req,res){
	if(req.session.loggedin){
		      connection.query("SELECT * FROM marks where SID =? and  Societyname =?",[req.session.SID,req.params['Sname']],function(err,result2,fields){
	        res.send(result2[0]);
	       });
	  }
	});
app.get('/SocietyHeadFunc', function(req,res){
		if(req.session.loggedin){
			res.sendFile(__dirname + '/SocietyHead/SocietyheadMain.html')
	}
		else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
	});
app.post('/RequestInitiation',  uploadrequest.single('Certificate'),function(req,res){
	if(req.session.loggedin){
		var sql = "INSERT INTO Pending_Requests(SID,Event_Name,Event_Location,Event_Date,Achievement_Type,Institute_Type,Society_Associated,Certificate_URL) VALUES ?";
		var filepath = "Requests" + "/" + req.session.requestupload;
		var value =[[req.session.SID,req.body.Event_Name,req.body.Event_Location,req.body.Event_Date,req.body.Achievement,
		req.body.Institute_Type,req.body.Society,filepath]];
		connection.query(sql,[value], function (err, result) {
		if (err) throw err;
		res.redirect('/StudentFunc');
		});
}
		else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});
app.get('/RequestDisplay', function(req,res){
	if(req.session.loggedin){
							var s="Pending";
							connection.query("Select * from pending_requests where Society_Associated=? and Request_Status=? Limit 1 ",[req.session.Sname,s],function(err,result1,fields){
							res.send(result1[0]);});
						}
});
app.get('/Requestreject/:RID', function(req,res){
		if(req.session.loggedin){
			var t="Reject";
			connection.query("Update pending_requests  SET Request_Status=? where Request_ID=? ",[t,req.params['RID']],function(err,result1){});
			res.redirect('/SocietyHeadFunc');
		}
		else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});
app.get('/Requestapprove/:Sname', function(req,res){
		if(req.session.loggedin){

		async.series([
		function(callback) {
					connection.query("Select * from pending_requests,student_details  where pending_requests.SID=student_details.SID and Request_ID=?",[req.params['Sname']],function (err, result1, fields) {
					s1 =result1[0];	if (err) throw err;
					callback();});
		    },

 		function(callback) {
			values=[s1.Society_Associated,s1.Event_Name,s1.Event_Location,s1.Event_Date];
			connection.query("Insert into event_details(Society_Name,Event_Name,Event_Location,Event_Date) Values(?,?,?,?)",values,function(err,result){
			if(err) throw err;
			callback();});
		},
		function(callback){
			connection.query("Select * from participation_marks",function(err,result,fields){
			 m1=result[0];
			callback();});
		},
		function(callback){
			if(s1.Achievement_Type=="Participation" && s1.Institute_Type=="International")
			m2=m1.Int_Participation;
			else if((s1.Achievement_Type=="First" || s1.Achievement_Type=="Second" || s1.Achievement_Type=="Third" ||s1.Achievement_Type=="Fourth")&&s1.Institute_Type=="International")
			m2=m1.Int_Award;
			else if(s1.Achievement_Type=="Participation" && s1.Institute_Type=="National_P")
			m2=m1.Pr_Participation;
			else if((s1.Achievement_Type=="First" || s1.Achievement_Type=="Second" || s1.Achievement_Type=="Third" ||s1.Achievement_Type=="Fourth")&&s1.Institute_Type=="National_P")
			m2=m1.Pr_Award;
			else if(s1.Achievement_Type=="Participation" && s1.Institute_Type=="National_NP")
			m2=m1.PEC_Participation;
			else if((s1.Achievement_Type=="First" || s1.Achievement_Type=="Second" || s1.Achievement_Type=="Third" ||s1.Achievement_Type=="Fourth")&&s1.Institute_Type=="National_NP")
			m2=m1.PEC_Award;

			connection.query("Select * from event_details where Event_Name=?",[s1.Event_Name],function(err,result,fields){
			w=result[0];
			callback();});
		},

		function(callback){
			console.log(m2);
				val=[w.Event_ID,"Event",s1.SID,s1.Achievement_Type,m2];
				connection.query("Insert into activity_mapping(Activity_ID,Activity_Type,SID,Achievement_Type,Marks) Values(?,?,?,?,?)",val,function(err,result){
				if(err) throw err;
				callback();});
			},

			function(callback){
				connection.query("Select * From marks where SID=? and Societyname =?",[s1.SID,s1.Society_Associated],function (err, result4, fields){
					if(err) throw err;
					rows= result4;	callback();});
		},
		function(callback){
				if(rows.length == 0) connection.query("Insert into marks(SID,Societyname) Values(?,?)",[s1.SID,s1.Society_Associated],function (err, result5, fields){
					callback();
				});

			},
		function(callback){
				connection.query("Select * from marks where SID=? and Societyname=?",[s1.SID,s1.Society_Associated],function(err,result,fields){
				r=result[0];
				callback();});
		},

		function(callback){

				if(s1.Achievement_Type=="Participation" && s1.Year=="First"){
				q=r.P1+m2;
				c=[q,s1.SID,s1.Society_Associated];
				connection.query("Update marks SET P1=? where SID=? and Societyname=?",c,function(err,result) {
				if(err) throw err;});
				}
				else if((s1.Achievement_Type=="First" || s1.Achievement_Type=="Second" || s1.Achievement_Type=="Third" ||s1.Achievement_Type=="Fourth")&&s1.Year=="First")
				{
				q=r.A1+m2;
				c=[q,s1.SID,s1.Society_Associated];
				callbackonnection.query("Update marks SET A1=? where SID=? and Societyname=?",c,function(err,result) {
				if(err) throw err;
				});
				}
				else if(s1.Achievement_Type=="Participation" && s1.Year=="Second")
				{
				q=r.P2+m2;
				c=[q,s1.SID,s1.Society_Associated];
				connection.query("Update marks SET P2=? where SID=? and Societyname=?",c,function(err,result) {
				if(err) throw err;
				});
				}
				else if((s1.Achievement_Type=="First" || s1.Achievement_Type=="Second" || s1.Achievement_Type=="Third" ||s1.Achievement_Type=="Fourth")&&s1.Year=="Second")
				{
				q=r.A2+m2;
				c=[q,s1.SID,s1.Society_Associated];
				connection.query("Update marks SET A2=? where SID=? and Societyname=?",c,function(err,result) {
				if(err) throw err;
				});
				}
				else if(s1.Achievement_Type=="Participation" && s1.Year=="Third")
				{
				q=r.P3+m2;
				c=[q,s1.SID,s1.Society_Associated];
				connection.query("Update marks SET P3=? where SID=? and Societyname=?",c,function(err,result) {
				if(err) throw err;
				});
				}
				else if((s1.Achievement_Type=="First" || s1.Achievement_Type=="Second" || s1.Achievement_Type=="Third" ||s1.Achievement_Type=="Fourth")&&s1.Year=="Third")
				{
				q=r.A3+m2;
				c=[q,s1.SID,s1.Society_Associated];
				connection.query("Update marks SET A3=? where SID=? and Societyname=?",c,function(err,result) {
				if(err) throw err;
				});
				}
				else if(s1.Achievement_Type=="Participation" && s1.Year=="Fourth")
				{
				q=r.P4+m2;
				c=[q,s1.SID,s1.Society_Associated];
				connection.query("Update marks SET P4=? where SID=? and Societyname=?",c,function(err,result) {
				if(err) throw err;
				});
				}
				else if((s1.Achievement_Type=="First" || s1.Achievement_Type=="Second" || s1.Achievement_Type=="Third" ||s1.Achievement_Type=="Fourth")&&s1.Year=="Fourth")
				{
				q=r.A4+m2;
				c=[q,s1.SID,s1.Society_Associated];
				connection.query("Update marks SET A4=? where SID=? and Societyname=?",c,function(err,result) {
				if(err) throw err;
				});
				}
			}
	]);

var t ="Accept";
connection.query("Update pending_requests  SET Request_Status=? where Request_ID=?    ",[t,req.params['Sname']],function(err,result1){
if(err) throw err;});

res.redirect('/SocietyHeadFunc');
}
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



app.post('/AddEventDetails', upload.single('Upload_Certification_Data'),function(req,res){
	if(req.session.loggedin){
		var p,a,o;
		if(req.body.P_Certification) p = 1; else p=0; if(req.body.A_Certification) a = 1;	else a=0;
		if(req.body.O_Certification) o = 1;  else o=0;
		var values= [req.session.Sname,req.body.Event_name,req.body.Event_Location,req.body.Event_Date,req.body.Event_Sponsor,
			req.body.Event_Type,req.body.Participation_Count,p,o,a];
			connection.query("Insert into Event_Details(Society_Name,Event_Name,Event_Location,Event_Date,Event_Sponsor,Event_Type,Participation_Count,P_Certification,O_Certification,A_Certification) Values (?,?,?,?,?,?,?,?,?,?)",values,function (err, result, fields) {
			if (err) throw err;
	});

	const XLSX =require('xlsx');
	const workbook = XLSX.readFile(__dirname + '/uploads/UploadCertificationData.xlsx');
	const sheet_names = workbook.SheetNames;
	var p_obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_names[0]]);
	var a_obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_names[1]]);
	var o_obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_names[2]]);
	var pitr =0;var aitr =0; var oitr=0;

async.series([
    function(callback) {
			connection.query("Select * from participation_marks",function (err, result1, fields) {
			pmarks =result1;	if (err) throw err;
      callback();
			});
    },
    function(callback) {
			connection.query("Select * from organizing_marks",function (err, result2, fields) {
			omarks =result2;	if (err) throw err;
      callback();});
    },
		function(callback){
			var values2= [req.session.Sname,req.body.Event_name,req.body.Event_Location,req.body.Event_Date];
			connection.query("Select * from event_details where Society_Name =? and Event_Name =? and Event_Location =? and Event_Date=? ",values2,function (err, result3, fields) {
			eventId =result3[0].Event_ID;	if (err) throw err;
			callback();});
		},
		function(callback){
				while(p_obj[pitr++]){
				var type= "Participation";var actualp;

				if(p) actualp = pmarks[0].PEC_Participation;
				else actualp=0;

				var activity_type ="Event";
				var values3= [eventId,activity_type,p_obj[pitr-1].SID,type,actualp];
				connection.query("Insert into activity_mapping Values(?,?,?,?,?)",values3,function (err, result3, fields){if (err) throw err;});

				connection.query("Select * From marks where SID=? and Societyname =?",[p_obj[pitr-1].SID,req.session.Sname],function (err, result4, fields){
				if(result4.length == 0) connection.query("Insert into marks(SID,Societyname) Values(?,?)",[p_obj[pitr-1].SID,req.session.Sname],function (err, result4, fields){});})

				if(p){

							connection.query("SELECT * FROM student_details,marks where marks.SID = student_details.SID and marks.SID = ? and Societyname=?",[p_obj[pitr-1].SID,req.session.Sname],function (err, result5, fields) {
							year = result5[0].Year;
							if(year =="First"){
									connection.query("Update marks set P1= ? where SID=? and Societyname =?",[actualp + result5[0].P1,result5[0].SID,req.session.Sname],
									function (err, result3, fields){});
							}
							else if(year == "Second"){
										connection.query("Update marks set P2= ? where SID=? and Societyname =?",[actualp + result5[0].P2,result5[0].SID,req.session.Sname],
										function (err, result3, fields){});
							}
							else if(year == "Third"){
										connection.query("Update marks set P3= ? where SID=? and Societyname =?",[actualp + result5[0].P3,result5[0].SID,req.session.Sname],
										function (err, result3, fields){});
							}
							else if(year == "Fourth"){
										connection.query("Update marks set P4= ? where SID=? and Societyname =?",[actualp + result5[0].P4,result5[0].SID,req.session.Sname],
										function (err, result3, fields){});
							}

						});
					}
	}
	callback();
},
	function(callback){
		while(a_obj[aitr++]){

			var actuala ;
			if(a)	actuala = pmarks[0].PEC_Award;
			else actuala=0;

			var activity_type ="Event";
			var values= [eventId,activity_type,a_obj[aitr-1].SID,a_obj[aitr-1].Position,actuala];
			connection.query("Insert into activity_mapping Values(?,?,?,?,?)",values,function (err, result3, fields){if (err) throw err;});

			connection.query("Select * From marks where SID=? and Societyname =?",[a_obj[aitr-1].SID,req.session.Sname],function (err, result4, fields){
			if(result4.length == 0) connection.query("Insert into marks Value(?,?)",[a_obj[aitr-1].SID,req.session.Sname],function (err, result4, fields){});})

			if(a){
						connection.query("SELECT * FROM student_details,marks where marks.SID = student_details.SID and marks.SID = ? and Societyname=?",[a_obj[aitr-1].SID,req.session.Sname],function (err, result, fields) {
						year = result[0].Year;
						if(year =="First"){
							connection.query("Update marks set A1=? where SID=? and Societyname =?",[actuala + result[0].A1,result[0].SID,req.session.Sname],
							function (err, result3, fields){});
						}
						else if(year == "Second"){
							connection.query("Update marks set A2=? where SID=? and Societyname =?",[actuala + result[0].A2,result[0].SID,req.session.Sname],
							function (err, result3, fields){});
						}
						else if(year == "Third"){
							connection.query("Update marks set A3= ? where SID=? and Societyname =?",[actuala + result[0].A3,result[0].SID,req.session.Sname],
							function (err, result3, fields){});
						}
						else if(year == "Fourth"){
							connection.query("Update marks set A4=? where SID=? and Societyname =?",[actuala+ result[0].A4,result[0].SID,req.session.Sname],
							function (err, result3, fields){});
						}
					});
			}
		}
		callback();
},
function(callback){

	while(o_obj[oitr++]){

			var actualo ;
			if((req.body.Participation_Count <250) && (o ==1 )) actualo = omarks[0].Lt250;
			else if((req.body.Participation_Count >= 250 ) && (o ==1 )) actualo = omarks[0].Gt250;
			else actualo =0;

			var type ="organizers";
			var activity_type ="Event";
			var values= [eventId,activity_type,o_obj[oitr-1].SID,type,actualo];
			connection.query("Insert into activity_mapping Values(?,?,?,?,?)",values,function (err, result3, fields){if (err) throw err;});

			connection.query("Select * From marks where SID=? and Societyname =?",[o_obj[oitr-1].SID,req.session.Sname],function (err, result4, fields){
			if(result4.length == 0) connection.query("Insert into marks Value(?,?)",[o_obj[oitr-1].SID,req.session.Sname],function (err, result4, fields){});})

		if(o && (oitr-1)<= omarks[0].Max_Organizers){

					connection.query("SELECT * FROM student_details,marks where marks.SID = student_details.SID and marks.SID = ? and Societyname=?",[o_obj[oitr-1].SID,req.session.Sname],function (err, result, fields) {
					year = result[0].Year;
					if(year =="First"){
						connection.query("Update marks set O1=? where SID=? and Societyname =?",[actualo + result[0].O1,result[0].SID,req.session.Sname],
						function (err, result3, fields){});
					}
					else if(year == "Second"){
						connection.query("Update marks set O2= ? where SID=? and Societyname =?",[actualo + result[0].O2,result[0].SID,req.session.Sname],
						function (err, result3, fields){});
					}
					else if(year == "Third"){
												connection.query("Update marks set O3=? where SID=? and Societyname =?",[actualo + result[0].O3,result[0].SID,req.session.Sname],
						function (err, result3, fields){});
					}
					else if(year == "Fourth"){
						connection.query("Update marks set O4=? where SID=? and Societyname =?",[actualo + result[0].O4,result[0].SID,req.session.Sname],
						function (err, result3, fields){});
					}
				});
			}
	}
	callback();
}
  ],
  function(err) {
  });
		res.redirect('/SocietyHeadFunc');
}
	else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});

app.post('/AddWorkshopDetails', upload.single('Upload_Certification_Data'), function(req,res){
	if(req.session.loggedin){
			var p,o;
			if(req.body.P_Certification) p = 1; else p=0;
			if(req.body.O_Certification) o = 1;  else o=0;

			var values= [req.session.Sname,req.body.Workshop_Name,req.body.Workshop_Location,req.body.Workshop_Date,req.body.Workshop_Sponsor,
				req.body.Workshop_Type,req.body.Participation_Count,p,o];
				connection.query("Insert into Workshop_Details(Society_Name,Workshop_Name,Workshop_Location,Workshop_Date,Workshop_Sponsors,Workshop_Type,Participation_Count,P_Certification,O_Certification) Values (?,?,?,?,?,?,?,?,?)",values,function (err, result, fields) {
				if (err) throw err;
		});

		const XLSX =require('xlsx');
		const workbook = XLSX.readFile(__dirname + '/uploads/UploadCertificationData.xlsx');
		const sheet_names = workbook.SheetNames;
		var p_obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_names[0]]);
		var o_obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_names[2]]);
		var pitr =0;var oitr=0;

	async.series([
	    function(callback) {
				connection.query("Select * from participation_marks",function (err, result1, fields) {
				pmarks =result1;	if (err) throw err;
	      callback();
				});
	    },
	    function(callback) {
				connection.query("Select * from organizing_marks",function (err, result2, fields) {
				omarks =result2;	if (err) throw err;
	      callback();});
	    },
			function(callback){
				var values2= [req.session.Sname,req.body.Workshop_Name,req.body.Workshop_Location,req.body.Workshop_Date];
				connection.query("Select * from Workshop_details where Society_Name =? and Workshop_Name =? and Workshop_Location =? and Workshop_Date=? ",values2,function (err, result3, fields) {
				workshopId =result3[0].Workshop_ID;	if (err) throw err;
				callback();});
			},
			function(callback){
					while(p_obj[pitr++]){
					var type= "Participation";var actualp;
					if(p) actualp = pmarks[0].PEC_Participation;
					else actualp=0;

					var activity_type ="Workshop";
					var values3= [workshopId,activity_type,p_obj[pitr-1].SID,type,actualp];
					connection.query("Insert into activity_mapping Values(?,?,?,?,?)",values3,function (err, result3, fields){if (err) throw err;});

					connection.query("Select * From marks where SID=? and Societyname =?",[p_obj[pitr-1].SID,req.session.Sname],function (err, result4, fields){
					if(result4.length == 0) connection.query("Insert into marks(SID,Societyname) Values(?,?)",[p_obj[pitr-1].SID,req.session.Sname],function (err, result4, fields){});})

					if(p){
								connection.query("SELECT * FROM student_details,marks where marks.SID = student_details.SID and marks.SID = ? and Societyname=?",[p_obj[pitr-1].SID,req.session.Sname],function (err, result5, fields) {
								year = result5[0].Year;
								if(year =="First"){
										connection.query("Update marks set P1= ? where SID=? and Societyname =?",[actualp + result5[0].P1,result5[0].SID,req.session.Sname],
										function (err, result3, fields){});
								}
								else if(year == "Second"){
											connection.query("Update marks set P2= ? where SID=? and Societyname =?",[actualp + result5[0].P2,result5[0].SID,req.session.Sname],
											function (err, result3, fields){});
								}
								else if(year == "Third"){

											connection.query("Update marks set P3= ? where SID=? and Societyname =?",[actualp + result5[0].P3,result5[0].SID,req.session.Sname],
											function (err, result3, fields){
											console.log(result3);
											console.log(err);
											});
								}
								else if(year == "Fourth"){
											connection.query("Update marks set P4= ? where SID=? and Societyname =?",[actualp + result5[0].P4,result5[0].SID,req.session.Sname],
											function (err, result3, fields){});
								}

							});
						}
		}
		callback();
	},
	function(callback){

		while(o_obj[oitr++]){

				var actualo ;
				if((req.body.Participation_Count <250) && (o ==1 )) actualo = omarks[0].Lt250;
				else if((req.body.Participation_Count >= 250 ) && (o ==1 )) actualo = omarks[0].Gt250;
				else actualo =0;

				var type ="organizers";
				var activity_type ="Workshop";
				var values= [workshopId,activity_type,o_obj[oitr-1].SID,type,actualo];
				connection.query("Insert into activity_mapping Values(?,?,?,?,?)",values,function (err, result3, fields){if (err) throw err;});
	
				connection.query("Select * From marks where SID=? and Societyname =?",[o_obj[oitr-1].SID,req.session.Sname],function (err, result4, fields){
				if(result4.length == 0) connection.query("Insert into marks Value(?,?)",[o_obj[oitr-1].SID,req.session.Sname],function (err, result4, fields){});})

			if(o && (oitr-1)<= omarks[0].Max_Organizers){

						connection.query("SELECT * FROM student_details,marks where marks.SID = student_details.SID and marks.SID = ? and Societyname=?",[o_obj[oitr-1].SID,req.session.Sname],function (err, result, fields) {
						year = result[0].Year;
						if(year =="First"){
							connection.query("Update marks set O1=? where SID=? and Societyname =?",[actualo + result[0].O1,result[0].SID,req.session.Sname],
							function (err, result3, fields){});
						}
						else if(year == "Second"){
							connection.query("Update marks set O2= ? where SID=? and Societyname =?",[actualo + result[0].O2,result[0].SID,req.session.Sname],
							function (err, result3, fields){});
						}
						else if(year == "Third"){
													connection.query("Update marks set O3=? where SID=? and Societyname =?",[actualo + result[0].O3,result[0].SID,req.session.Sname],
							function (err, result3, fields){});
						}
						else if(year == "Fourth"){
							connection.query("Update marks set O4=? where SID=? and Societyname =?",[actualo + result[0].O4,result[0].SID,req.session.Sname],
							function (err, result3, fields){});
						}
					});
				}
		}
		callback();
	}
	  ],
	  function(err) {
	  });
			res.redirect('/SocietyHeadFunc');
	}
		else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
	});
app.get('/CollegeAdmin', function(req,res){
	if(req.session.loggedin){
		connection.query("SELECT * FROM participation_marks, organizing_marks ,eligibilty,award_distribution LIMIT 1",function (err, result, fields) {
		if (err) throw err;
		res.render('CollegeAdmin',{pmarks:result[0],omarks:result[0],eligibility:result[0],award:result[0],variable:""});
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

		res.redirect('/CollegeAdmin');
	}
	else res.send("<h1>Session Timed Out Please <a href=\"/login\"> Login</a> again");
});
app.get('/CoaEligible/:Sname', function(req,res){
	if(req.session.loggedin){
		var second ="Second";
		var third = "Third";
		var fourth ="Fourth";
		var status =0;

		var sql ="Select * from student_details, Marks,eligibilty where student_details.SID = marks.SID and Societyname=? and ((Year = ? and (P1+ A1+O1) > COA ) or (Year= ? and COA_Status =? and (P2+A2+O2)> COA) or (Year=? and COA_Status=? and (P3+A3+O3)>COA))";
		connection.query(sql,[req.params['Sname'],second,third,status,fourth,status],function (err, result, fields) {
		if (err) throw err;
		res.send(result);
	});

}
});
app.get('/CoeEligible/:Sname', function(req,res){

		if(req.session.loggedin){
		var third="Third";
		var status = 1;
		var fourth = "Fourth";
		var status1 = 0;
		var values =[req.params['Sname'],third,status,fourth,status,status1];
		var sql= "Select * from student_details, Marks,eligibilty where student_details.SID = marks.SID and Societyname = ? and ((Year = ? and COA_Status= ? and (P1+ A1+O1) > COE and (P2+A2+O2)> COE ) or (Year= ? and COA_Status = ? and COE_Status = ? and (P3+A3+O3)> COE and (P2+A2+O2)> COE))";
		connection.query(sql,values,function (err, result, fields) {
		if (err) throw err;
		res.send(result);
	});

}
});
app.get('/IcEligible/:Sname', function(req,res){
    if(req.session.loggedin){
				var fourth = "Fourth";
	    	var status = 1;
				var icstatus = 0;
		 		var sql = "Select * from student_details, Marks,eligibilty where student_details.SID =marks.SID and Societyname = ? and (Year = ? and COE_Status = ? and IC_Status = ? and (P4+A4+O4)> IC and (P3+A3+O3)> IC and (P2+A2+O2)> IC)";
				connection.query(sql,[req.params['Sname'],fourth,status,icstatus],function (err, result, fields) {
				if (err) throw err;
					res.send(result);
	});

}
});

app.get('/AwardList/:AwardType', function(req,res){
    if(req.session.loggedin){
			if(req.params['AwardType']=="COA"){
					var second ="Second";
					var third = "Third";
					var status =0;
					var fourth ="Fourth";
					connection.query("Delete from eligible_students",function(err,result,fields){});
					connection.query("Insert into eligible_students(Societyname,COA) Select Societyname, Count(*) from student_details, Marks,eligibilty where student_details.SID = marks.SID and ((Year = ? and (P1+ A1+O1) > COA ) or (Year= ? and COA_Status =? and (P2+A2+O2)> COA) or (Year=? and COA_Status=? and (P3+A3+O3)>COA)) Group by Societyname",[second,third,status,fourth,status],function(err,result,fields){});


					async.series([
					    function(callback) {
								connection.query("Select SUM(COA) as sum from eligible_students",function (err, result1, fields) {
								sum_coa = result1[0].sum;
								if (err) throw err; callback();
								});
					    },
					    function(callback) {
								connection.query("Select * from award_distribution",function (err, result2, fields) {
								allowed  =(result2[0].Max_IC_Technical + result2[0].Max_IC_Cultural)* result2[0].COA_times;
								if (err) throw err;
					      callback();});
					    },
							function(callback) {
								var multiply;
								if(sum_coa<=allowed) multiply =1;
								else multiply = allowed/sum_coa;
								connection.query("Update eligible_students set COA= COA*?",multiply,function (err, result2, fields) {
								if (err) throw err;callback();});
					    },
							function(callback) {
								connection.query("Select Societyname,COA from eligible_students",function (err, result3, fields) {
								if (err) throw err;
								society_data =result3;
								callback();});
					    },
						],
						function(err) {
							var sql3 ="Delete from COA_Award ";
							connection.query(sql3,function (err, final_result, fields) {if (err) throw err;});

							var second ="Second";
							var third = "Third";
							var status =0;
							var fourth="Fourth";

									var j=0;
										while(society_data[j]){
												var sql ="Insert into COA_Award Select Year,student_details.SID,name,marks.Societyname,(P1+P2+P3+P4) as P_marks,(A1+A2+A3+A4) as A_marks,(O1+O2+O3+O4) as O_marks,(P1+P2+P3+P4+A1+A2+A3+A4 +O1+O2+O3+O4) as total_marks from student_details, Marks,eligibilty,eligible_students where student_details.SID = marks.SID and marks.Societyname = eligible_students.Societyname and marks.Societyname = ? and  ((Year = ? and (P1+ A1+O1) > eligibilty.COA ) or (Year= ? and COA_Status =? and (P2+A2+O2)> eligibilty.COA) or (Year=? and COA_Status=? and (P3+A3+O3)>eligibilty.COA)) ORDER BY total_marks DESC LIMIT ?";
												connection.query(sql,[society_data[j].Societyname,second,third,status,fourth,status,society_data[j].COA],function (err, result, fields) {
												if (err) throw err;});
													j++;
												}

									var sql2 ="Select * from COA_Award order by Total_Marks DESC";
									connection.query(sql2,function (err, final_result, fields) {
									if (err) throw err;
									res.send(final_result);

						});

		}
	)
}
			else if(req.params['AwardType']=="COE"){

					var third="Third";
					var status = 1;
					var fourth = "Fourth";
					var status1 = 0;
					var values =[third,status,fourth,status,status1];
					connection.query("Delete from eligible_students",function(err,result,fields){});
					connection.query("Insert into eligible_students(Societyname,COE) Select Societyname, Count(*)  from student_details, Marks,eligibilty where student_details.SID = marks.SID and ((Year = ? and COA_Status= ? and (P1+ A1+O1) > COE and (P2+A2+O2)> COE ) or (Year= ? and COA_Status = ? and COE_Status = ? and (P3+A3+O3)> COE and (P2+A2+O2)> COE)) Group by Societyname",values,function(err,result,fields){});


										async.series([
										    function(callback) {
													connection.query("Select SUM(COE) as sum from eligible_students",function (err, result1, fields) {
													sum_coe = result1[0].sum;
													if (err) throw err; callback();
													});
										    },
										    function(callback) {
													connection.query("Select * from award_distribution",function (err, result2, fields) {
													allowed  =(result2[0].Max_IC_Technical + result2[0].Max_IC_Cultural)* result2[0].COE_times;
													if (err) throw err;
										      callback();});
										    },
												function(callback) {
													var multiply;
													if(sum_coe<=allowed) multiply =1;
													else multiply = allowed/sum_coe;
													connection.query("Update eligible_students set COE= COE*?",multiply,function (err, result2, fields) {
													if (err) throw err;callback();});
										    },
												function(callback) {
													connection.query("Select Societyname,COE from eligible_students",function (err, result3, fields) {
													if (err) throw err;
													society_data =result3;
													callback();});
										    },
											],
											function(err) {
												var sql3 ="Delete from COE_Award ";
												connection.query(sql3,function (err, final_result, fields) {if (err) throw err;});

												var third="Third";
												var status = 1;
												var fourth = "Fourth";
												var status1 = 0;

														var j=0;
															while(society_data[j]){
																	var sql ="Insert into COE_Award Select Year,student_details.SID,name,marks.Societyname,(P1+P2+P3+P4) as P_marks,(A1+A2+A3+A4) as A_marks,(O1+O2+O3+O4) as O_marks,(P1+P2+P3+P4+A1+A2+A3+A4 +O1+O2+O3+O4) as total_marks from student_details, Marks,eligibilty,eligible_students where student_details.SID = marks.SID and marks.Societyname = eligible_students.Societyname and marks.Societyname = ? and  ((Year = ? and COA_Status= ? and (P1+ A1+O1) > eligibilty.COE and (P2+A2+O2)> eligibilty.COE ) or (Year= ? and COA_Status = ? and COE_Status = ? and (P3+A3+O3)> eligibilty.COE and (P2+A2+O2)> eligibilty.COE)) ORDER BY total_marks DESC LIMIT ?";
																	connection.query(sql,[society_data[j].Societyname,third,status,fourth,status,status1,society_data[j].COE],function (err, result, fields) {
																	if (err) throw err;
																	console.log(result);});
																		j++;
																	}

														var sql2 ="Select * from COE_Award order by Total_Marks DESC";
														connection.query(sql2,function (err, final_result, fields) {
														if (err) throw err;
														res.send(final_result);

											});

							}
						)
			}
			else if(req.params['AwardType']=="IC"){

					var fourth = "Fourth";
					var status = 1;
					var icstatus = 0;
					var values = [fourth,status,icstatus];
					connection.query("Delete from eligible_students",function(err,result,fields){});
					connection.query("Insert into eligible_students(Societyname,IC) Select Societyname,Count(*)  from student_details, Marks,eligibilty where student_details.SID =marks.SID and (Year = ? and COE_Status = ? and IC_Status = ? and (P4+A4+O4)> IC and (P3+A3+O3)> IC and (P2+A2+O2)> IC) Group by Societyname",values,function(err,result,fields){});

					async.series([
					    function(callback) {
								connection.query("Select SUM(IC) as sum from eligible_students",function (err, result1, fields) {
								sum_ic = result1[0].sum;
								if (err) throw err; callback();
								});
					    },
					    function(callback) {
								connection.query("Select * from award_distribution",function (err, result2, fields) {
								allowed  =(result2[0].Max_IC_Technical + result2[0].Max_IC_Cultural);
								if (err) throw err;
					      callback();});
					    },
							function(callback) {
								var multiply;
								if(sum_ic<=allowed) multiply =1;
								else multiply = allowed/sum_ic;
								connection.query("Update eligible_students set IC= IC*?",multiply,function (err, result2, fields) {
								if (err) throw err;callback();});
					    },
							function(callback) {
								connection.query("Select Societyname,IC from eligible_students",function (err, result3, fields) {
								if (err) throw err;
								society_data =result3;
								callback();});
					    },
						],
						function(err) {
							var sql3 ="Delete from IC_Award";
							connection.query(sql3,function (err, final_result, fields) {if (err) throw err;});

							var fourth = "Fourth";
							var status = 1;
							var icstatus = 0;

									var j=0;
										while(society_data[j]){
												var sql ="Insert into IC_Award Select Year,student_details.SID,name,marks.Societyname,(P1+P2+P3+P4) as P_marks,(A1+A2+A3+A4) as A_marks,(O1+O2+O3+O4) as O_marks,(P1+P2+P3+P4+A1+A2+A3+A4 +O1+O2+O3+O4) as total_marks from student_details, Marks,eligibilty,eligible_students where student_details.SID = marks.SID and marks.Societyname = eligible_students.Societyname and marks.Societyname = ? and (Year = ? and COE_Status = ? and IC_Status = ? and (P4+A4+O4)> eligibilty.IC and (P3+A3+O3)> eligibilty.IC and (P2+A2+O2)> eligibilty.IC) ORDER BY total_marks DESC LIMIT ?";
												connection.query(sql,[society_data[j].Societyname,fourth,status,icstatus,society_data[j].IC],function (err, result, fields) {
												if (err) throw err;});
													j++;
												}

									var sql2 ="Select * from IC_Award order by Total_Marks DESC";
									connection.query(sql2,function (err, final_result, fields) {
									if (err) throw err;
									console.log(final_result);
									res.send(final_result);

						});

		}
	)
			}

}
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

app.get('/TechnicalDispaly', function(req,res){
	res.sendFile(__dirname + '/SocietiesDetail/technical.html');
});

app.get('/CulturalDisplay', function(req,res){
	res.sendFile(__dirname + '/SocietiesDetail/cultural.html');
});

app.listen(3000, '0.0.0.0', function() {
	console.log('Hosting started...');
});
