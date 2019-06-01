

const fs = require('fs');
var path = require('path');
var cheerio = require("cheerio"); //>> npm install cheerio

const Uti = require("../../../../../../../bitbucket/utis/zfrqCalc/Uti.Module").Uti;

var tst = require("../../../../jsdb/jsBibleObj/_crf.json.js");


var CrossReferenceUpdate = {

    run: function () {
        var _crf = Uti.LoadObj("../../../../jsdb/jsBibleObj/_crf.json.js");
        var _bnotes = Uti.LoadObj("../../../../jsdb/jsBibleObj/_bnotes.json.js");
        console.log(_bnotes);

        Object.keys(_bnotes.obj).forEach(function (bkname, i) {
            var obk = _bnotes.obj[bkname];
            Object.keys(obk).forEach(function (chp, k) {
                var versObj = obk[chp];
                Object.keys(versObj).forEach(function (vers, k) {
                    var txt = versObj[vers];
                    if (txt.length > 0) {
                        //console.log(bkname, chp, ":", vers, txt);
                        var ret = CrossReferenceUpdate.search_Ref(txt);
                        if (ret.valid) {
                            console.log(ret)
                            var curBVC = `(${bkname}${chp}:${vers})`;
                            var arr = _crf.obj[ret.book][ret.chap][ret.vers].split(";");
                            if (arr.indexOf(curBVC) < 0) {
                                arr.push(curBVC);
                                _crf.obj[ret.book][ret.chap][ret.vers] = arr.join(";");
                            }
                        }
                    }
                });
            });
        });
    },
    search_Ref: function (txt) {
        var ret = { book: "", chap: "", vers: "", valid: false };
        var mat = txt.match(/([\(]\s{0,}([A-Z0-9][A-Za-z]{2})[\s]{0,}(\d+)[\s]{0,}[\:][\s]{0,}(\d+)([\-\,\d]{0,})[\)])/);
        if (mat) {
            console.log("-----");
            console.log(mat);
            if (mat.length > 2) {
                ret.book = mat[2];
                ret.chap = mat[3];
                ret.vers = mat[4];
                ret.valid = true;
            }

        }
        return ret;
    }
};////////////////////////

CrossReferenceUpdate.run();
