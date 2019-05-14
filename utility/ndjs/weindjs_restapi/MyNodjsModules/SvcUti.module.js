//2018/05/12 MyNodejsModuels/Uti.module.js

const fs = require('fs');
const path = require('path');
var url = require('url'); //for web app.


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
    },
    Jsonpster : function (app, restApi) {
        var RestApi = {}//clientSite usage.
        Object.keys(restApi).forEach(function (api) {
            RestApi[api] = api;
        });
    
        //RestApi["HistFile"] = BibleUti.ValideBibleObjFiles;// bo.GetValideBibleObjFiles();//used in Bii.htm input param.
        var jstr_RestApi = JSON.stringify(RestApi);

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
    
            
            //////////////
            var s = "var Jsonpster={};";
            s += "Jsonpster.Url=function(){return 'http://" + res.req.headers.host + "/'+this.api+'?inp='+encodeURIComponent(JSON.stringify(this.inp));};";
            s += "Jsonpster.Run=function(prm,cbf){Object.assign(this,prm);this.Response=cbf;if(!cbf)this.Response=function(){alert('cb is null');};var s=document.createElement('script');s.src=this.Url();document.body.appendChild(s);};";
            s += "\n const RestApi=JSON.parse('" + jstr_RestApi + "');";
    
    
            console.log(s);
            res.send(s);
            res.end();
        });
    }
};






module.exports.SvcUti = SvcUti;

