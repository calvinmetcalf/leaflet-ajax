'use strict';
var express = require('express');
var app =  express();
var path = require('path');
var fs = require('fs');
var counties = JSON.parse(fs.readFileSync(path.join(__dirname, 'example', 'counties.geojson'), {encoding: 'utf8'}));

app.get('/example/counties.jsonp', function (req, res){
  res.jsonp(counties);
});
app.use('/example', express.static(path.join(__dirname, 'example')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.listen(3000);
