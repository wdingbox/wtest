

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
    exec_Cmd: async function (command) {
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
                reject(err);
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
        console.log("inp=", JSON.stringify(inpObj, null, 4));
        inpObj.out = { desc: "", data: null }
        return inpObj;
    },

    fetch_bcv: function (BibleObj, oj) {
        console.log("fetch_bcv oj", JSON.stringify(oj, null, 4))
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
            inp.out.desc += trn
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
                                inp.out.desc += ":Write-success"
                            } else {
                                inp.out.desc += ":Read-success"
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

UserProject.prototype.git_proj_parse = function (inp) {
    this.m_inp = inp

    if ("object" !== typeof inp.usr) {
        inp.out.desc = "failed inp.usr "
        return null
    }
    function _parse_proj_url(proj_url) {
        //https://github.com/wdingbox/Bible_obj_weid.git
        var reg = new RegExp(/^https\:\/\/github\.com\/(\w+)\/(\w+)(\.git)$/)

        var mat = proj_url.match(reg)
        //console.log("mat", mat)
        if (mat) {
            console.log(mat)
            var username = mat[1]
            var projname = mat[2]
            return { username: username, projname: projname }
        }
        inp.out.desc = "failed parse url:" + proj_url
        return null
    }
    var proj_url = inp.usr.repository
    var passcode = inp.usr.passcode

    inp.usr.proj = _parse_proj_url(proj_url)
    if (inp.usr.proj) {
        const baseDir = "bible_usrs_dat/usrs"
        var gitDir = `${baseDir}/${inp.usr.proj.username}/${inp.usr.proj.projname}`
        var rw_Dir = `${gitDir}/account`
        var tarDir = `${rw_Dir}/myoj`

        inp.usr.proj.baseDir = baseDir
        inp.usr.proj.git_dir = `${gitDir}`
        inp.usr.proj.acct_dir = `${rw_Dir}`
        inp.usr.proj.dest_myoj = `${tarDir}`

        console.log("inp.usr.proj=", inp.usr.proj)

        inp.usr.proj.git_Usr_Pwd_Url = `https://${inp.usr.proj.username}:${inp.usr.passcode}@github.com/${inp.usr.proj.username}/${inp.usr.proj.projname}.git`
    }

    return inp.usr.proj
}
UserProject.prototype.get_usr_rw_dir = function (res) {
    if (!this.m_inp.usr.proj) return ""
    return `${this.m_rootDir}${this.m_inp.usr.proj.acct_dir}`
}
UserProject.prototype.get_usr_myoj_dir = function (res) {
    if (!this.m_inp.usr.proj) return ""
    return `${this.m_rootDir}${this.m_inp.usr.proj.dest_myoj}`
}

UserProject.prototype.get_usr_git_dir = function (subpath) {
    if (!this.m_inp.usr.proj) return ""
    if(undefined === subpath || null === subpath){
        return `${this.m_rootDir}${this.m_inp.usr.proj.git_dir}`
    }
    return `${this.m_rootDir}${this.m_inp.usr.proj.git_dir}${subpath}`
}
UserProject.prototype.get_jsfname = function (RevCode) {
    var inp = this.m_inp
    //var RevCode = inp.par.fnames[0]
    var dest_pfname = ""
    if ("_" === RevCode[0]) {
        RevCode = RevCode.substr(1)
        if (inp.usr.proj) {
            dest_pfname = `${this.get_usr_myoj_dir()}/${RevCode}_json.js`
        }
    } else {
        dest_pfname = `${this.m_rootDir}bible_obj_lib/jsdb/jsBibleObj/${RevCode}.json.js`;
    }
    return dest_pfname
}


UserProject.prototype.git_proj_destroy = async function (res) {
    var inp = this.m_inp
    var proj = inp.usr.proj;
    if (!proj) {
        console.log("failed git setup", inp)
        return inp
    }

    //console.log("proj", proj)
    var password = "lll" //dev mac
    var git_setup_cmd = `
#!/bin/sh
cd ${this.m_rootDir}
echo ${password} | sudo -S rm -rf ${proj.git_dir}
echo " git_setup_cmd end."
#cd -`

    var gitdir = this.get_usr_git_dir()
    if (fs.existsSync(`${gitdir}`)) {
        inp.out.exec_git_cmd_result = await BibleUti.exec_Cmd(git_setup_cmd)
        inp.out.git_setup_cmd = git_setup_cmd
        inp.out.desc += "destroyed git dir: " + gitdir
    }
    return inp
}
UserProject.prototype.git_proj_setup = async function (res) {
    var inp = this.m_inp
    var proj = inp.usr.proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
    inp.out.desc = "setup start."

    //console.log("proj", proj)
    var password = "lll" //dev mac
    var git_setup_cmd = `
#!/bin/sh
cd ${this.m_rootDir}
##  echo ${password} | sudo -S mkdir -p ${proj.git_dir}
echo ${password} | sudo -S GIT_TERMINAL_PROMPT=0 git clone  ${inp.usr.repository}  ${proj.git_dir}
echo ${password} | sudo -S chmod  777 ${proj.git_dir}/.git/config
echo " git_setup_cmd end."
#cd -`

    var cp_template_cmd = `
#!/bin/sh
cd ${this.m_rootDir}
echo ${password} | sudo -S mkdir -p ${proj.acct_dir}
echo ${password} | sudo -S chmod -R 777 ${proj.acct_dir}
echo ${password} | sudo -S cp -aR  ./bible_obj_lib/jsdb/UsrDataTemplate/myoj  ${proj.acct_dir}
echo ${password} | sudo -S chmod -R 777 ${proj.acct_dir}
echo " cp_template_cmd end."
#cd -`

    var gitdir = this.get_usr_git_dir()
    if (!fs.existsSync(`${gitdir}`)) {
        inp.out.exec_git_cmd_result = await BibleUti.exec_Cmd(git_setup_cmd)
        inp.out.git_setup_cmd = git_setup_cmd
        inp.out.desc += "clone git dir: " + gitdir
        this.git_config_allow_push(true)
    }

    if (!fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", invalide git repo: "
        return inp
    }

    var accdir = this.get_usr_myoj_dir()
    console.log("accdir=", accdir)
    if (fs.existsSync(`${accdir}`)) {
        console.log("existing accdir=", accdir)
        inp.out.desc += ";git alreadt has oj: " + accdir
        change_perm_cmd = `echo ${password} | sudo -S chmod -R 777 ${this.m_rootDir}${proj.acct_dir}`
        inp.out.cp_template_cmd_result = await BibleUti.exec_Cmd(change_perm_cmd)
    } else {
        inp.out.desc += "git has no dat: " + accdir
        inp.out.cp_template_cmd = cp_template_cmd
        console.log("cp_template_cmd", cp_template_cmd)
        inp.out.cp_template_cmd_result = await BibleUti.exec_Cmd(cp_template_cmd)
        inp.out.desc += "cp oj to git: " + accdir
    }
    return inp
}
UserProject.prototype.git_proj_status = function () {
    var inp = this.m_inp
    inp.out.state = { desc: "status:", bOk: 0 }
    var gitdir = this.get_usr_git_dir("/.git")
    if (fs.existsSync(gitdir)) {
        inp.out.state.desc += "bGitDir=1,"
    } else {
        inp.out.state.desc += "bGitDir=0,"
    }

    var accdir = this.get_usr_myoj_dir()
    if (fs.existsSync(accdir)) {
        inp.out.state.desc += "bAcctDir=1. OK ready"
        inp.out.state.bOk = 1
    } else {
        inp.out.state.desc += "bAcctDir=0. unready"
    }
    return inp
}
UserProject.prototype.git_config_allow_push = function (bAllowPush) {

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


    if (!this.m_inp.usr.proj) return ""
    var git_config_fname = `${this.get_usr_git_dir()}/.git/config`
    console.log("git config:", git_config_fname)

    if (fs.existsSync(git_config_fname)) {
        var txt = fs.readFileSync(git_config_fname, "utf8")
        console.log("old:", this.m_inp.usr.repository)
        console.log("new:", this.m_inp.usr.proj.git_Usr_Pwd_Url)
        txt = txt.replace(this.m_inp.usr.repository, this.m_inp.usr.proj.git_Usr_Pwd_Url)
        fs.writeFileSync(git_config_fname, txt, "utf8")
    }
}
UserProject.prototype.get_cmd_git_push_after_wrtie = function () {
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
#!/bin/sh
cd  ${this.get_usr_git_dir()}
echo ${password} | sudo -S git status
echo ${password} | sudo -S git pull
echo ${password} | sudo -S git status
cd -
`
    return cmd
}
UserProject.prototype.get_git_cmd_push = function () {
    password = "lll" //dev mac
    var cmd = `
#!/bin/sh
cd  ${this.get_usr_git_dir()}
echo ${password} | sudo -S git status
echo ${password} | sudo -S git push
echo ${password} | sudo -S git status
cd -
`
    return cmd
}
UserProject.prototype.git_push = function () {
    this.git_proj_status()
    if (!this.m_inp.out.state.bOk) {
        this.m_inp.out.state.desc += ",cannot push."
        return null
    }
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
    ApiBibleObj_write_Usr_BkcChpVrs_txt: function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        var inp = BibleUti.GetApiInputParamObj(req)
        var proj = userProject.git_proj_parse(inp)
        inp.out.desc = "Write?"

        inp = BibleUti.Write2vrs_txt(inp, true)

        console.log(inp.out.m_fname)
        var cmdstr = userProject.get_cmd_git_push_after_wrtie()
        inp.out.exec_git_result = BibleUti.exec_Cmd(cmdstr, res)

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
        inp.out.desc = "read:"

        var cmdstr = userProject.get_git_cmd_pull()
        inp.out.exec_git_result = BibleUti.exec_Cmd(cmdstr, res)

        inp = BibleUti.Write2vrs_txt(inp, false)

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
        console.log("inp is ", inp)
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
        console.log("inp is ", inp)
        userProject.git_proj_parse(inp)

        inp = await userProject.git_proj_destroy(res)
        var sret = JSON.stringify(inp, null, 4)

        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write("Jsonpster.Response(" + sret + ");");
        res.end();
    },
    ApiUsrReposData_status: function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.GetApiInputParamObj(req)
        console.log("inp is ", inp)
        userProject.git_proj_parse(inp)

        inp = userProject.git_proj_status()

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
        console.log("inp is ", inp)
        userProject.git_proj_parse(inp)
        if (!inp.usr.passcode) {
            inp.usr.state = "passcode is empty. cannot push."
            inp.usr.state.bReady = false
        } else {
            userProject.git_push()
        }
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

