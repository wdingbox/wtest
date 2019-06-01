

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
                        CrossReferenceUpdate.searchBCV(txt);
                    }

                });

            });

        });
    },
    searchBCV:function(txt){
        var mat=txt.match(/([\(][A-Z0-9][A-Za-z]{2}[\s]{0,9}\d+[\:]\d+[\)])/);
        if(mat){
            console.log("-----")
            console.log(mat);
        }
    }
};////////////////////////

CrossReferenceUpdate.run();
