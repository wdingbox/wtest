

const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');
var url = require('url');
const fsPromises = require("fs").promises;

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
    sid: "",
encrypt_usr: function(){
    if(!this.inp.usr.passcode_encrypted){
        //this.inp.usr.passcode_encrypted = 1;
        //this.inp.usr.passcode_old = this.inp.usr.passcode
        //this.inp.usr.passcode = atob(this.inp.usr.passcode)
    }else{
        alert("alredy encrypted???")
    }
},
Url: function (){
    this.m_src = this.url + this.api + '?inp=' + encodeURIComponent(JSON.stringify(this.inp)) + "&sid=" + this.sid;
    return this.m_src;
},
Response : function(dat, sid){
    this.inp.sid = sid
    this.m_cbf(dat)
},
Run : function (cbf) {
    this.encrypt_usr()
    this.RunJsonP(cbf)
    this.api = this.inp.par = null;
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
},
RunAjaxPost : function(cbf){
    this.encrypt_usr()
    this.RunAjax_Type_Post (cbf)
    this.api = this.inp.par = null;
},
RunAjax_Type_Post : function(cbf){
    var surl = "http://${res.req.headers.host}/" + this.api
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
        })
        .fail( function(xhr, textStatus, errorThrown) {
            console.log("surl",surl)
            alert("xhr.responseText="+xhr.responseText+",textStatus="+textStatus);
            //alert("textStatus="+textStatus);
        });
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
        if (!inp.usr.f_path) inp.usr.f_path = ""
        var proj = userProject.proj_parse(inp)

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

    ApiBibleObj_load_by_bibOj: async function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        var proj = userProject.proj_parse(inp)

        var stat = await userProject.proj_setup()
        if (!stat || stat.out.state.bEditable !== 1) return console.log("proj_setup failed.", stat)


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
            var proj = userProject.proj_parse(inp)
            if (!proj) {
                save_res.desc = "proj=null"
                return
            }
            var stat = await userProject.proj_setup()
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
            var proj = userProject.proj_parse(inp)
            if (!proj) return console.log("proj_parse failed.")

            var stat = await userProject.proj_setup()
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
        var proj = userProject.proj_parse(inp)

        if (proj) {

            await userProject.proj_setup()

            var retp = userProject.profile_state()
            if (0) {
                await userProject.git_pull(function (bSuccess) {

                })
                await userProject.git_push()
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
        var ret = userProject.proj_parse(inp)
        if (ret) {
            await userProject.proj_setup()
        }

        var sret = JSON.stringify(inp, null, 4)
        var sid = ""

        console.log("oup is ", inp.out)

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(`Jsonpster.Response(${sret},${sid});`);
        res.end();
    },

    ApiUsrReposData_destroy: async function (req, res) {
        if (!req || !res) {
            return inp_struct_account_setup
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        if (userProject.proj_parse(inp)) {


            var stat = userProject.profile_state()
            if (0 === userProject.m_inp.out.state.bRepositable) {
                //case push failed. Don't delete
                return inp
            }

            var res2 = await userProject.exec_cmd_git("git add *")
            var res3 = await userProject.exec_cmd_git(`git commit -m "before del. repodesc:${inp.usr.repodesc}"`)
            var res4 = await userProject.git_push()

            var res5 = await userProject.proj_destroy()
        }

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
        if (userProject.proj_parse(inp)) {
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
        if (userProject.proj_parse(inp)) {
            await userProject.proj_setup()
            //await userProject.git_add_commit_push("push hard.", "");//real push hard.

            var res2 = await userProject.exec_cmd_git("git add *")
            var res3 = await userProject.exec_cmd_git(`git commit -m "svr-push. repodesc:${inp.usr.repodesc}"`)
            var res4 = await userProject.git_push()
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
        if (userProject.proj_parse(inp)) {
            await userProject.proj_setup()
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
        if (userProject.proj_parse(inp)) {
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
    ApiBibleObj_read_AllUsrs_BkcChpVrs_txt: function (req, res) {
        if (!req || !res) {
            return inp_struct_base
        }
        var inp = BibleUti.Parse_req_GET_to_inp(req)
        var userProject = new BibleObjGituser(BibleObjJsonpApi.m_rootDir)
        var proj = userProject.proj_parse(inp)
        var doc = inp.par.fnames[0]


        inp.out.data = {}
        //////----
        function __load_bcv(jsfname, inp) {
            //'../../../../bible_study_notes/usrs/bsnp21/pub_wd01/account/myoj/myNote_json.js': 735213,
            var nary = jsfname.split("/")
            var usr_repo = nary[6] + "/" + nary[7]
            var bio = BibleUti.loadObj_by_fname(jsfname);
            var karyObj = BibleUti.inpObj_to_karyObj(inp.par.inpObj)
            if (karyObj.kary.length < 3) {
                inp.out.desc = `err inpObj: ${JSON.stringify(karyObj)}`
            }
            if (proj && bio.obj && karyObj.kary.length >= 3) {
                //await userProject.git_pull(function (bSuccess) {
                //})
                inp.out.desc = "load success"
                var usr_repo = nary[6] + "/" + nary[7] + "@" + (new Date(bio.stat.mtime)).toISOString().substr(0, 10)
                inp.out.data[usr_repo] = bio.obj[karyObj.bkc][karyObj.chp][karyObj.vrs]
            } else {
                inp.out.desc = "failed git pull and load"
            }
        }
        function __load_speciesinfo(jsfname) {
            //"../../../../bible_study_notes/usrs/bsnp21/pub_wd01/account/dat/localStorage_json.js": 895,
            var nary = jsfname.split("/")
            nary[9] = "dat", nary[10] = "localStorage_json.js"
            var specifile = nary.join("")
        }


        var jsfname = userProject.get_pfxname(doc)
        __load_bcv(jsfname, inp)

        /////----
        var docfilname = userProject.get_DocCode_Fname(doc)
        var docfilname2 = userProject.get_usr_myoj_dir("/" + docfilname)

        var outfil = userProject.m_SvrUsrsBCV.gen_all_files_of(docfilname)
        console.log("jsfn:", jsfname)
        for (var i = 0; i < outfil.m_olis.length; i++) {
            var jsfn = outfil.m_olis[i]
            if (docfilname2 === jsfn) continue;
            console.log("jsfn=", jsfn)
            __load_bcv(jsfn)
        }




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

