//2018/05/12 MyNodejsModuels/Uti.module.js

const fs = require('fs');
const path = require('path');
var url = require('url');

var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
const exec = require('child_process').exec;



var BibleUti = {
    exec_git_cmd: async function (command, res) {
        return new Promise(async (resolve, reject) => {
            try {
                //command = "ls"
                console.log('cmd:', command)
                exec(command, (err, stdout, stderr) => {
                    if (err) {
                        //some err occurred
                        console.error(err);
                        reject(err);
                    } else {
                        // the *entire* stdout and stderr (buffered)
                        console.log('cmd output ', stdout)
                        resolve(stdout);
                    }
                });
            } catch (err) {
                console.log(err)
            }
        })
    },
    xxxxxxxxxxxget_usr_pathfile: function (username, RevCode) {
        var pthf = `../../../../bible_obj_usr/account/${username}/${RevCode}_json.js`
        if (!fs.existsSync(pthf)) {
            Uti.MakePathDirOfFile(pthf)
        }
        return pthf;
    },
    xxxxxxxxxxxxxload_BibleMaxStruct: function () {
        var spathfile = "../../../../bible_obj_lib/jsdb/jsBibleStruct/All_Max_struct_json.js"
        return load_BibleObj(spathfile, "All_Max_struct")
    },

    get_pathfilenameOfTranslationID: function (f_path, RevCode) {
        var spathfile = "../../../jsdb/jsBibleObj/H_G.json.js";
        if ("_" === RevCode[0]) {
            if ("_" === RevCode[1]) {
                return ""
            }
            RevCode = RevCode.substr(1)
            spathfile = `../../../../bible_obj_usr/account/${f_path}/${RevCode}_json.js`
        } else {
            spathfile = `../../../../bible_obj_lib/jsdb/jsBibleObj/${RevCode}.json.js`;
        }

        return spathfile;
    },
    load_BibleObj: function (username, revCode) {
        var jsfnm = BibleUti.get_pathfilenameOfTranslationID(username, revCode);
        var ret = BibleUti.load_BibleObj_by_fname(jsfnm)
        return ret;
    },
    load_BibleObj_by_fname: function (jsfnm) {
        var ret = { obj: null, fname: jsfnm, fsize: -1, header: "", };

        if (!fs.existsSync(jsfnm)) {
            console.log("f not exit:", jsfnm)
            return ret;
        }
        ret.fsize = Uti.GetFileSize(jsfnm);
        if (ret.fsize > 0) {
            var t = fs.readFileSync(jsfnm, "utf8");
            var i = t.indexOf("{");
            if (i > 0) {
                ret.header = t.substr(0, i);
                var s = t.substr(i);
                ret.obj = JSON.parse(s);
            }
        }

        ret.writeback = function () {
            var s2 = JSON.stringify(this.obj, null, 4);
            fs.writeFileSync(this.fname, this.header + s2);
        }
        return ret;
    },






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
        inpObj.out = { result: "", data: null }
        return inpObj;
    },
    xxxxxxxxxxxxxxxxxxxxxxfetch_bc: function (BibleObj, oj) {
        console.log("oj", oj)
        if (!oj || Object.keys(oj).length === 0) return BibleObj
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(oj)) {
            retOb[bkc] = {}
            if (!chpObj || Object.keys(chpObj).length === 0) {
                retOb[bkc] = BibleObj[bkc]
                continue
            }
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                console.log("bc", bkc, chp)
                retOb[bkc][chp] = BibleObj[bkc][chp]
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    //console.log(`${key}: ${value}`);
                }
            }
        }
        return retOb
    },
    fetch_bcv: function (BibleObj, oj) {
        console.log("oj", oj)
        if (!oj || Object.keys(oj).length === 0) return BibleObj
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(oj)) {
            retOb[bkc] = {}
            if (!chpObj || Object.keys(chpObj).length === 0) {
                retOb[bkc] = BibleObj[bkc]
                continue
            }
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                console.log("bc", bkc, chp)
                if (!vrsObj || Object.keys(vrsObj).length === 0) {
                    retOb[bkc][chp] = BibleObj[bkc][chp]
                    continue
                }
                retOb[bkc][chp] = {}
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    //console.log(`${key}: ${value}`);
                    retOb[bkc][chp][vrs] = BibleObj[bkc][chp][vrs]
                }
            }
        }
        return retOb
    },
    convert_rbcv_2_bcvR: function (rbcv, bcvRobj) {
        if (null === bcvRobj) bcvRobj = {}
        for (const [rev, revObj] of Object.entries(rbcv)) {
            for (const [vol, chpObj] of Object.entries(revObj)) {
                if (!bcvRobj[vol]) bcvRobj[vol] = {}
                for (const [chp, vrsObj] of Object.entries(chpObj)) {
                    if (!bcvRobj[vol][chp]) bcvRobj[vol][chp] = {}
                    for (const [vrs, txt] of Object.entries(vrsObj)) {
                        if (!bcvRobj[vol][chp][vrs]) bcvRobj[vol][chp][vrs] = {}
                        bcvRobj[vol][chp][vrs][rev] = txt
                    };
                };
            };
        };
        return bcvRobj;
    },
    xxxxxxxxxxxxsearch_str_in_bcv: function (bibObj, searchStrn, fileary) {
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(bibObj)) {
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    var rep = new RegExp(searchStrn, "g");
                    var mat = txt.match(rep);
                    if (mat) {
                        txt = txt.replace(mat[0], "<font color='red'>" + mat[0] + "</font>");
                        if (!retOb[bkc]) retOb[bkc] = {}
                        if (!retOb[bkc][chp]) retOb[bkc][chp] = {};//BibleObj[bkc][chp]
                        bibObj[bkc][chp][vrs] = txt
                        if (fileary.length > 0) {
                            fileary.forEach(function (rev) {
                                retOb[bkc][chp][vrs] = txt
                            })
                        }
                        //console.log("bc", bkc, chp)
                        //console.log(`${key}: ${value}`);
                    }
                }
            }
        }
        return retOb
    },
    search_str_in_bcvR: function (bcvR, Fname, searchStrn) {
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(bcvR)) {
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                for (const [vrs, revObj] of Object.entries(vrsObj)) {
                    var bFound = false
                    for (const [rev, txt] of Object.entries(revObj)) {
                        if (rev === Fname) {
                            var rep = new RegExp(searchStrn, "g");
                            var mat = txt.match(rep);
                            if (mat) {
                                bFound = true
                                var txtFound = txt.replace(mat[0], "<font class='matInSvr'>" + mat[0] + "</font>");
                                bcvR[bkc][chp][vrs][rev] = txtFound
                            }
                        }
                    }
                    if (bFound) {
                        for (const [rev, txt] of Object.entries(revObj)) {
                            if (!retOb[bkc]) retOb[bkc] = {}
                            if (!retOb[bkc][chp]) retOb[bkc][chp] = {};//BibleObj[bkc][chp]
                            if (!retOb[bkc][chp][vrs]) retOb[bkc][chp][vrs] = {};//BibleObj[bkc][chp]
                            retOb[bkc][chp][vrs][rev] = txt
                        }
                    }
                }
            }
        }
        return retOb
    },
    bcv_parser: function (sbcv, txt) {
        sbcv = sbcv.replace(/\s/g, "");
        if (sbcv.length === 0) return alert("please select an item first.");
        var ret = { vol: "", chp: "", vrs: "" };
        var mat = sbcv.match(/^(\w{3})\s{,+}(\d+)\s{,+}[\:]\s{,+}(\d+)\s{,+}$/);
        var mat = sbcv.match(/^(\w{3})\s+(\d+)\s+[\:]\s+(\d+)\s+$/);
        var mat = sbcv.match(/^(\w{3})(\d+)\:(\d+)$/);
        if (mat) {
            ret.vol = mat[1].trim();
            ret.chp = "" + parseInt(mat[2]);
            ret.vrs = "" + parseInt(mat[3]);
        } else {
            alert("sbcv=" + sbcv + "," + JSON.stringify(ret));
        }
        ret.chp3 = ret.chp.padStart(3, "0");
        ret._vol = "_" + ret.vol;

        ret.std_bcv = `${ret.vol}${ret.chp}:${ret.vrs}`

        var pad3 = {}
        pad3.chp = ret.chp.padStart(3, "0");
        pad3.vrs = ret.vrs.padStart(3, "0");
        pad3.bcv = `${ret.vol}${pad3.chp}:${pad3.vrs}`
        ret.pad3 = pad3

        var obj = {}
        obj[ret.vol] = {}
        obj[ret.vol][ret.chp] = {}
        obj[ret.vol][ret.chp][ret.vrs] = txt
        ret.bcvObj = obj

        ///////validation for std bcv.
        // if (undefined === _Max_struct[ret.vol]) {
        //     ret.err = `bkc not exist: ${ret.vol}`
        // } else if (undefined === _Max_struct[ret.vol][ret.chp]) {
        //     ret.err = `chp not exist: ${ret.chp}`
        // } else if (undefined === _Max_struct[ret.vol][ret.chp][ret.vrs]) {
        //     ret.err = `vrs not exist: ${ret.vrs}`
        // } else {
        //     ret.err = ""
        // }

        return ret;
    },
    xxxxxxxxxxxxxxxxload_bcvR_by_StdBcvStrn: function (bcvR, stdBcvStrn) {
        var retOb = {}, stdBcvAr = stdBcvStrn.split(",")

        stdBcvAr.forEach(function (stdbcv) {
            var stdbcvs = stdbcv.trim()
            var ar2 = stdbcvs.split("-")
            var stdbcv = ar2[0].trim()
            var ret = BibleUti.bcv_parser(stdbcv, '') //`${bkc}${chp}:${vrs}`
            if (!ret.err) {
                if (!retOb[ret.vol]) retOb[ret.vol] = {}
                if (!retOb[ret.vol][ret.chp]) retOb[ret.vol][ret.chp] = {};
                retOb[ret.vol][ret.chp][ret.vrs] = bcvR[ret.vol][ret.chp][ret.vrs]
            }
        })

        return retOb
    },
    Write2vrs_txt: function (inp, bWrite) {
        if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            var trn = inp.par.fnames[0]
            inp.out.result += trn
            var bib = BibleUti.load_BibleObj(inp.usr.f_path, trn);
            inp.out.m_fname = bib.fname
            inp.bio = bib
            if (bib.fsize > 0) {
                console.log("fsize:", bib.fsize)
                for (const [bkc, chpObj] of Object.entries(inp.par.inpObj)) {
                    console.log("chpObj", chpObj)
                    for (const [chp, vrsObj] of Object.entries(chpObj)) {
                        console.log("vrsObj", vrsObj)
                        for (const [vrs, txt] of Object.entries(vrsObj)) {
                            var readtxt = bib.obj[bkc][chp][vrs]
                            inp.out.data = { bcv: `${trn}~${bkc}${chp}:${vrs}`, txt: readtxt }
                            console.log("origtxt", readtxt)

                            if (bWrite) {
                                console.log("newtxt", txt)
                                bib.obj[bkc][chp][vrs] = txt
                                bib.writeback();
                                inp.out.result += ":Write-success"
                            } else {
                                inp.out.result += ":Read-success"
                            }
                        }
                    }
                }
            }
        }
        return inp
    }

    //// BibleUti /////
}



var ApiJsonp_BibleObj = {
    Jsonpster: function (req, res) {
        ////////////////////////////////////////////
        //app.get("/Jsonpster", (req, res) => {
        console.log();
        console.log("res.req.headers.host=", res.req.headers.host);

        //////////////
        var RestApi = {}
        Object.keys(this).forEach(function (key) {
            RestApi[key] = key;
        })
        var jstr_RestApi = JSON.stringify(RestApi);
        var s = `
var Jsonpster = {
    url: "http://${res.req.headers.host}/",
    api: "",
    inp: {usr:{account:"", f_path:""}, par:null },
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
        var inp = BibleUti.GetApiInputParamObj(req)
        var RbcObj = {};
        if ("object" === typeof inp.par.fnames && inp.par.bibOj) {//['NIV','ESV']
            for (var i = 0; i < inp.par.fnames.length; i++) {
                var trn = inp.par.fnames[i];
                var bib = BibleUti.load_BibleObj(inp.usr.f_path, trn);
                if (!bib.obj) inp.out.result += ":err:" + trn
                var bcObj = BibleUti.fetch_bcv(bib.obj, inp.par.bibOj);
                RbcObj[trn] = bcObj;
                inp.out.result += ":" + trn
            }
        }
        var bcvR = {}
        BibleUti.convert_rbcv_2_bcvR(RbcObj, bcvR)
        inp.out.result += ":success"
        inp.out.data = bcvR
        var sret = JSON.stringify(inp);

        console.log(inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + sret + ");");
        res.end();
    },

    ApiBibleObj_search_txt: function (req, res) {
        var inp = BibleUti.GetApiInputParamObj(req)
        if (!inp.usr.f_path) inp.usr.f_path = ""

        var RbcObj = {};
        if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            for (var i = 0; i < inp.par.fnames.length; i++) {
                var trn = inp.par.fnames[i];
                var bib = BibleUti.load_BibleObj(inp.usr.f_path, trn);
                var bcObj = BibleUti.fetch_bcv(bib.obj, inp.par.bibOj);
                RbcObj[trn] = bcObj;
                inp.out.result += ":" + trn
            }
        }
        var bcvR = {}
        BibleUti.convert_rbcv_2_bcvR(RbcObj, bcvR)
        inp.out.data = BibleUti.search_str_in_bcvR(bcvR, inp.par.Search.File, inp.par.Search.Strn);

        inp.out.result += ":success."
        var ss = JSON.stringify(inp);

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + ss + ");");
        res.end();
    },
    ApiBibleObj_write_Usr_BkcChpVrs_txt: function (req, res) {
        var inp = BibleUti.GetApiInputParamObj(req)
        inp.out.result = "Write?"

        inp = BibleUti.Write2vrs_txt(inp, true)

        console.log(inp.out.m_fname)
        inp.out.exec_git_result = BibleUti.exec_git_cmd("./git_cmds.sh", res)
        //console.log(inp)


        var ss = JSON.stringify(inp)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + ss + ");");
        res.end();
    },
    ApiBibleObj_read_Usr_BkcChpVrs_txt: function (req, res) {
        var inp = BibleUti.GetApiInputParamObj(req)
        inp.out.result = "read:"

        inp = BibleUti.Write2vrs_txt(inp, false)

        var ss = JSON.stringify(inp)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + ss + ");");
        res.end();
    },

    ///////////////////////////////////
    ApiAccout_setup_usr: async function (req, res) {
        var inp = BibleUti.GetApiInputParamObj(req)
        console.log(inp)

        function parse_proj_url(proj_url) {
            //https://github.com/wdingbox/Bible_obj_weid.git
            var reg = new RegExp(/^https\:\/\/github\.com\/(\w+)\/(\w+)(\.git)$/)

            var mat = proj_url.match(reg)
            console.log("mat", mat)
            if (mat) {
                console.log(mat)
                var username = mat[1]
                var projname = mat[2]
                return {username:username, projname:projname}
            }
            return null
        }

        if ("object" === typeof inp.usr) {//['NIV','ESV']
            var proj_url = inp.usr.proj_url
            var passcode = inp.usr.passcode

            var ret = parse_proj_url(proj_url)

            var password = "lll"
            var baseDir = "bible_usrs_dat"
            var acctname = "account"
            var cmd = `
#!/bin/sh
cd ../../../../
mkdir ${baseDir}
cd ${baseDir}
echo ${password} | sudo -S git clone  ${proj_url}
cd ${ret.projname}
mkdir ${acctname}
echo "begin to cp"
echo ${password} | sudo cp -Ra  ../../bible_obj_usr/template/wd  .
#cd -
`
            inp.out.exec_git_result = await BibleUti.exec_git_cmd(cmd, res)


        }
        var sret = JSON.stringify(inp, null, 4)


        console.log(inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + sret + ");");
        res.end();
    },


}//// BibleRestApi ////

var BibleObjJsonpApi = {
    init: function (app) {
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

