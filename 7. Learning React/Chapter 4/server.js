const http = require('http')
var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
  res.send("Please See other routes to learn react");
});

app.get('/pure_html', function(req, res) {
  res.sendFile(path.join(__dirname + '/pure_html.html'));
});

app.get('/pure_react', function(req, res) {
  res.sendFile(path.join(__dirname + '/pure_react.html'));
});

app.get('/react_component', function(req, res) {
  res.sendFile(path.join(__dirname + '/react_component.html'));
});

app.get('/react_component2', function(req, res) {
  res.sendFile(path.join(__dirname + '/react_component2.html'));
});

app.get('/dom_rendering', function(req, res) {
  res.sendFile(path.join(__dirname + '/dom_rendering.html'));
});

app.get('/factories', function(req, res) {
  res.sendFile(path.join(__dirname + '/factories.html'));
});

app.listen(8080);
console.log("Starting Server at Port : " + 8080);
