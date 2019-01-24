const express = require('express');        // call express
const app = express();                 // define our app using express
var bodyParser = require('body-parser');
//var stripe     = require("stripe")("CUSTOM_TEST_TOKEN");
var url = require('url');


////////////////////////////////
//server site workload.
const fs = require('fs');
var path = require('path');
var cheerio = require("cheerio"); //>> npm install cheerio


app.g_iPort = 7778;
app.get("/", (req, res) => {
  console.log("root ok");
  //res.send("<script>alert(\'ss\');</script>");
  var obj = { samp: 'ffa' };
  var s = JSON.stringify(obj);
  res.send("clientSiteFuntion(" + s + ");");
});
app.get("/Jsonpster", (req, res) => {
  console.log();
  console.log("res.req.headers.host=",res.req.headers.host);
  Object.keys(res.req.headers).forEach(function(v){
    console.log(v);
  })
  
  var q = url.parse(req.url, true).query;
  q.test = function (i) {
    alert(i);
  }
  console.log(JSON.stringify(q));

  //
  var s = "var Jsonpster={};";
  s += "Jsonpster.Url=function(){return 'http://" + res.req.headers.host + "/'+this.api+'?inp='+this.inp;};";
  s += "Jsonpster.Run=function(prm,cbf){Object.assign(this,prm);this.Response=cbf;if(!cbf)this.Response=function(){alert('cb is null');};var s=document.createElement('script');s.src=this.Url();document.body.appendChild(s);};";
  console.log(s);
  res.send(s);
  res.end();
});




var Uti = {
  getFileNamesFromDir: function (startPath, filter) {
    function recursiveDir(startPath, filter, xx) {
      var files = fs.readdirSync(startPath);
      for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        //console.log(filename);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
          recursiveDir(filename, filter); //recurse
        }
        else if (filename.indexOf(filter) >= 0) {
          //console.log('-- found: ',filename);
          outFilesArr.push(filename);
        };
      };
    }
    var outFilesArr = [];
    recursiveDir(startPath, filter);
    return outFilesArr;
  },
};//////Uti//////




var HebrewQ = function () {

}
HebrewQ.prototype.get_VocabHebrewBufObj = function () {
  var currentPath = process.cwd();
  console.log(currentPath);

  var filesArr = Uti.getFileNamesFromDir("../../../../../../btool/tool/HebrewQ/audjs/", ".js");
  console.log(filesArr);

  //return;
  var targf = "../../../../../../btool/tool/HebrewQ/audjs/VocabHebrewBuf.js"
  var content = fs.readFileSync(targf, "utf8");
  var idx = 2 + content.indexOf("=\n");
  var shead = content.substr(0, idx);
  console.log("shead==", shead);
  content = content.substring(idx);

  var obj = JSON.parse(content);
  Object.keys(obj).forEach(function (k) {
    var arr = obj[k];
    //console.log(k,arr);
  });
  return { header: shead, obj: obj, fname: targf };
}
HebrewQ.prototype.updateVocabHebrewBuf = function (q) {
  var inp = JSON.parse(q.in);
  inp.dat = decodeURIComponent(inp.dat);//must see client encodeURIComponent.
  fs.writeFileSync(inp.fname, inp.dat, 'utf8');//debug only.

  var upobj = JSON.parse(inp.dat);
  var rsObj = hbrq.get_VocabHebrewBufObj();
  Object.keys(upobj).forEach(function (k) {
    rsObj.obj[k] = upobj[k];
  });
  var s = rsObj.header;
  s += JSON.stringify(rsObj.obj, null, 4);
  fs.writeFileSync(rsObj.fname, s);
}
var hbrq = new HebrewQ();




var SvrApi = {
  updateVocabHebrewBuf: function (req, res) {
    console.log("root", req.url);

    var q = url.parse(req.url, true).query;
    console.log(q);

    //hbrq.updateVocabHebrewBuf(q);

    //res.json(q);
    //res.send("<a/>")
    //console.log(txt);
  },
  updateVocabHebrewDat: function (req, res) {

  },
};//////SvrApi////////
Object.keys(SvrApi).forEach(function (api) {
  app.get("/" + api, (req, res) => {
    var ret=SvrApi[api](req, res);
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.write("Jsonpster.Response("+ret+");");
    res.end();
  });
});




app.listen(app.g_iPort, () => {
  console.log("app listern port:7778...");
  hbrq.get_VocabHebrewBufObj();
});
console.log("port:", app.g_iPort);
///////////////////////////////
//php -S localhost:7778
// will override nodejs. server

/////////////////////////
// Server Site:
// nodemon a.node.js
//
// client site:
// open restapi_tester.htm
// then click index button.



