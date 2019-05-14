//2018/05/12 MyNodejsModuels/Uti.module.js

const fs = require('fs');
const path = require('path');
var Uti = require("./Uti.module").Uti;






//  const ValideBibleObjFiles = {
//      __history_verses_loaded: "__history_verses_loaded",
//      __history_regex_search: "__history_regex_search"
//  }
var BibleUti={
    ValideBibleObjFiles : {
        __history_verses_loaded: "__history_verses_loaded",
        __history_regex_search: "__history_regex_search"
    },

    load_BibleJstrn : function (fname) {
        var spathfile = "../../../jsdb/jsBibleObj/H_G.json.js";
        spathfile = "../../../jsdb/jsBibleObj/" + fname + ".json.js";
        var ret = Uti.GetJsonStringFrmFile(spathfile);
        return ret;//{fname:spathfile,jstrn:content};
    },
    load_BibleObj : function (fname) {
        var ret = BibleUti.load_BibleJstrn(fname);
        var bobj = JSON.parse(ret.jstrn);
        ret.obj = bobj;
        ret.writeback = function () {
            fs.writeFileSync(this.fname, this.header + JSON.stringify(this.obj, null, 4), "utf8");
        };
        return ret;
    },

    //// NOT USED ///////
    save_BibleObj : function (fname) {
        var ret = BibleUti.load_BibleJstrn(fname);
        var bobj = JSON.parse(ret.jstrn);
        return bobj;
    },

    Get_PartialBibleObj_by_xOj : function (srcObj, _xOj) {
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
    },

    //////// Obsoleted //////
    Get_PartialBibleObj_by_VolChpVrs : function (srcObj, keyDat) {
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
    },


    search_cliObj : function (cliObj, searchFile, searchStrn, cb) {
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
                            BibleUti.merge_clientBibleObj(foundCliObj, srcDat);
                        });
                    };
                });
            });
        });
        return foundCliObj;
    },
    merge_clientBibleObj : function (clientObj, SrcDat, cb) {
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
    },
}//// BibleUti /////






var BibleObj = function () {
};
BibleObj.prototype.GetValideBibleObjFiles = function () {
    return BibleUti.ValideBibleObjFiles;
}

BibleObj.prototype.ApiBibleObj_update_notes = function (inpObj) {
    var fil = inpObj.fname[0];
    var vol = inpObj.vcvx.vol;
    var chp = inpObj.vcvx.chp;
    var vrs = inpObj.vcvx.vrs;
    var txt = inpObj.vcvx.txt;
    var ret = BibleUti.load_BibleObj(fil);//"_notes");
    ret.obj[vol][chp][vrs] = txt;
    var sss = JSON.stringify(ret.obj, null, 4);
    //fs.writeFileSync(ret.fname, sss, "utf8");
    ret.writeback();
    return sss;
};


BibleObj.prototype.ApiBibleObj_load_Bkns_Vols_Chp_Vrs = function (inpObj) {
    var ss = "", RetObj = {};

    if ("string" === typeof inpObj.fname) {//old oobsoleted..
        var bib = BibleUti.load_BibleObj(inpObj.fname);//.fname, inpObj.dat
        var ret = BibleUti.Get_PartialBibleObj_by_VolChpVrs(bib.obj, inpObj.dat);
        var srcO = {};
        srcO[inpObj.fname] = ret.retObj;
        BibleUti.merge_clientBibleObj(RetObj, srcO);
        console.log("erro input dat *************", RetObj);
    }
    if ("object" === typeof inpObj.fname) {
        for (var i = 0; i < inpObj.fname.length; i++) {
            var fnm = inpObj.fname[i];
            var bib = BibleUti.load_BibleObj(fnm);//.fname, inpObj.dat
            var pat = BibleUti.Get_PartialBibleObj_by_xOj(bib.obj, inpObj.bibOj);
            var bvcvObj = {};//{bkn:{vol:{chp:{vrs:txt,},},},}}
            bvcvObj[fnm] = pat.patObj;
            BibleUti.merge_clientBibleObj(RetObj, bvcvObj);//{vol:{chp:{vrs:{bkn:txt,},},},}
            //console.log("pat=", pat)
            if (pat.vcv && pat.vcv.length > 0) {//save to history.
                //this.loadBible_write_history(pat.patObj);
                var _inp = {}
                _inp.Search = {};
                _inp.Search.File = BibleUti.ValideBibleObjFiles.__history_verses_loaded;
                _inp.Search.Strn = pat.vcv;
                this.ApiBibleObj_access_regex_search_history(_inp);
            }
            //console.log("client RetsObj222 *************",RetsObj)
        }
    }
    var srch = inpObj.Search;
    if (srch && srch.File && srch.File.length > 0 && srch.Strn && srch.Strn.length > 0) {
        var retFoundObj = BibleUti.search_cliObj(RetObj, srch.File, srch.Strn);
        if (Object.keys(retFoundObj).length > 0) {
            var _inp = {}
            _inp.Search = {};
            _inp.Search.File = BibleUti.ValideBibleObjFiles.__history_regex_search;
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
    if (undefined === BibleUti.ValideBibleObjFiles[fname]) {
        console.log("Invalide Filename to save ************* inpObj", inpObj);
        console.log("ValideBibleObjFiles=", ValideBibleObjFile);
        return null;
    }

    var ret = BibleUti.load_BibleObj(fname);
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

module.exports.BibleObj = BibleObj;

var a=function () {
    return new BibleObj();
}
