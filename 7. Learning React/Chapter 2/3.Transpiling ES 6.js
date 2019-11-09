const http = require('http')
var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
  console.log(path.join(__dirname + '/3. Transpiling ES 6.html'))
  res.sendFile(path.join(__dirname + '/3. Transpiling ES 6.html'));
});

app.listen(8080);
