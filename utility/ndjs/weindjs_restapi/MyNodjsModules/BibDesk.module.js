//2018/05/12 MyNodejsModuels/Uti.module.js

const fs = require('fs');
const path = require('path');
var url = require('url'); //for web app.

var Uti = require("./Uti.module").Uti;

var SvcUti = {
    GetApiInputParamObj: function (req) {
        console.log("req.url=", req.url);
        var q = url.parse(req.url, true).query;
        console.log("q=", q);
        if (q.inp === undefined) {
            console.log("q.inp undefined. Maybe unload or api err");
            return q;
        }
        var s = decodeURIComponent(q.inp);//must for client's encodeURIComponent
        var inpObj = JSON.parse(s);
        console.log("inp=", inpObj); 
        return inpObj;
    },
    BindApp2Api: function (app, svcApi){
        Object.keys(svcApi).forEach(function (api) {
            app.get("/" + api, (req, res) => {
                var inpObj = SvcUti.GetApiInputParamObj(req);
                var ret = svcApi[api](inpObj);
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.write("Jsonpster.Response(" + ret + ");");
                res.end();
            });
        });
    }
};





var SvcRestApi = {
    BibDeskApi_SaveBibSingleItem: function (inpObj) {
        console.log("api : BibDeskApi_SaveBibSingleItem");
        var spathfile = "../../../../../../bitbucket/weid/pdf2018/latx/bib_generator/authorInfo/bibDat/BibDat_OBI.json.js";
        console.log(spathfile);
        var ret = Uti.LoadObj(spathfile);
        var uid = inpObj["uid"];
        var itm = inpObj["itm"];
        console.log("uid=",uid);
        console.log("ret.obj[uid]=",ret.obj[uid]);
        ret.obj[uid] = itm;
        ret.writeback();
        console.log("itm=",itm);

        return JSON.stringify(inpObj);
    },
}

var BibDesk = function () {
}
BibDesk.prototype.RestApi = function (app) {
    SvcUti.BindApp2Api(app, SvcRestApi);

}///////////////////////////////

module.exports.BibDesk = BibDesk;

