const http = require('http')
var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
  res.send("Please See other routes to learn react");
});

app.get('/index', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/bundle', function(req, res) {
  res.sendFile(path.join(__dirname + '/assets/bundle.js'));
});

app.listen(8080);
console.log("Starting Server at Port : " + 8080);
