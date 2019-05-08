const express = require('express');        // call express
const app = express();                 // define our app using express
var bodyParser = require('body-parser');
//var stripe     = require("stripe")("CUSTOM_TEST_TOKEN");
var url = require('url');

var Uti = require("./MyNodejsModules/Uti.module").Uti;

////////////////////////////////
//server site workload.
const fs = require('fs');
var path = require('path');
var cheerio = require("cheerio"); //>> npm install cheerio









var Utix = {
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






const ValideBibleObjFiles = {
  __history_verses_loaded: "__history_verses_loaded",
  __history_regex_search: "__history_regex_search"
}
var BibleObj = function () {
};

BibleObj.prototype.ApiBibleObj_update_notes = function (inpObj) {
  var fil = inpObj.fname[0];
  var vol = inpObj.vcvx.vol;
  var chp = inpObj.vcvx.chp;
  var vrs = inpObj.vcvx.vrs;
  var txt = inpObj.vcvx.txt;
  var ret = this.load_BibleObj(fil);//"_notes");
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

BibleObj.prototype.Get_PartialBibleObj_by_VolChpVrs = function (srcObj, keyDat) {
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
BibleObj.prototype.Get_PartialBibleObj_by_xOj = function (srcObj, _xOj) {
  console.error("input _xOj=", _xOj);
  if (!_xOj || Object.keys(_xOj).length === 0) {
    return { part: "whole", patObj: srcObj };
  }
  var patBibObj = {};
  var str_vcv = ""; totPass = { ivol: 0, ichp: 0, ivrs: 0 };
  Object.keys(_xOj).forEach(function (vol) {
    if (undefined === srcObj[vol]) {//vol='*'
      //Object.assign(patBibObj, srcObj);//load whole bible.
      return;
    }
    if (undefined == patBibObj[vol]) {
      patBibObj[vol] = {};
    }
    totPass.ivol++;
    var chp_arr = Object.keys(_xOj[vol]);
    if (chp_arr.length === 0) {//[vol]={} exit. cpy vol obj,
      Object.assign(patBibObj[vol], srcObj[vol]);
      return;
    }
    chp_arr.forEach(function (chp) {
      if (undefined === srcObj[vol][chp]) {////////chp=*
        //Object.assign(patBibObj[vol], srcObj[vol]);
        return;
      }
      if (undefined == patBibObj[vol][chp]) {
        patBibObj[vol][chp] = {};
      }
      totPass.ichp++;
      var vrs_arr = Object.keys(_xOj[vol][chp]);
      if (vrs_arr.length === 0) {//[vol][chp]={} exit. cpy chp obj,
        Object.assign(patBibObj[vol][chp], srcObj[vol][chp]);//whole chapter
        return;
      }
      vrs_arr.forEach(function (vrs) {
        if (undefined === srcObj[vol][chp][vrs]) {
          patBibObj[vol][chp][vrs] = "@";// srcObj[vol][chp] maybe not exist. 
        } else {//copy single verse. 
          patBibObj[vol][chp][vrs] = srcObj[vol][chp][vrs];
          str_vcv = vol + chp + ":" + vrs;

        }
        totPass.ivrs++;
      });
    });
  });
  //console.log("output patBibObj=", patBibObj, totPass);
  return { vcv: str_vcv, patObj: patBibObj, totPass: totPass };
};

BibleObj.prototype.merge_clientBibleObj = function (clientObj, SrcDat, cb) {
  //SrcDat{Srcefilename : SrcObj}, can be server obj or client obj.
  //console.log("SrcDat=", SrcDat);
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
        var rep = new RegExp(searchStrn, "g");
        if ("string" === typeof txt) {
          if ("function" === typeof cb) {
            bFound = cb(txt, searchStrn);
          }
          else {
            var mat = txt.match(rep);
            if (mat) {
              txt = txt.replace(mat[0], "<font color='red'>" + mat[0] + "</font>");
              cliObj[vol][chp][vrs][searchFile] = txt;
              bFound = true;
            }

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
BibleObj.prototype.ApiBibleObj_load_Bkns_Vols_Chp_Vrs = function (inpObj) {
  var ss = "", RetObj = {};

  if ("string" === typeof inpObj.fname) {
    var bib = this.load_BibleObj(inpObj.fname);//.fname, inpObj.dat
    var ret = this.Get_PartialBibleObj_by_VolChpVrs(bib.obj, inpObj.dat);
    var srcO = {};
    srcO[inpObj.fname] = ret.retObj;
    this.merge_clientBibleObj(RetObj, srcO);
    console.log("erro input dat *************", RetObj);
  }
  if ("object" === typeof inpObj.fname) {
    for (var i = 0; i < inpObj.fname.length; i++) {
      var fnm = inpObj.fname[i];
      var bib = this.load_BibleObj(fnm);//.fname, inpObj.dat
      var pat = this.Get_PartialBibleObj_by_xOj(bib.obj, inpObj.bibOj);
      var bvcvObj = {};//{bkn:{vol:{chp:{vrs:txt,},},},}}
      bvcvObj[fnm] = pat.patObj;
      this.merge_clientBibleObj(RetObj, bvcvObj);//{vol:{chp:{vrs:{bkn:txt,},},},}
      //console.log("pat=", pat)
      if ( pat.vcv && pat.vcv.length > 0) {//save to history.
        //this.loadBible_write_history(pat.patObj);
        var _inp = {}
        _inp.Search = {};
        _inp.Search.File = ValideBibleObjFiles.__history_verses_loaded;
        _inp.Search.Strn = pat.vcv;
        this.ApiBibleObj_access_regex_search_history(_inp);
      }
      //console.log("client RetsObj222 *************",RetsObj)
    }
  }
  var srch = inpObj.Search;
  if (srch && srch.File && srch.File.length > 0 && srch.Strn && srch.Strn.length > 0) {
    var retFoundObj = this.search_cliObj(RetObj, srch.File, srch.Strn);
    if (Object.keys(retFoundObj).length > 0) {
      var _inp = {}
      _inp.Search = {};
      _inp.Search.File = ValideBibleObjFiles.__history_regex_search;
      _inp.Search.Strn = srch.Strn;
      this.ApiBibleObj_access_regex_search_history(_inp);
    }
    ss = JSON.stringify(retFoundObj);
  } else {
    ss = JSON.stringify(RetObj);
  }
  return ss;
};
BibleObj.prototype.ApiBibleObj_access_regex_search_history = function (inpObj) {
  console.log("ApiBibleObj_access_regex_search_history inpObj", inpObj)
  if (!inpObj || !inpObj.Search || !inpObj.Search.File || 0 === inpObj.Search.File.length) {
    return null;
  }
  var fname = inpObj.Search.File;//
  if (undefined === ValideBibleObjFiles[fname]) {
    console.log("Invalide Filename to save ************* inpObj", inpObj);
    console.log("ValideBibleObjFiles=", ValideBibleObjFile);
    return null;
  }

  var ret = this.load_BibleObj(fname);
  if (!inpObj.Search.Strn) {//only read no write.
    return ret;
  }
  var srchstr = inpObj.Search.Strn;
  if (srchstr.length > 0) {//write to history.
    ret.obj["Gen"]["1"]["1"][srchstr] = Uti.getDateTime();
    ret.writeback();
  }
  return ret;
};


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

  /////HebrewBuf

  updateVocabHebrewBuf: function (inpObj) {
    return hbrq.updateVocabHebrewBuf(inpObj);
  },
  updateVocabHebrewDat: function (inpObj) {

  },

  //////BibleObj

  loadBibleObj: function (inpObj) {
    console.log("... loadBibleObj ...");
    var bo = new BibleObj();
    return bo.load_BibleJstrn().jstrn;
  },
  ApiBibleObj_load_Bkns_Vols_Chp_Vrs: function (inpObj) {
    console.log("... loadBible_Bkn_VolChpVrs ...");
    var bo = new BibleObj();
    var ss = bo.ApiBibleObj_load_Bkns_Vols_Chp_Vrs(inpObj);
    return ss;
  },
  ApiBibleObj_access_regex_search_history: function (inpObj) {
    console.log("... loadBible_Bkn_VolChpVrs ...");
    var bo = new BibleObj();
    var ret = bo.ApiBibleObj_access_regex_search_history(inpObj);
    return ret.jstrn;
  },
  ApiBibleObj_update_notes: function (inpObj) {
    console.log("... loadBible_Bkn_VolChpVrs ...");
    var bo = new BibleObj();
    var ss = bo.ApiBibleObj_update_notes(inpObj);
    return ss;
  }
};//////SvrApi///////////////////////////////////
var RestApi={}//clientSite usage.
Object.keys(SvrApi).forEach(function (api) {
  RestApi[api]=api;
  app.get("/" + api, (req, res) => {
    var inpObj = SvrApi.GetApiInputParamObj(req, res);
    var ret = SvrApi[api](inpObj);
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.write("Jsonpster.Response(" + ret + ");");
    res.end();
  });
});
////////////////////////////////////////////////

//for BibleObj clientSite Usage. 
RestApi["HistFile"]=ValideBibleObjFiles;




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

  var jstr_RestApi = JSON.stringify(RestApi);
  //////////////
  var s = "var Jsonpster={};";
  s += "Jsonpster.Url=function(){return 'http://" + res.req.headers.host + "/'+this.api+'?inp='+encodeURIComponent(JSON.stringify(this.inp));};";
  s += "Jsonpster.Run=function(prm,cbf){Object.assign(this,prm);this.Response=cbf;if(!cbf)this.Response=function(){alert('cb is null');};var s=document.createElement('script');s.src=this.Url();document.body.appendChild(s);};";
  s += "\n const RestApi=JSON.parse('" + jstr_RestApi + "');";


  console.log(s);
  res.send(s);
  res.end();
});
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
//
// load htm file for webpage js file issues.
// https://stackoverflow.com/questions/48050666/node-js-serve-html-but-cant-load-script-files-in-served-page
//
//

