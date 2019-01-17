const express    = require('express');        // call express
const app        = express();                 // define our app using express
var bodyParser = require('body-parser');
//var stripe     = require("stripe")("CUSTOM_TEST_TOKEN");
var url = require('url');


////////////////////////////////
//server site workload.
const fs = require('fs');
var path = require('path');
var cheerio=require("cheerio"); //>> npm install cheerio




app.get("/", (req,res)=>{
  console.log("root ok");
  res.send("hello a.node.js");
});

app.get("/save2afile", (req,res)=>{
  console.log("root",req.url);

  var q = url.parse(req.url, true).query;
  var txt = q.fname + " " + q.dat;
  console.log(q);

  q.dat=decodeURIComponent(q.dat);//must see client encodeURIComponent.
  fs.writeFileSync(q.fname, q.dat, 'utf8');

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<html><body><h>'+JSON.stringify(q,null,4)+"</h></body></html>");
  res.end();
  //res.json(q);
  //res.send("<a/>")
  //console.log(txt);
});




var port=7778;
app.listen(7778, ()=>{
  console.log("app listern port:7778...");
});
console.log("port:",port);
///////////////////////////////
//php -S localhost:7778
// will override nodejs. server

/////////////////////////
// nodemon a.node.js
//
// client site:
// open restapi_tester.htm
// then click index button. 
