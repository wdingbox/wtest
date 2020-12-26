

const fs = require('fs');
const path = require('path');
var url = require('url');
const fsPromises = require("fs").promises;

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
//const exec = require('child_process').exec;

const { BibleObjGituser, BibleUti } = require("./BibleObjGituser_mod")


var userProject = new BibleObjGituser()




var inp_struct_base = {
    usr: {
        repository: "",
        passcode: ""
    },
    par: {
        fnames: [],
        bibOj: { bkc: { chp: { vrs: "" } } }
    }
}
var inp_struct_search = JSON.parse(JSON.stringify(inp_struct_base))
inp_struct_search.par.Search = { File: "", Strn: "" }
var inp_struct_account_setup = JSON.parse(JSON.stringify(inp_struct_base))
inp_struct_account_setup.par = null
var inp_struct_all = JSON.parse(JSON.stringify(inp_struct_base))
inp_struct_all.par.Search = inp_struct_search.par.Search

var ApiJsonp_BibleObj = {
    Jsonpster: function (req, res) {
        if (!req || !res) {
            return {}
        }
        ////////////////////////////////////////////
        //app.get("/Jsonpster", (req, res) => {
        console.log();
        console.log("res.req.headers.host=", res.req.headers.host);

        //////////////
        var RestApi = {}
        Object.keys(this).forEach(function (key) {
            RestApi[key] = { str: key, inp: ApiJsonp_BibleObj[key]() };
        })
        var jstr_RestApi = JSON.stringify(RestApi);
        var structall = JSON.stringify(inp_struct_all)


        var s = `
var Jsonpster = {
    url: "http://${res.req.headers.host}/",
    api: "",
    inp: ${structall},
Url: function (){
        this.m_src = this.url + this.api + '?inp=' + encodeURIComponent(JSON.stringify(this.inp));
        return this.m_src;
    },
Run : function (cbf) {
    if (!cbf) alert('callback Response null');
    if (!this.api) alert('api=null');
    if (!this.inp) alert('inp=null');
    this.Response = cbf;
    var s = document.createElement('script');
    s.src = this.Url()
    document.body.appendChild(s);
    console.log('Jsonpster:', Jsonpster);
    this.api = this.inp.par = null;
}};
const RestApi = JSON.parse('${jstr_RestApi}');
`;;;;;;;;;;;;;;

        console.log(s);
        res.send(s);
        res.end();
        //});
    },
    ApiBibleObj_load_by_bibOj: function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        var inp = BibleUti.GetApiInputParamObj(req)
        var proj = userProject.git_proj_parse(inp)
        var RbcObj = {};
        if ("object" === typeof inp.par.fnames && inp.par.bibOj) {//['NIV','ESV']
            for (var i = 0; i < inp.par.fnames.length; i++) {
                var trn = inp.par.fnames[i];
                var jsfname = userProject.get_jsfname(trn)
                var bib = BibleUti.load_BibleObj_by_fname(jsfname);
                if (!bib.obj) {
                    inp.out.desc += ":noexist:" + trn
                    continue
                }
                var bcObj = BibleUti.fetch_bcv(bib.obj, inp.par.bibOj);
                RbcObj[trn] = bcObj;
                inp.out.desc += ":" + trn
            }
        }
        var bcvR = {}
        BibleUti.convert_rbcv_2_bcvR(RbcObj, bcvR)
        inp.out.desc += ":success"
        inp.out.data = bcvR
        var sret = JSON.stringify(inp);

        console.log(inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + sret + ");");
        res.end();
    },

    ApiBibleObj_search_txt: function (req, res) {
        if (!req || !res) {
            return inp_struct_search
        }
        var inp = BibleUti.GetApiInputParamObj(req)
        if (!inp.usr.f_path) inp.usr.f_path = ""
        var proj = userProject.git_proj_parse(inp)

        var RbcObj = {};
        if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            for (var i = 0; i < inp.par.fnames.length; i++) {
                var trn = inp.par.fnames[i];
                var jsfname = userProject.get_jsfname(trn)
                var bib = BibleUti.load_BibleObj_by_fname(jsfname);
                var bcObj = BibleUti.fetch_bcv(bib.obj, inp.par.bibOj);
                RbcObj[trn] = bcObj;
                inp.out.desc += ":" + trn
            }
        }
        var bcvR = {}
        BibleUti.convert_rbcv_2_bcvR(RbcObj, bcvR)
        inp.out.data = BibleUti.search_str_in_bcvR(bcvR, inp.par.Search.File, inp.par.Search.Strn);

        inp.out.desc += ":success."
        var ss = JSON.stringify(inp);

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + ss + ");");
        res.end();
    },
    ApiBibleObj_write_Usr_BkcChpVrs_txt_asyn: async function (req, res) {
        if (!req || !res) {
            return inp_struct_search
        }
    },
    ApiBibleObj_write_Usr_BkcChpVrs_txt: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        var inp = BibleUti.GetApiInputParamObj(req)
        var proj = userProject.git_proj_parse(inp)

        //if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
        var doc = inp.par.fnames[0]
        var jsfname = userProject.get_jsfname(doc)
        inp.out = BibleUti.Write2vrs_txt_by_inpObj(jsfname, doc, inp.par.inpObj, true)


        await userProject.git_add_commit_push(inp.out.data.dbcv)

        var ss = JSON.stringify(inp)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + ss + ");");
        res.end();
    },
    ApiBibleObj_read_Usr_BkcChpVrs_txt: function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        var inp = BibleUti.GetApiInputParamObj(req)
        var proj = userProject.git_proj_parse(inp)

        userProject.git_pull()

        //inp = BibleUti.Write2vrs_txt(inp, false)
        var doc = inp.par.fnames[0]
        var jsfname = userProject.get_jsfname(doc)
        inp.out = BibleUti.Write2vrs_txt_by_inpObj(jsfname, doc, inp.par.inpObj, false)

        var ss = JSON.stringify(inp)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + ss + ");");
        res.end();
    },








    ///////////////////////////////////

    ApiUsrReposData_create_async: function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
    },
    ApiUsrReposData_create: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.GetApiInputParamObj(req)

        userProject.git_proj_parse(inp)

        inp = await userProject.git_proj_setup(res)
        var sret = JSON.stringify(inp, null, 4)

        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + sret + ");");
        res.end();
    },
    ApiUsrReposData_destroy_async: function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
    },
    ApiUsrReposData_destroy: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.GetApiInputParamObj(req)

        userProject.git_proj_parse(inp)

        await userProject.git_proj_destroy(res)
        var sret = JSON.stringify(inp, null, 4)

        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + sret + ");");
        res.end();
    },
    ApiUsrReposData_status_async: function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
    },
    ApiUsrReposData_status:async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.GetApiInputParamObj(req)

        userProject.git_proj_parse(inp)

        await userProject.git_proj_status()

        var sret = JSON.stringify(inp, null, 4)

        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + sret + ");");
        res.end();
    },

    ApiUsrReposData_git_push_async: function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
    },
    ApiUsrReposData_git_push: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.GetApiInputParamObj(req)

        userProject.git_proj_parse(inp)

        await userProject.git_add_commit_push("push all changes.")

        var sret = JSON.stringify(inp, null, 4)

        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + sret + ");");
        res.end();
    },


}//// BibleRestApi ////

var BibleObjJsonpApi = {
    init: function (app, rootDir) {
        userProject.set_rootDir(rootDir)
        Object.keys(ApiJsonp_BibleObj).forEach(function (sapi) {
            console.log("api:", sapi)
            app.get("/" + sapi, function (req, res) {
                ApiJsonp_BibleObj[sapi](req, res);
            })
        });
        return;
    }
}




module.exports = {
    BibleObjJsonpApi: BibleObjJsonpApi
}

