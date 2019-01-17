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
  console.log("save2afile");
  res.send("hello");
});

app.get("/save2afile", (req,res)=>{
  console.log("root",req.url);
  //res.send("hello");
  var tj={a:'ff',b:'bb'};
  //res.json([tj,tj]);
  var q = url.parse(req.url, true).query;
  var txt = q.fname + " " + q.dat;
  console.log(q)


  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('Hello World!'+JSON.stringify(q,null,4));
  res.end();
  //res.json(q);
  //res.send("<a/>")
  //console.log(txt);
});




app.listen(7778, ()=>{
  console.log("a.node.js port:7778...");
});
///////
//php -S localhost:7778
// will override nodejs. server
