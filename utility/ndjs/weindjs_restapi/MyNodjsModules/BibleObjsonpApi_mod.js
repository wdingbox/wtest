

const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');
var url = require('url');
const fsPromises = require("fs").promises;
const crypto = require('crypto')

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
//const exec = require('child_process').exec;

const { BibleObjGituser, BibleUti } = require("./BibleObjGituser_mod")






var inp_struct_base = {
    usr: {
        repopath: "",
        passcode: "",
        repodesc: ""
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
        ////////////////////////////////////////////
        //app.get("/Jsonpster", (req, res) => {
        console.log("res.req.headers.host=", res.req.headers.host);

        var inp = BibleUti.Parse_req_GET_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        userProject.proj_parse_usr(inp)
        var kpf = userProject.genKeyPair()
        var pkbs = ""
        if (kpf) {
            pkbs = Buffer.from(kpf.publicKey).toString("base64")
        }

        //////////////
        var RestApi = {}
        Object.keys(this).forEach(function (key) {
            RestApi[key] = { str: key };//, inp: ApiJsonp_BibleObj[key]() };
        })
        var jstr_RestApi = JSON.stringify(RestApi);
        var structall = JSON.stringify(inp_struct_all)



        var s = `
var Jsonpster = {
    host: "${res.req.headers.host}",
    url: "http://${res.req.headers.host}/",
    api: "",
    inp: ${structall},
    pkbs:"${pkbs}",
encrypt_usr: function(){
    if(this.pkbs.length > 0){
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(atob(this.pkbs));
        var txt = JSON.stringify(this.inp)
        if(txt.length>500){
            alert("max 4096-bit key up to 501 bytes")
        }
        var encrypted = encrypt.encrypt(txt);
        //alert(encrypted.length)
        return encrypted
        alert(txt)
        alert(txt.length)
        var txt2 = encodeURIComponent(txt)
        alert(txt2)
        alert(txt2.length)
        var msg = btoa(txt2)
        alert(msg.length)
    }
},
Url: function (){
    this.m_src = this.url + this.api + '?inp=' + btoa(encodeURIComponent(JSON.stringify(this.inp))) ;
    return this.m_src;
},
Response : function(dat, sid){
    this.inp.sid = sid
    this.m_cbf(dat)
},
Run : function (cbf) {
    this.encrypt_usr()
    this.RunJsonP(cbf)
    this.api = this.inp.par = this.inp.usr = this.inp.SSID = null;
},
RunJsonP : function (cbf) {
    if (!cbf) alert('callback m_cbf null');
    if (!this.api) alert('api=null');
    if (!this.inp) alert('inp=null');
    this.m_cbf = cbf;
    var s = document.createElement('script');
    s.src = this.Url()
    document.body.appendChild(s);
    console.log('Jsonpster:', Jsonpster);
},
RunAjaxPost : function(cbf){
    this.encrypt_usr()
    this.RunAjax_Type_Post (cbf)
    this.api = this.inp.par = this.inp.usr = this.inp.SSID = null;
},
RunAjax_Type_Post : function(cbf){
    var surl = "http://${res.req.headers.host}/" + this.api
    var inpd = JSON.stringify(this.inp)
    $.ajax({
        type: "POST",
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        url: surl,
        data: inpd,
        username: 'user',
        password: 'pass',
        crossDomain : true,
        xhrFields: {
            withCredentials: false
        }
    })
        .success(function( data ) {
            //console.log("success",data);
            //cbf(JSON.parse(data))
        })
        .done(function( data ) {
            //console.log("done",data);
            cbf(JSON.parse(data))
        })
        .fail( function(xhr, textStatus, errorThrown) {
            console.log("surl",surl)
            alert("xhr.responseText="+xhr.responseText+",textStatus="+textStatus);
            //alert("textStatus="+textStatus);
        });
},
RunJsonP_Signin : function (cbf) {
    this.RunAjax_Type_Post_Signin (cbf)
    
},
RunAjax_Type_Post_Signin : function(cbf){
    var surl = "http://${res.req.headers.host}/" + this.api
    var usrs = JSON.stringify(this.inp.usr)
    //alert(this.inp.usr)
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(atob(this.pkbs));
    if(usrs.length > 500){
        alert("max 4096-bit key up to 501 bytes.len="+usrs.length)
    }
    var encrypted = encrypt.encrypt(usrs);
    //alert(encrypted.length)
    this.inp.cipherusrs = encrypted
    console.log(this.inp)
    this.inp.api = this.api
    if(!this.inp.CUID) alert("missing CUID.")
    console.log("Jsonpster")
    console.log(Jsonpster)
    $.ajax({
        type: "POST",
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        url: surl,
        data: JSON.stringify(this.inp),
        username: 'user',
        password: 'pass',
        crossDomain : true,
        xhrFields: {
            withCredentials: false
        }
    })
        .success(function( data ) {
            //console.log("success",data);
            //cbf(JSON.parse(data))
        })
        .done(function( data ) {
            //console.log("done",data);
            cbf(JSON.parse(data))
            Jsonpster.api = Jsonpster.inp.par = Jsonpster.inp.usr = Jsonpster.inp.SSID = null;
        })
        .fail( function(xhr, textStatus, errorThrown) {
            console.log("surl",surl)
            alert("xhr.responseText="+xhr.responseText+",textStatus="+textStatus);
            //alert("textStatus="+textStatus);
        });
},
xxRunPost : function (cbf) {
    if(!cbf) return alert("cbf null.")
    var surl = "http://${res.req.headers.host}/" + this.api
    $.post(surl,
        this.inp,
        function(data, status){
            if(cbf) cbf(data, status)
            console.log("Data: " + data + ",Status: " + status);
        }
    )
},
xxRunPosts : function (cbf) {
    if(!cbf) return alert("cbf null.")
    var surl = "https://${res.req.headers.host}/"
    surl = surl.replace("7778", "7775") + this.api
    $.post(surl,
        this.inp,
        function(data, status){
            if(cbf) cbf(data, status)
            console.log("Data: " + data + ",Status: " + status);
        }
    )
},
xxRun_Post : function (cbf) {
    if(!cbf) return alert("cbf null.")
    var surl = "http://${res.req.headers.host}/" + this.api
    $.post(surl,
        this.inp
    ).done(function(ret){
        if(cbf) cbf(data, status)
    })
}
};
const RestApi = JSON.parse('${jstr_RestApi}');
`;;;;;;;;;;;;;;

        console.log(s);
        res.send(s);
        res.end();
        //});
    },
    ApiBibleObj_search_txt: function (req, res) {
        if (!req || !res) {
            return inp_struct_search
        }
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        var inp = BibleUti.Parse_req_GET_to_inp(req)
        //if (!inp.usr.f_path) inp.usr.f_path = ""
        var proj = userProject.proj_parse_usr(inp)

        var TbcvObj = {};
        if (proj && "object" === typeof inp.par.fnames) {//['NIV','ESV']
            for (var i = 0; i < inp.par.fnames.length; i++) {
                var trn = inp.par.fnames[i];
                var jsfname = userProject.get_pfxname(trn)
                console.log("jsfname:", jsfname)
                var bib = BibleUti.loadObj_by_fname(jsfname);
                var bcObj = BibleUti.copy_biobj(bib.obj, inp.par.bibOj);
                TbcvObj[trn] = bcObj;
                inp.out.desc += ":" + trn
            }
        }
        var bcvT = {}
        BibleUti.convert_Tbcv_2_bcvT(TbcvObj, bcvT)
        inp.out.data = BibleUti.search_str_in_bcvT(bcvT, inp.par.Search.File, inp.par.Search.Strn);

        inp.out.desc += ":success."
        var sret = JSON.stringify(inp);
        var sid = ""

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },

    ApiBibleObj_load_by_bibOj: function (req, res) {
        function _run(req, res) {
            if (!req || !res) {
                return { state: { desc: "req|res null" } }
            }
            var inp = BibleUti.Parse_req_GET_to_inp(req)
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr(inp)

            var stat = userProject.proj_setup()
            if (!stat || stat.out.state.bEditable !== 1) {
                console.log("proj_setup failed.", stat)
                return inp;
            }


            if (!stat.out.state || stat.out.state.bMyojDir <= 0) {
                console.log("-----:bMyojDir<=0. dir not exist")
            } else {
                console.log("-----:bMyojDir>0", inp.par.fnames, typeof inp.par.fnames)
                console.log("-----:binp.par.bibOj", inp.par.bibOj)
                var TbcObj = {};
                if (proj && "object" === typeof inp.par.fnames && inp.par.bibOj) {//['NIV','ESV']
                    console.log("inp.par.fnames:", inp.par.fnames)
                    for (var i = 0; i < inp.par.fnames.length; i++) {
                        var trn = inp.par.fnames[i];
                        var jsfname = userProject.get_pfxname(trn)
                        console.log("load:", jsfname)
                        var bib = BibleUti.loadObj_by_fname(jsfname);
                        if (!bib.obj) {
                            inp.out.desc += ":noexist:" + trn
                            console.log("not exist..............", jsfname)
                            continue
                        }
                        var bcObj = BibleUti.copy_biobj(bib.obj, inp.par.bibOj);
                        TbcObj[trn] = bcObj;
                        inp.out.desc += ":" + trn
                    }
                    inp.out.desc += ":success"
                }
                //console.log(TbcObj)
                var bcvT = {}
                BibleUti.convert_Tbcv_2_bcvT(TbcObj, bcvT)
                inp.out.data = bcvT
                //console.log(bcvT)
            }
            return inp
        }

        var inp = _run(req, res)
        console.log("read inp.out:")
        console.log(inp.out)

        var sret = JSON.stringify(inp);
        var sid = ""
        //console.log("sert:", sret)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },

    ApiBibleObj_write_Usr_BkcChpVrs_txt: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        BibleUti.Parse_post_req_to_inp(req, res, async function (inp) {
            //: unlimited write size. 
            var save_res = { desc: "to save" }
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr(inp)
            if (!proj) {
                save_res.desc = "proj=null"
                return
            }
            var stat = userProject.proj_setup()
            if (!stat || stat.out.state.bEditable !== 1) return console.log("proj_setup failed.", stat)



            //if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            var doc = inp.par.fnames[0]
            var jsfname = userProject.get_pfxname(doc)
            var bio = BibleUti.loadObj_by_fname(jsfname);
            if (!bio.obj) {
                save_res.desc = `load(${doc},${jsfname})=null`
                return;
            }

            var karyObj = BibleUti.inpObj_to_karyObj(inp.par.inpObj)
            if (karyObj.kary.length !== 4) {
                save_res.desc = `err inpObj: ${JSON.stringify(karyObj)}`
                return
            }
            console.log(karyObj)
            var pChp = bio.obj[karyObj.bkc][karyObj.chp];//[karyObj.vrs]
            if (!pChp[karyObj.vrs]) {
                pChp[karyObj.vrs] = ""
            }

            var dlt = karyObj.txt.length - pChp[karyObj.vrs].length
            if (pChp[karyObj.vrs] === karyObj.txt) {
                console.log("Not to save: the new txt is same as original txt-----.")
            } else {
                console.log("Save: new txt differs original txt-----.dlt=", dlt)
                pChp[karyObj.vrs] = karyObj.txt
                bio.writeback()
            }

            ////
            var tagName = `${doc}~${karyObj.bkc}${karyObj.chp}:${karyObj.vrs}`
            var save_res = {}
            save_res.saved_size = "" + karyObj.txt.length + ",dlt:" + dlt
            save_res.len = karyObj.txt.length
            save_res.dlt = dlt
            save_res.desc = `${tagName} saved.`
            inp.out.save_res = save_res

            userProject.git_add_commit_push_Sync(save_res.desc);//after saved
        })

        //res.writeHead(200, { 'Content-Type': 'text/javascript' });
        //res.write(`Jsonpster.Response(${sret},${sid});`);
        //res.end();
    },


    ///////////////////////////////////
    ApiUsrDat_save: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        BibleUti.Parse_post_req_to_inp(req, res, async function (inp) {
            //: unlimited write size. 
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr(inp)
            if (!proj) return console.log("proj_parse_usr failed.")

            var stat = userProject.proj_setup()
            if (!stat || stat.out.state.bEditable !== 1) return console.log("proj_setup failed.", stat)


            //if ("object" === typeof inp.par.fnames) {//['NIV','ESV']
            var doc = inp.par.fnames[0]
            var jsfname = userProject.get_pfxname(doc)
            console.log("jsfname=", jsfname)
            var ret = BibleUti.loadObj_by_fname(jsfname)
            if (!ret.obj) return console.log("failed:=", jsfname)
            try {
                ret.obj = JSON.parse(inp.par.data, null, 4)
                console.log("ret", ret)
                ret.writeback()
            } catch (err) {
                console.log("err", err)
                inp.out.state.err = err
            }

            //// 
            var save_res = {}
            save_res.desc = "len:" + inp.par.data.length + ",dlt:" + ret.dlt_size
            save_res.dlt = ret.dlt_size
            save_res.len = inp.par.data.length
            inp.par.data = ""
            //save_res.ret = ret
            inp.out.save_res = save_res
            var msg = jsfname + " saved."

            //
            userProject.git_add_commit_push_Sync(save_res.desc);//after saved
        })
    },
    ApiUsrDat_load: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        var proj = userProject.proj_parse_usr(inp)

        if (proj) {

            userProject.proj_setup()

            var retp = userProject.profile_state()
            if (0) {
                await userProject.git_pull(function (bSuccess) {

                })
            }

            //inp = BibleUti.Write2vrs_txt(inp, false)
            var doc = inp.par.fnames[0]
            var jsfname = userProject.get_pfxname(doc)
            var ret = BibleUti.loadObj_by_fname(jsfname)
            inp.out.data = ret.obj
            if (!inp.out.state) inp.out.state.bEditable = 1
        }

        var sret = JSON.stringify(inp)
        var sid = ""
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },







    ///////////////////////////////////


    ApiUsrReposData_create: async function (req, res) {
        console.log("ApiUsrReposData_create")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        var ret = userProject.proj_parse_usr_signin(inp)
        if (ret) {
            userProject.proj_setup()

            if (inp.out.state.bEditable === 1) {
                inp.out.state.SSID = userProject.session_create().SSID
            }
        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },
    ApiUsrReposData_Signin_Post: async function (req, res) {
        console.log("ApiUsrReposData_create")
        if (!req || !res) {
            return inp_struct_account_setup
        }
        BibleUti.Parse_post_req_to_inp(req, res, async function (inp) {
            //: unlimited write size. 
            var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
            var proj = userProject.proj_parse_usr_signin(inp)
            if (!proj) return console.log("proj_parse_usr_signin failed.")

            var stat = userProject.proj_setup()
            if (inp.out.state.bEditable === 1) {
                inp.out.state.SSID = userProject.session_create().SSID
            }
        })
    },

    ApiUsrReposData_destroy: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        if (userProject.proj_parse_usr(inp)) {
            userProject.profile_state()
            if (0 === inp.out.state.bRepositable) {
                //case push failed. Don't delete
                console.log("git dir not exit.")

            } else {
                var res2 = userProject.execSync_cmd_git("git add *")
                var res3 = userProject.execSync_cmd_git(`git commit -m "before del. repodesc:${inp.usr.repodesc}"`)
                var res4 = userProject.git_push()

                var res5 = userProject.proj_destroy()
            }
        }
        userProject.profile_state()

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },

    ApiUsrReposData_status: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)

        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        if (userProject.proj_parse_usr(inp)) {
            var ret = userProject.profile_state()
            var res2 = await userProject.exec_cmd_git("git status -sb")
            if (res2 && res2.stdout) {
                inp.out.state.git_status_sb = res2.stdout
                inp.out.state.is_git_behind = res2.stdout.indexOf("behind")
            }
        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },


    ApiUsrReposData_git_push: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)

        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        if (userProject.proj_parse_usr(inp)) {
            userProject.proj_setup()
            //await userProject.git_add_commit_push("push hard.", "");//real push hard.

            var res2 = await userProject.exec_cmd_git("git add *")
            var res3 = await userProject.exec_cmd_git(`git commit -m "svr-push. repodesc:${inp.usr.repodesc}"`)
            var res4 = userProject.git_push()
        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },

    ApiUsrReposData_git_pull: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)

        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        if (userProject.proj_parse_usr(inp)) {
            userProject.proj_setup()
            //await userProject.git_pull();
        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },

    ApiUsr_Cmdline_Exec: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        if (userProject.proj_parse_usr(inp)) {
            var ret = userProject.profile_state()
            var rso = await userProject.cmd_exec()
            console.log("\n\n*cmd-res", rso)
        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""
        console.log("oup is ", inp.out)
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },

    /////
    ApiBibleObj_read_crossnetwork_BkcChpVrs_txt: function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        var proj = userProject.proj_parse_usr(inp)
        var doc = inp.par.fnames[0]
        //var docname = userProject.get_DocCode_Fname(doc)
        var docpathfilname = userProject.get_pfxname(doc)
        var outfil = userProject.m_SvrUsrsBCV.gen_crossnet_files_of(docpathfilname)
        //var docpathfilname = userProject.get_usr_myoj_dir("/" + docname)



        //////----
        function __load_to_obj(outObj, jsfname, owner, inp) {
            //'../../../../bible_study_notes/usrs/bsnp21/pub_wd01/account/myoj/myNote_json.js': 735213,
            var bio = BibleUti.loadObj_by_fname(jsfname);
            var karyObj = BibleUti.inpObj_to_karyObj(inp.par.inpObj)
            if (karyObj.kary.length < 3) {
                inp.out.desc = `err inpObj: ${JSON.stringify(karyObj)}`
            }
            if (proj && bio.obj && karyObj.kary.length >= 3) {
                var usr_repo = owner + "@" + (new Date(bio.stat.mtime)).toISOString().substr(0, 10)
                outObj[usr_repo] = bio.obj[karyObj.bkc][karyObj.chp][karyObj.vrs]
            } else {
            }
        }


        /////--------------
        var retObj = {}
        var owner = userProject.session_get_github_owner(docpathfilname)
        __load_to_obj(retObj, docpathfilname, owner, inp)
        //console.log("jspfn:", jsfname)
        console.log("dcpfn:", docpathfilname)
        for (var i = 0; i < outfil.m_olis.length; i++) {
            var jspfn = outfil.m_olis[i]
            if (docpathfilname === jspfn) continue;
            console.log("*docfname=", jspfn)
            var reposdes = userProject.session_git_repodesc_load(jspfn)
            if(!reposdes) continue
            console.log("*repodesc=", reposdes.repodesc, inp.usr.repodesc)
            if (reposdes.repodesc === inp.usr.repodesc) {
                var owner = userProject.session_get_github_owner(jspfn)
                __load_to_obj(retObj, jspfn, owner, inp)
            }
        }

        inp.out.repodesc = inp.usr.repodesc
        inp.out.data = retObj
        var sret = JSON.stringify(inp)
        var sid = ""
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    }

}//// BibleRestApi ////

var BibleObjJsonpApi = {
    set_postHeader: function (res) {
        // for cross domain post.

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
    },
    init: function (app, rootDir) {
        BibleObjJsonpApi.m_rootDir = rootDir
        //
        Object.keys(ApiJsonp_BibleObj).forEach(function (sapi) {
            console.log("api:", sapi)
            app.use("/" + sapi, function (req, res) {
                BibleObjJsonpApi.set_postHeader(res)

                ApiJsonp_BibleObj[sapi](req, res);
            })
        });
        return;
    }
}




module.exports = {
    BibleObjJsonpApi: BibleObjJsonpApi
}

