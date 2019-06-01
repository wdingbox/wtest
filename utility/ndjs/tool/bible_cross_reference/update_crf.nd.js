

const fs = require('fs');
var path = require('path');
var cheerio = require("cheerio"); //>> npm install cheerio

const Uti = require("../../../../../../../bitbucket/utis/zfrqCalc/Uti.Module").Uti;

var tst = require("../../../../jsdb/jsBibleObj/_crf.json.js");


var CrossReference = {
    update: function (crf,note) {
        console.log(note);
        Object.keys(note.obj).forEach(function (bkname, i) {
            var obk = note.obj[bkname];
            Object.keys(obk).forEach(function (chp, k) {
                var chpObj = obk[chp];
                Object.keys(chpObj).forEach(function (vers, k) {
                    var txt = chpObj[vers];
                    if (txt.length > 0) {
                        //console.log(bkname, chp, ":", vers, txt);
                        var ret1 = { book: bkname, chap: chp, vers: vers, valid: true };
                        var ret2 = CrossReference.search_Ref(txt);
                        CrossReference.cross_update(crf, ret1, ret2);
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
    },
    getBCV: function (ret) {
        return `(${ret.book}${ret.chap}:${ret.vers})`;
    },
    cross_update: function (_crf, ret1, ret2) {
        function push2crf(_crf, ret, ret2) {
            if (false === ret.valid || false === ret2.valid) return;
            var matBVC = CrossReference.getBCV(ret2);
            var arr1 = _crf.obj[ret.book][ret.chap][ret.vers].split(/[\;|\s]/);
            if (arr1.indexOf(matBVC) < 0) {
                arr1.push(matBVC);
                _crf.obj[ret.book][ret.chap][ret.vers] = arr1.join(";");
            }
        }

        console.log(ret2);
        push2crf(_crf, ret1, ret2);
        push2crf(_crf, ret2, ret1);
        _crf.writeback();
    }
};////////////////////////

var _crf = Uti.LoadObj("../../../../jsdb/jsBibleObj/_crf.json.js");
var _bnotes = Uti.LoadObj("../../../../jsdb/jsBibleObj/_bnotes.json.js");
CrossReference.update(_crf,_bnotes);
