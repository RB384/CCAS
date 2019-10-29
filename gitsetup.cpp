hello puneet
hello raghav
123
jatinder singh
raghavbansaal
var sql2 = "INSERT INTO organizing_marks VALUES ?";
var value2 =[[req.body.Lt250,req.body.Gt250,req.body.Max_Organizers]];
connection.query(sql2,[value2], function (err, result) {	if (err) throw err;});

var sql3 = "INSERT INTO eligibilty VALUES ?";
var value3 =[[req.body.IC,req.body.COA,req.body.COE]];connection.query(sql3,[value3], function (err, result) {	if (err) throw err;});

var sql4 = "INSERT INTO award_distribution VALUES ?";
var value4 =[[req.body.Max_IC_Technical,req.body.Max_IC_Cultural,req.body.COA_times,req.body.COE_times]];
connection.query(sql4,[value4], function (err, result) {	if (err) throw err;});
