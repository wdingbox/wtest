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
  console.log("res.req.headers.host=", res.req.headers.host);
  //res.send("<script>alert(\'ss\');</script>");
  var obj = { samp: 'ffa' };
  var s = JSON.stringify(res.req.headers);
  res.send("restapi Jsonpster. clientSite:" + s);
});
app.get("/Jsonpster", (req, res) => {
  console.log();
  console.log("res.req.headers.host=", res.req.headers.host);
  Object.keys(res.req.headers).forEach(function (v) {
    console.log(v);
  })

  var q = url.parse(req.url, true).query;
  q.test = function (i) {
    alert(i);
  }
  console.log(JSON.stringify(q));

  //
  var s = "var Jsonpster={};";
  s += "Jsonpster.Url=function(){return 'http://" + res.req.headers.host + "/'+this.api+'?inp='+encodeURIComponent(JSON.stringify(this.inp));};";
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

  GetJsonStringFrmFile: function (fname) {
    var content = fs.readFileSync(fname, "utf8");
    var idx = 2 + content.indexOf("=\n");
    var shead = content.substr(0, idx);
    console.log("shead==", shead);
    content = content.substring(idx);
    return content;
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
HebrewQ.prototype.updateVocabHebrewBuf = function (inpObj) {
  fs.writeFileSync(inpObj.fname, JSON.stringify(inpObj.dat, null, 4), 'utf8');//debug only.

  var upobj = inpObj.dat;//JSON.parse(inp.dat);
  var rsObj = hbrq.get_VocabHebrewBufObj();
  Object.keys(upobj).forEach(function (k) {
    rsObj.obj[k] = upobj[k];
  });
  var s = rsObj.header;
  s += JSON.stringify(rsObj.obj, null, 4);
  fs.writeFileSync(rsObj.fname, s);
}
var hbrq = new HebrewQ();







var BibleObj = function () {
};
BibleObj.prototype.load_BibleJstrn = function (fname) {
  var spathfile = "../../../jsdb/jsBibleObj/H_G.json.js";
  spathfile = "../../../jsdb/jsBibleObj/"+fname+".json.js";
  var content = Uti.GetJsonStringFrmFile(spathfile);
  return content;
};
BibleObj.prototype.load_BibleObj = function (fname) {
  var content = this.load_BibleJstrn(fname);
  var bobj = JSON.parse(content);
  return bobj;
};
BibleObj.prototype.fetch_bibObj_by_keyParm = function (srcObj, keyObj) {
  var retObj = {};
  var arr = ["vol", "chp", "vrs"];
  var p = srcObj, p2 = retObj;
  console.log("keyObj=====");
  console.log(keyObj);

  for (var i = 0; i < arr.length; i++) {
    if(undefined === keyObj[arr[i]]){
      console.log("*** input keys not match keyObj keys ***");
      console.log("keyObj=",keyObj);
      console.log("keys should be:",arr);
      return {};
    }
    var key = keyObj[arr[i]];
    if (undefined != p[key]) {
      if ("string" == typeof p[key]) {
        p2[key] = p[key];
        break;
      } else if ("object" == typeof p[key]) {
        p2[key] = {};
        p = p[key];
        p2 = p2[key];
      }else{
        console.log("*******fatal err: key unmatch*********");
        break;
      }
    }else{
      console.log("Object.assign(p2,p); --undefined key=",key);
      //console.log("p===",p);
      //console.log("p2===",p2);
      Object.assign(p2,p);
      break;
    };
  };
  // console.log("p=", p);
  // console.log("p2=", p2);
  // console.log("retObj=", retObj);
  return retObj;
};
BibleObj.prototype.load_Bkn_VolChpVrs = function (inpObj) {
  var bobj = this.load_BibleObj(inpObj.fname);//.fname, inpObj.dat
  var retObj = this.fetch_bibObj_by_keyParm(bobj, inpObj.dat);
  var ss = JSON.stringify(retObj);
  return ss;
}

var SvrApi = {
  GetApiInputParamObj: function (req, res) {
    console.log("req.url=", req.url);
    var q = url.parse(req.url, true).query;
    console.log("q=", q);
    var s = decodeURIComponent(q.inp);//must for client's encodeURIComponent
    var inpObj = JSON.parse(s);
    console.log("inpObj=", inpObj);
    return inpObj;
  },
  updateVocabHebrewBuf: function (inpObj) {
    return hbrq.updateVocabHebrewBuf(inpObj);
  },
  updateVocabHebrewDat: function (inpObj) {

  },
  loadBibleObj: function (inpObj) {
    console.log("... loadBibleObj ...");
    var bo = new BibleObj();
    return bo.load_BibleJstrn();
  },
  loadBible_Bkn_VolChpVrs: function (inpObj) {
    console.log("... loadBible_Bkn_VolChpVrs ...");
    var bo = new BibleObj();
    var ss = bo.load_Bkn_VolChpVrs(inpObj);
    return ss;
  }
};//////SvrApi///////////////////////////////////
Object.keys(SvrApi).forEach(function (api) {
  app.get("/" + api, (req, res) => {
    var inpObj = SvrApi.GetApiInputParamObj(req, res);
    var ret = SvrApi[api](inpObj);
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.write("Jsonpster.Response(" + ret + ");");
    res.end();
  });
});
////////////////////////////////////////////////




app.listen(app.g_iPort, () => {
  console.log("app listern port:7778...");
  hbrq.get_VocabHebrewBufObj();
});
console.log("port:", app.g_iPort);
///////////////////////////////
// php -S localhost:7778
// will override nodejs. server
//
// https://www.npmjs.com/package/nodemon
// npm install -g nodemon
/////////////////////////
// Server Site:
// nodemon a.node.js
//
// client site:
// open restapi_tester.htm
// then click index button.



