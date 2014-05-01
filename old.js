var http = require('http');
var mysql = require("mysql");
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var con = mysql.createConnection({
	host : 'pleblvl.com',
	user : 'root',
	password : '7845mF321'
});
app.use(bodyParser());
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
app.post('/sendmove', function(req, res){
	console.log(req.body.leTest);
  	res.send('test' + req.body.leTest);
  });
app.post('/retmove', function(req, res){
	console.log(req.body.leTest);
  	res.send('test' + req.body.leTest);
  });
app.listen(1337);
console.log('Server running at http://127.0.0.1:1337/');


function query(){

	con.query('select 1 + 1 as solution', function(err, rows, fields){
	if(err) throw err;
	console.log('solution', rows[0].solution);
	});

}