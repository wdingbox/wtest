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
    var idx = content.indexOf("{");
    var shead = content.substr(0, idx);
    console.log("shead==", shead);
    content = content.substring(idx);
    return { fname: fname, header: shead, jstrn: content };
  },

  getDateTime: function () {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + "," + hour + ":" + min + ":" + sec;

  }
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

BibleObj.prototype.BibleObj_update_notes = function (inpObj) {
  var vol = inpObj.dat.vol;
  var chp = inpObj.dat.chp;
  var vrs = inpObj.dat.vrs;
  var txt = inpObj.dat.txt;
  var ret = this.load_BibleObj("_notes");
  ret.obj[vol][chp][vrs] = txt;
  var sss = JSON.stringify(ret.obj, null, 4);
  //fs.writeFileSync(ret.fname, sss, "utf8");
  ret.writeback();
  return sss;
};
BibleObj.prototype.load_BibleJstrn = function (fname) {
  var spathfile = "../../../jsdb/jsBibleObj/H_G.json.js";
  spathfile = "../../../jsdb/jsBibleObj/" + fname + ".json.js";
  var ret = Uti.GetJsonStringFrmFile(spathfile);
  return ret;//{fname:spathfile,jstrn:content};
};
BibleObj.prototype.load_BibleObj = function (fname) {
  var ret = this.load_BibleJstrn(fname);
  var bobj = JSON.parse(ret.jstrn);
  ret.obj = bobj;
  ret.writeback = function () {
    fs.writeFileSync(this.fname, this.header + JSON.stringify(this.obj, null, 4), "utf8");
  };
  return ret;
};
BibleObj.prototype.save_BibleObj = function (fname) {
  var ret = this.load_BibleJstrn(fname);
  var bobj = JSON.parse(ret.jstrn);
  return bobj;
};

BibleObj.prototype.Fetch_Partial_BibleObj_by_keyParm = function (srcObj, keyDat) {
  var retObj = {};
  var vol = keyDat.vol;
  if (undefined === srcObj[vol]) {
    Object.assign(retObj, srcObj);
    return { part: "whole", retObj: retObj };
  }
  retObj[vol] = {};
  var chp = keyDat.chp;
  if (undefined === srcObj[vol][chp]) {
    Object.assign(retObj[vol], srcObj[vol]);
    return { part: "vol", retObj: retObj };
  }
  retObj[vol][chp] = {};
  var vrs = keyDat.vrs;
  if (undefined === srcObj[vol][chp][vrs]) {
    Object.assign(retObj[vol][chp], srcObj[vol][chp]);
    return { part: "chp", retObj: retObj };
  }
  retObj[vol][chp][vrs] = "";
  retObj[vol][chp][vrs] = srcObj[vol][chp][vrs];
  return { part: "vrs", retObj: retObj };
};
BibleObj.prototype.merge_clientBibleObj = function (clientObj, SrcDat, cb) {
  //SrcDat{Srcefilename : SrcObj}, can be server obj or client obj. 
  Object.keys(SrcDat).forEach(function (name) {
    var SrcObj = SrcDat[name];
    Object.keys(SrcObj).forEach(function (vol) {
      var chpObj = SrcObj[vol];
      if (undefined == clientObj[vol]) {
        clientObj[vol] = {};
      }
      Object.keys(chpObj).forEach(function (chp) {
        var vrsObj = chpObj[chp];
        if (undefined == clientObj[vol][chp]) {
          clientObj[vol][chp] = {};
        }
        Object.keys(vrsObj).forEach(function (vrs) {
          if (undefined == clientObj[vol][chp][vrs]) {
            clientObj[vol][chp][vrs] = {};
          }
          if ("object" != typeof clientObj[vol][chp][vrs]) {
            var tmp = clientObj[vol][chp][vrs];
            clientObj[vol][chp][vrs] = { orig: tmp };
          }
          var str = vrsObj[vrs];
          if ("function" === typeof cb) {
            clientObj[vol][chp][vrs][name] = cb(str);//allow overide
          }
          else {
            clientObj[vol][chp][vrs][name] = str;
          }
        });
      });
    });
  });
}

BibleObj.prototype.loadBible_write_history = function (aobj) {
  var his = this.load_BibleObj("_history");
  this.merge_clientBibleObj(his.obj, { "dtime": aobj }, function (srcval) {
    return Uti.getDateTime();
  });
  his.writeback();
  console.log("*** save to history.");
}
BibleObj.prototype.loadBible_read_history = function (inpObj) {
  var ret = this.load_BibleObj("_history");
  return ret.jstrn;
}
BibleObj.prototype.search_cliObj = function (cliObj, searchFile, searchStrn, cb) {
  function gen_SrcDat(bkn, vol, chp, vrs, txt) {
    var obj = {};
    obj[bkn] = {};
    obj[bkn][vol] = {};
    obj[bkn][vol][chp] = {};
    obj[bkn][vol][chp][vrs] = txt;
    return obj;
  }
  var foundCliObj = {};
  var _This = this;
  Object.keys(cliObj).forEach(function (vol) {
    Object.keys(cliObj[vol]).forEach(function (chp) {
      Object.keys(cliObj[vol][chp]).forEach(function (vrs) {
        var bFound = false;
        //Object.keys(bibObj[vol][chp][vrs]).forEach(function (bkn) {
        var txt = cliObj[vol][chp][vrs][searchFile];
        if ("string" === typeof txt) {
          if ("function" === typeof cb) {
            bFound = cb(txt, searchStrn);
          }
          else if (txt.indexOf(searchStrn) >= 0) {
            var rep = new RegExp(searchStrn, "g");
            txt = txt.replace(rep, "<font color='red'>" + searchStrn + "</font>");
            cliObj[vol][chp][vrs][searchFile] = txt;
            bFound = true;
          }
        }
        //});
        if (bFound) {//do merge.
          Object.keys(cliObj[vol][chp][vrs]).forEach(function (bkn) {
            var txt = cliObj[vol][chp][vrs][bkn];
            var srcDat = gen_SrcDat(bkn, vol, chp, vrs, txt);
            //Object.assign(srcDat, bibObj[vol][chp][vrs][bkn]);
            _This.merge_clientBibleObj(foundCliObj, srcDat);
          });
        };
      });
    });
  });
  return foundCliObj;
}
BibleObj.prototype.loadBible_Bkns_VolChpVrs = function (inpObj) {
  var ss = "", RetObj = {};

  if ("string" === typeof inpObj.fname) {
    var bib = this.load_BibleObj(inpObj.fname);//.fname, inpObj.dat
    var ret = this.Fetch_Partial_BibleObj_by_keyParm(bib.obj, inpObj.dat);
    var srcO = {};
    srcO[inpObj.fname] = ret.retObj;
    this.merge_clientBibleObj(RetObj, srcO);
    console.log("erro input dat *************", RetObj);
  }
  if ("object" === typeof inpObj.fname) {
    for (var i = 0; i < inpObj.fname.length; i++) {
      var fnm = inpObj.fname[i];
      var bib = this.load_BibleObj(fnm);//.fname, inpObj.dat
      var ret = this.Fetch_Partial_BibleObj_by_keyParm(bib.obj, inpObj.dat);
      var srcO = {};
      srcO[fnm] = ret.retObj;
      this.merge_clientBibleObj(RetObj, srcO);
      if ("vrs" === ret.part) {//save to history.
        this.loadBible_write_history(ret.retObj);
      }
      //console.log("client RetsObj222 *************",RetsObj)
    }
  }
  if (inpObj.dat.searchFile.length > 0 && inpObj.dat.searchStrn.length > 0) {
    var ret2Obj = this.search_cliObj(RetObj, inpObj.dat.searchFile, inpObj.dat.searchStrn);
    ss = JSON.stringify(ret2Obj);
  } else {
    ss = JSON.stringify(RetObj);
  }
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
    return bo.load_BibleJstrn().jstrn;
  },
  loadBible_Bkns_VolChpVrs: function (inpObj) {
    console.log("... loadBible_Bkn_VolChpVrs ...");
    var bo = new BibleObj();
    var ss = bo.loadBible_Bkns_VolChpVrs(inpObj);
    return ss;
  },
  loadBible_read_history: function (inpObj) {
    console.log("... loadBible_Bkn_VolChpVrs ...");
    var bo = new BibleObj();
    var ss = bo.loadBible_read_history(inpObj);
    return ss;
  },
  BibleObj_update_notes: function (inpObj) {
    console.log("... loadBible_Bkn_VolChpVrs ...");
    var bo = new BibleObj();
    var ss = bo.BibleObj_update_notes(inpObj);
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



