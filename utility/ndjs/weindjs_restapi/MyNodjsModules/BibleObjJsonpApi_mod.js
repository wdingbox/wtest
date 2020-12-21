

const fs = require('fs');
const path = require('path');
var url = require('url');
const fsPromises = require("fs").promises;

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
const exec = require('child_process').exec;



var BibleUti = {
    GetFileSize: function (fnm) {
        if (fs.existsSync(fnm)) {
            const stats = fs.statSync(fnm);
            return stats.size;
        }
        return -1;
    },
    exec_git_cmd: async function (command) {
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




    load_bibleObj_by_inp: function (inp) {
        var proj = userProject.git_proj_parse(inp)
        if (!proj) {
            console.log("fatal error")
            return null
        }
        var ret = BibleUti.load_BibleObj_by_fname(inp.usr.proj.dest_pfname)
        return ret;
    },
    load_BibleObj_by_fname: function (jsfnm) {
        var ret = { obj: null, fname: jsfnm, fsize: -1, header: "", };

        if (!fs.existsSync(jsfnm)) {
            console.log("f not exit:", jsfnm)
            return ret;
        }
        ret.fsize = BibleUti.GetFileSize(jsfnm);
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

    Write2vrs_txt: function (inp, bWrite) {
        if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            var trn = inp.par.fnames[0]
            inp.out.result += trn
            var jsfname = userProject.get_jsfname(trn)
            var bib = BibleUti.load_BibleObj_by_fname(jsfname);
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
    },




    //// BibleUti /////
}
var UserProject = function () {

}
UserProject.prototype.set_rootDir = function (rootDir) {
    this.m_rootDir = rootDir
}
UserProject.prototype.get_jsfname = function (RevCode) {
    var inp = this.m_inp
    //var RevCode = inp.par.fnames[0]
    var dest_pfname = ""
    if ("_" === RevCode[0]) {
        RevCode = RevCode.substr(1)
        dest_pfname = `${this.m_rootDir}${inp.usr.proj.dest_myoj}/${RevCode}_json.js`
    } else {
        dest_pfname = `${this.m_rootDir}bible_obj_lib/jsdb/jsBibleObj/${RevCode}.json.js`;
    }
    return dest_pfname
}
UserProject.prototype.git_proj_parse = function (inp) {
    this.m_inp = inp

    if ("object" !== typeof inp.usr) {
        return null
    }
    function _parse_proj_url(proj_url) {
        //https://github.com/wdingbox/Bible_obj_weid.git
        var reg = new RegExp(/^https\:\/\/github\.com\/(\w+)\/(\w+)(\.git)$/)

        var mat = proj_url.match(reg)
        console.log("mat", mat)
        if (mat) {
            console.log(mat)
            var username = mat[1]
            var projname = mat[2]
            return { username: username, projname: projname }
        }
        return null
    }
    var proj_url = inp.usr.proj_url
    var passcode = inp.usr.passcode



    inp.usr.proj = _parse_proj_url(proj_url)
    if (inp.usr.proj) {
        var baseDir = "bible_usrs_dat"
        var acctname = "account"

        inp.usr.proj.acctname = acctname
        inp.usr.proj.baseDir = baseDir
        inp.usr.proj.git_dir = `${baseDir}/${inp.usr.proj.projname}`
        inp.usr.proj.acct_dir = `${baseDir}/${inp.usr.proj.projname}/${acctname}`
        inp.usr.proj.dest_myoj = `${baseDir}/${inp.usr.proj.projname}/${acctname}/wd`

        console.log("inp.usr.proj=", inp.usr.proj)

        inp.usr.proj.github_sNewUrl = `https://${inp.usr.proj.username}:${inp.usr.passcode}@github.com/${inp.usr.proj.username}/${inp.usr.proj.projname}.git`
    }

    return inp.usr.proj
}
UserProject.prototype.get_usr_acct_dir = function (res) {
    return `${this.m_rootDir}${this.m_inp.usr.proj.acct_dir}`
}
UserProject.prototype.get_usr_myoj_dir = function (res) {
    return `${this.m_rootDir}${this.m_inp.usr.proj.dest_myoj}`
}

UserProject.prototype.get_usr_git_dir = function (res) {
    return `${this.m_rootDir}${this.m_inp.usr.proj.git_dir}`
}
UserProject.prototype.git_proj_setup = async function (res) {
    var inp = this.m_inp
    var proj = inp.usr.proj;
    if (!proj) return console.log("failed git setup")


    inp.out.result += "create new usr dest_myoj=" + accdir

    //console.log("proj", proj)
    var password = "lll" //dev mac
    var git_setup_cmd = `
#!/bin/sh
cd ${this.m_rootDir}
echo ${password} | sudo -S mkdir -p ${proj.git_dir}
echo ${password} | sudo -S git clone  ${inp.usr.proj_url} ${proj.git_dir}
echo ${password} | sudo -S chmod  777 ${proj.git_dir}/.git/config
echo " git_setup_cmd end."
#cd -`
    var cp_template_cmd = `
#!/bin/sh
cd ${this.m_rootDir}
echo ${password} | sudo -S mkdir -p ${proj.acct_dir}
echo ${password} | sudo -S chmod -R 777 ${proj.acct_dir}
echo ${password} | sudo -S cp -aR  ./bible_obj_lib/jsdb/UsrDataTemplate/wd  ${proj.acct_dir}
echo ${password} | sudo -S chmod -R 777 ${proj.acct_dir}
echo " cp_template_cmd end."
#cd -`

    var gitdir = this.get_usr_git_dir()
    if (!fs.existsSync(`${gitdir}`)) {
        inp.out.exec_git_cmd_result = await BibleUti.exec_git_cmd(git_setup_cmd)
        inp.out.git_setup_cmd = git_setup_cmd
        inp.out.result += "create git dir: " + gitdir
        this.git_proj_config_update()
    }

    var accdir = this.get_usr_myoj_dir()
    console.log("accdir=",accdir)
    if (fs.existsSync(`${accdir}`)) {
        console.log("existing accdir=",accdir)
        inp.out.result += "dest_myoj alreadt exist: " + accdir
        change_perm_cmd = `echo ${password} | sudo -S chmod -R 777 ${this.m_rootDir}${proj.acct_dir}`
        inp.out.cp_template_cmd_result = await BibleUti.exec_git_cmd(change_perm_cmd)
    } else {
        inp.out.result += "git has no: " + accdir
        inp.out.cp_template_cmd = cp_template_cmd
        console.log("cp_template_cmd",cp_template_cmd)
        inp.out.cp_template_cmd_result = await BibleUti.exec_git_cmd(cp_template_cmd)
    }
    return inp
}
UserProject.prototype.git_proj_config_update = function () {

    /****
    [core]
            repositoryformatversion = 0
            filemode = true
            bare = false
            logallrefupdates = true
            ignorecase = true
            precomposeunicode = true
    [remote "origin"]
            url = https://github.com/wdingbox/bible_obj_weid.git
            fetch = +refs/heads/*:refs/remotes/origin/*
    [branch "master"]
            remote = origin
            merge = refs/heads/master
    ******/

    //https://github.com/wdingbox/bible_obj_weid.git
    //https://github.com/wdingbox:passcode@/bible_obj_weid.git



    var git_config_fname = `${this.m_rootDir}${this.m_inp.usr.proj.git_dir}/.git/config`
    console.log("git config:", git_config_fname)


    function _change_config_permission(fname) {
        if (fs.existsSync(fname)) {
            try {
                const fd = fs.openSync(fname, "r");
                fs.fchmodSync(fd, 0o777, err => {
                    if (err) throw err;
                    else {
                        console.log("File permission change succcessful");
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    };
    function _change_config_owner(fname) {

    };
    //_change_config_permission(git_config_fname)

    if (fs.existsSync(git_config_fname)) {
        var txt = fs.readFileSync(git_config_fname, "utf8")
        console.log("old:", this.m_inp.usr.proj_url)
        console.log("new:", this.m_inp.usr.proj.github_sNewUrl)
        txt = txt.replace(this.m_inp.usr.proj_url, this.m_inp.usr.proj.github_sNewUrl)
        fs.writeFileSync(git_config_fname, txt, "utf8")
    }
}
UserProject.prototype.get_git_cmd = function () {
    password = "lll" //dev mac
    var cmd = `
cd  ${this.get_usr_git_dir()}
echo ${password} | sudo -S git status
echo ${password} | sudo -S git diff
echo ${password} | sudo -S git add *
echo ${password} | sudo -S git commit -m "svr mac checkin"
echo ${password} | sudo -S git push
echo ${password} | sudo -S git status
cd -
`
    return cmd
}
UserProject.prototype.get_git_cmd_pull = function () {
    password = "lll" //dev mac
    var cmd = `
cd  ${this.get_usr_git_dir()}
echo ${password} | sudo -S git status
echo ${password} | sudo -S git pull
echo ${password} | sudo -S git status
cd -
`
    return cmd
}
var userProject = new UserProject()




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
        this.m_src = this.url + this.api.str + '?inp=' + encodeURIComponent(JSON.stringify(this.inp));
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
        if (!req || !res) {
            return inp_struct_base
        }
        var inp = BibleUti.GetApiInputParamObj(req)
        var proj = userProject.git_proj_parse(inp)
        inp.out.result = "Write?"

        inp = BibleUti.Write2vrs_txt(inp, true)

        console.log(inp.out.m_fname)
        var cmdstr = userProject.get_git_cmd()
        inp.out.exec_git_result = BibleUti.exec_git_cmd(cmdstr, res)

        //console.log(inp)


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
        inp.out.result = "read:"

        var cmdstr = userProject.get_git_cmd_pull()
        inp.out.exec_git_result = BibleUti.exec_git_cmd(cmdstr, res)

        inp = BibleUti.Write2vrs_txt(inp, false)
       
        var ss = JSON.stringify(inp)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + ss + ");");
        res.end();
    },

    ///////////////////////////////////
    ApiAccout_setup_usr_async: function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
    },
    ApiAccout_setup_usr: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.GetApiInputParamObj(req)
        console.log("inp is ", inp)

        userProject.git_proj_parse(inp)
        inp = await userProject.git_proj_setup(res)
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

