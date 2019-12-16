var mysql = require('mysql');
var connection = mysql.createConnection({

	multipleStatements: true,
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'CCAS'
});

connection.connect(function(err){
if(!err) {
    console.log("Successful connection with MySQL Database");
} else {
    console.log("Error while connecting with Database :(");
}
});
module.exports = connection; 