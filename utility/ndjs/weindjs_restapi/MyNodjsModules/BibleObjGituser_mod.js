

const fs = require('fs');
const path = require('path');
var url = require('url');
const fsPromises = require("fs").promises;

//var Uti = require("./Uti.module").Uti;
//var SvcUti = require("./SvcUti.module").SvcUti;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

//var btoa = require('btoa');
const crypto = require('crypto')



var BibleUti = {
    GetFilesAryFromDir: function (startPath, deep, cb) {//startPath, filter
        function recursiveDir(startPath, deep, outFilesArr) {
            var files = fs.readdirSync(startPath);
            for (var i = 0; i < files.length; i++) {
                var filename = path.join(startPath, files[i]);
                //console.log(filename);
                var stat = fs.lstatSync(filename);
                if (stat.isDirectory()) {
                    if (deep) {
                        recursiveDir(filename, deep, outFilesArr); //recurse
                    }
                    continue;
                }/////////////////////////
                else if (cb) {
                    //console.log("file:",filename)
                    if (!cb(filename)) continue
                }
                outFilesArr.push(filename);
            };
        };/////////////////////////////////////

        var outFilesArr = [];
        recursiveDir(startPath, deep, outFilesArr);
        return outFilesArr;
    },
    access_dir: function (http, dir) {
        function writebin(pathfile, contentType, res) {
            var content = fs.readFileSync(pathfile)
            //console.log("read:", pathfile)
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(content, 'binary')
            res.end()
        }
        function writetxt(pathfile, contentType, res) {
            var content = fs.readFileSync(pathfile, "utf8")
            //console.log("read:", pathfile)
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(content, 'utf-8')
            res.end()
        }
        // ./assets/ckeditor/ckeditor.js"
        // var dir = "./assets/ckeditor/"
        console.log("lib svr:", dir)
        var ftypes = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.htm': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.eot': 'appliaction/vnd.ms-fontobject',
            '.ttf': 'aplication/font-sfnt'
        }
        var binaries = [".png", ".jpg", ".wav", ".mp3", ".svg", ".pdf", ".eot"]
        BibleUti.GetFilesAryFromDir(dir, true, function (fname) {
            var ret = path.parse(fname);
            var ext = ret.ext
            //console.log("ret:",ret)
            if (ftypes[ext]) {
                console.log("base:", ret.base)
                console.log("api:", fname)
                http.use("/" + fname, async (req, res) => {
                    console.log('[post] resp write :', req.body, fname)
                    if (binaries.indexOf(ext) >= 0) {
                        writebin(fname, ftypes[ext], res)
                    } else {
                        writetxt(fname, ftypes[ext], res)
                    }
                })
                return true
            }
        });
    },
    GetFileStat: function (fnm) {
        if (fs.existsSync(fnm)) {
            const stats = fs.statSync(fnm);
            return stats;//.size; //mtime modifited
        }
        return { size: -1, mtime: 0 };
    },
    exec_Cmd: function (command) {
        return new Promise((resolve, reject) => {
            try {
                //command = "ls"
                //console.log('exec_Cmd:', command)
                exec(command, (err, stdout, stderr) => {
                    console.log('-exec_Cmd errorr:', err)
                    console.log('-exec_Cmd stderr:', stderr)
                    console.log('-exec_Cmd stdout:', stdout)

                    // the *entire* stdout and stderr (buffered)
                    //resolve(stdout);
                    resolve({
                        stdout: stdout,
                        stderr: stderr,
                        err: err
                    })

                });
            } catch (err) {
                console.log(err)
                reject(err);
            }
        })
    },
    execSync_Cmd: function (command) {
        try {
            //command = "ls"
            console.log('execSync Cmd:', command)
            var ret = execSync(command).toString();
            console.log(ret)
        } catch (error) {
            console.log("error:", error.status);  // 0 : successful exit, but here in exception it has to be greater than 0
            console.log("error:", error.message); // Holds the message you typically want.
            console.log("error:", error.stderr);  // Holds the stderr output. Use `.toString()`.
            console.log("error:", error.stdout);  // Holds the stdout output. Use `.toString()`.
        }
        return ret;
    },








    copy_biobj: function (BibleObj, oj) {
        //console.log("copy_biobj oj", JSON.stringify(oj, null, 4))
        if (!oj || Object.keys(oj).length === 0) return BibleObj
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(oj)) {
            if (!chpObj || Object.keys(chpObj).length === 0) {
                retOb[bkc] = BibleObj[bkc] //copy whole book
                continue
            }
            retOb[bkc] = {}
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                //console.log("bc", bkc, chp)
                if (!vrsObj || Object.keys(vrsObj).length === 0) {
                    retOb[bkc][chp] = BibleObj[bkc][chp]  //copyy whole chapter
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
    convert_Tbcv_2_bcvT: function (rbcv, bcvRobj) {
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

    search_str_in_bcvT: function (bcvR, Fname, searchStrn) {
        function _parse_global_parm(searchPat) {
            var arsrmat = searchPat.match(/^\/(.*)\/([a-z]*)$/)
            var exparm = "g"
            if (arsrmat && arsrmat.length === 3) {
                console.log(arsrmat)
                searchPat = arsrmat[1]
                exparm += arsrmat[2]
            }
            return { searchPat: searchPat, parm: exparm };
        }
        var parsePat = _parse_global_parm(searchStrn)
        console.log("searchStrn=", searchStrn)
        function _parse_AND(searchPat) {
            var andary = []
            var andmat = searchPat.match(/[\(][\?][\=][\.][\*]([^\)]+)[\)]/g)   //(?=.*Sarai)(?=.*Abram)
            if (andmat) {
                console.log(andmat)
                andmat.forEach(function (fand) {
                    var cors = fand.match(/(?:[\(][\?][\=][\.][\*])([^\)]+)([\)])/)
                    if (cors.length === 3) andary.push(cors[1])
                    console.log("cors", cors)
                })
            }
            return andary;
        }
        var andary = _parse_AND(searchStrn)
        console.log("andary:", andary)


        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(bcvR)) {
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                for (const [vrs, revObj] of Object.entries(vrsObj)) {
                    var bFound = false
                    for (const [rev, txt] of Object.entries(revObj)) {
                        if (rev === Fname) {
                            var rep = new RegExp(parsePat.searchPat, parsePat.parm);
                            var mat = txt.match(rep);
                            if (mat) {
                                mat.forEach(function (s, i) {
                                    //if (s.length > 0) console.log(i, s)
                                })
                                bFound = true
                                var txtFound = txt

                                if (andary.length === 0) {
                                    var repex = new RegExp(mat[0], parsePat.parm)
                                    txtFound = txt.replace(repex, "<font class='matInSvr'>" + mat[0] + "</font>");
                                } else {
                                    andary.forEach(function (strkey) {
                                        var repex = new RegExp(strkey, parsePat.parm)
                                        txtFound = txtFound.replace(repex, "<font class='matInSvr'>" + strkey + "</font>");
                                    })
                                }

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
    search_str_in_bibObj__not_used: function (bibObj, searchStrn) {
        var retOb = {}
        for (const [bkc, chpObj] of Object.entries(bibObj)) {
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    var rep = new RegExp(searchStrn, "g");
                    var mat = txt.match(rep);
                    if (mat) {
                        var txtFound = txt.replace(mat[0], "<font class='matInSvr'>" + mat[0] + "</font>");

                        if (!retOb[bkc]) retOb[bkc] = {}
                        if (!retOb[bkc][chp]) retOb[bkc][chp] = {};//BibleObj[bkc][chp]
                        if (!retOb[bkc][chp][vrs]) retOb[bkc][chp][vrs] = {};//BibleObj[bkc][chp]
                        retOb[bkc][chp][vrs][rev] = txtFound
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


    loadObj_by_fname: function (jsfnm) {
        var ret = { obj: null, fname: jsfnm, fsize: -1, header: "", err: "" };

        if (!fs.existsSync(jsfnm)) {
            console.log("f not exit:", jsfnm)
            return ret;
        }
        ret.stat = BibleUti.GetFileStat(jsfnm)
        ret.fsize = ret.stat.size;
        if (ret.fsize > 0) {
            var t = fs.readFileSync(jsfnm, "utf8");
            var i = t.indexOf("{");
            if (i > 0) {
                ret.header = t.substr(0, i);
                var s = t.substr(i);
                try {
                    ret.obj = JSON.parse(s);
                } catch (e) {
                    ret.err = e;
                }

            }
        }

        ret.writeback = function () {
            var s2 = JSON.stringify(this.obj, null, 4);
            fs.writeFileSync(this.fname, this.header + s2);
            ret.dlt_size = ret.header.length + s2.length - ret.fsize
        }
        return ret;
    },
    inpObj_to_karyObj: function (inpObj) {
        var keyObj = { kary: [] }
        for (const [bkc, chpObj] of Object.entries(inpObj)) {
            keyObj.bkc = bkc
            keyObj.kary.push(bkc)
            for (const [chp, vrsObj] of Object.entries(chpObj)) {
                keyObj.chp = chp
                keyObj.kary.push(chp)
                for (const [vrs, txt] of Object.entries(vrsObj)) {
                    keyObj.vrs = vrs
                    keyObj.txt = txt
                    keyObj.kary.push(vrs)
                    keyObj.kary.push(txt)
                }
            }
        }
        return keyObj;
    },

    ____________Write2vrs_txt_by_inpObj__________: function (jsfname, doc, inpObj, bWrite) {
        var out = {}
        var bib = BibleUti.loadObj_by_fname(jsfname);
        out.m_fname = bib.fname

        if (bib.fsize > 0) {
            console.log("fsize:", bib.fsize)
            for (const [bkc, chpObj] of Object.entries(inpObj)) {
                console.log("chpObj", chpObj)
                for (const [chp, vrsObj] of Object.entries(chpObj)) {
                    console.log("vrsObj", vrsObj)
                    for (const [vrs, txt] of Object.entries(vrsObj)) {
                        var readtxt = bib.obj[bkc][chp][vrs]
                        out.data = { dbcv: `${doc}~${bkc}${chp}:${vrs}`, txt: readtxt }
                        console.log("origtxt", readtxt)

                        if (bWrite) {
                            console.log("newtxt", txt)
                            bib.obj[bkc][chp][vrs] = txt
                            bib.writeback();
                            out.desc += ":Write-success"
                        } else {
                            out.desc += ":Read-success"
                        }
                    }
                }
            }
        }
        return out
    },

    _deplore_usr_proj_dirs: function (usr_proj, base_Dir) {
        //const base_Dir = "bible_study_notes/usrs"
    

        usr_proj.base_Dir = base_Dir
        usr_proj.git_root = `${base_Dir}/${usr_proj.hostname}/${usr_proj.username}/${usr_proj.projname}`
        usr_proj.acct_dir = `${base_Dir}/${usr_proj.hostname}/${usr_proj.username}/${usr_proj.projname}/account`
        usr_proj.dest_myo = `${base_Dir}/${usr_proj.hostname}/${usr_proj.username}/${usr_proj.projname}/account/myoj`
        usr_proj.dest_dat = `${base_Dir}/${usr_proj.hostname}/${usr_proj.username}/${usr_proj.projname}/account/dat`

        
        console.log("deplore: usr_proj=", usr_proj)
    },

    _interpret_repo_url: function (proj_url) {
        //https://github.com/wdingbox/Bible_obj_weid.git
        var reg = new RegExp(/^https\:\/\/github\.com\/(\w+)\/(\w+)(\.git)$/)
        const hostname = "github.com"

        var mat = proj_url.match(/^https\:\/\/github\.com[\/](([^\/]*)[\/]([^\.]*))[\.]git$/)
        if (mat && mat.length === 4) {
            console.log("mat:", mat)
            //return { format: 2, desc: "full_path", full_path: mat[0], user_repo: mat[1], user: mat[2], repo: mat[3] }
            var username = mat[2]
            var projname = mat[3]


            var owner = `_${hostname}_${username}_${projname}`
            return { hostname: hostname, username: username, projname: projname, ownerstr: owner }
        }
        return null
    },
    Parse_post_req_to_inp: function (req, res, cbf) {
        console.log("req.method", req.method)
        console.log("req.url", req.url)

        //req.pipe(res)
        if (req.method === "POST") {
            //req.pipe(res)
            console.log("POST: ----------------", "req.url=", req.url)
            var body = "";
            req.on("data", function (chunk) {
                body += chunk;
                console.log("on post data:", chunk)
            });

            req.on("end", async function () {
                console.log("on post eend:", body)

                var inpObj = null
                try {
                    inpObj = JSON.parse(body)
                    inpObj.out = { data: null, desc: "", err: null, state: { bGitDir: -1, bMyojDir: -1, bDatDir: -1, bEditable: -1, bRepositable: -1 } }
                } catch (err) {
                    inpObj.err = err
                }
                console.log("POST:3 inp=", JSON.stringify(inpObj, null, 4));


                console.log("cbf start ------------------------------")
                await cbf(inpObj)

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(inpObj))
                res.end();
                console.log("finished post req------------------------------")
            });
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end();
            console.log("end of req")
        }
    },
    Parse_req_GET_to_inp: function (req) {
        console.log("\n\n\n\n\n\n\n\n-----req.method (GET?)", req.method)
        console.log("-GET: req.url=", req.url);
        console.log("-req.query", req.query)
        var remoteAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
        console.log("-remoteAddr", remoteAddr)
        console.log("-req.headers", req.headers)
        console.log(req.connection.remoteAddress);


        if (req.method !== "GET") {
            return null
        }
        //console.log("\n\n\n\n---->GET: req.query=", req.query);
        //var q = url.parse(req.url, true).query;
        //console.log("q=", q);
        if ("undefined" === typeof req.query.inp) {
            console.log("q.inp undefined. Maybe unload or api err");
            return null;
        }

        var inpObj = {}
        if (req.query.inp.match(/^LandingTUID\d+\.\d+$/)) { //SignPageLoaded
            inpObj.TUID = req.query.inp
            return inpObj
        } else {
            var d64 = Buffer.from(req.query.inp, 'base64').toString()
            //d64 = Buffer.from(d64, 'base64').toString()
            var sin = decodeURIComponent(d64);//must for client's encodeURIComponent

            var out = { data: null, desc: "", err: null, state: { bGitDir: -1, bMyojDir: -1, bDatDir: -1, bEditable: -1, bRepositable: -1 } }
            try {
                var inpObj = JSON.parse(sin);
                inpObj.out = out
                console.log("GET: inp =", JSON.stringify(inpObj, null, 4));
                //cbf(inpObj, res)
                return inpObj
            } catch (err) {
                out.err = err
                console.log(err)
                return out
            }
        }

    },
    //// BibleUti /////
}



var SvrUsrsBCV = function () {
}
SvrUsrsBCV.prototype.set_rootDir = function (srcpath) {
    this.m_rootDir = srcpath
    this.output = {
        m_olis: [],
        m_totSize: 0,
        m_totFiles: 0,
        m_totPaths: 0
    }
}
SvrUsrsBCV.prototype.get_paths = function (srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        if ("." === file[0]) return false;
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}
SvrUsrsBCV.prototype.get_files = function (srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        if ("." === file[0]) return false;
        return fs.statSync(srcpath + '/' + file).isFile();
    });
}
SvrUsrsBCV.prototype.getFary = function (srcPath, cbf) {
    var fary = this.get_files(srcPath);
    var dary = this.get_paths(srcPath);
    this.output.m_totPaths += dary.length;
    this.output.m_totFiles += fary.length;

    for (var i = 0; i < dary.length; i++) {
        var spath = dary[i];
        //console.log(spath)
        this.getFary(path.join(srcPath, spath), cbf);
    }
    for (var k = 0; k < fary.length; k++) {
        var sfl = fary[k];
        //console.log("path file :", srcPath, sfl)
        //if (doc !== sfl) continue
        var pathfile = path.join(srcPath, sfl);
        var stats = fs.statSync(pathfile);
        this.output.m_totSize += stats.size;

        if (cbf) cbf(srcPath, sfl)
    }
}
SvrUsrsBCV.prototype.decompose = function (docpathfilname) {
    var ret = path.parse(docpathfilname)
    //console.log(ret)
    var ary = ret.dir.split("/")
    var owner = `_${ary[6]}_${ary[7]}_${ary[8]}`
    var compound = { owner: owner, base: ret.base }
    //console.log("compound", compound)
    return compound
}
SvrUsrsBCV.prototype.gen_crossnet_files_of = function (docpathfilname, cbf) {
    //console.log("spec=", spec)
    this.m_compound = this.decompose(docpathfilname)
    var _This = this
    this.getFary(this.m_rootDir, function (spath, sfile) {
        var pathfile = path.join(spath, sfile);
        var cmpd = _This.decompose(pathfile)
        if (cmpd.base === _This.m_compound.base) {
            _This.output.m_olis.push(pathfile);
            console.log("fnd:", pathfile)
            if (cbf) cbf(spath, sfile)
        }
        //var pathfile = path.join(spath, sfile);
        //_This.output.m_olis.push(pathfile);
        //console.log("fnd:", pathfile)
    })
    return this.output
}






function BibleObjBackendService() {
    this.m_watchAccounts = {}
}
BibleObjBackendService.prototype.set_rootDir = function (rootDir) {
    this.m_rootDir = rootDir
}
BibleObjBackendService.prototype.bind_folder_event = function (dir) {
    var _THIS = this
    if (undefined === this.m_watchAccounts[dir]) {
        this.m_watchAccounts[dir] = 0
        fs.watch(dir, { recursive: true }, function (evt, fname) {
            console.log("\n******************* event:", evt, fname)
            console.log("\n")

        })
        return
    }
}
BibleObjBackendService.prototype.get_rootDir = function (doc) {
    this.m_rootDir = rootDir
}
var g_BibleObjBackendService = new BibleObjBackendService()








var BibleObjGituser = function (rootDir) {
    if (!rootDir.match(/\/$/)) rootDir += "/"
    this.m_rootDir = rootDir


    this.m_sRootNode = "bist"
    this.m_sBaseUsrs = `${this.m_sRootNode}/usrs`
    this.m_sBaseTemp = `${this.m_sRootNode}/temp`

    var pathrootdir = rootDir + this.m_sRootNode
    this.m_backendService = g_BibleObjBackendService
    this.m_backendService.set_rootDir(pathrootdir)

    this.m_SvrUsrsBCV = new SvrUsrsBCV()
    this.m_SvrUsrsBCV.set_rootDir(pathrootdir)

}
BibleObjGituser.prototype.genKeyPair = function () {
    if (!this.m_inp || !this.m_inp.TUID) return
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // Note:can encrypt txt len max 501 bytes. 
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });
    console.log("publicKey\n", publicKey)
    console.log("privateKey\n", privateKey)


    var tuid = this.m_inp.TUID
    this.m_prvkeyfname = this.get_proj_tmp_dir(`/${tuid}.otk`)
    fs.writeFileSync(this.m_prvkeyfname, privateKey, "utf8")
    return { publicKey: publicKey, privateKey: privateKey, TUID: tuid }
}
BibleObjGituser.prototype.proj_parse_usr_final_check = function () {
    var inp = this.m_inp;
    inp.usr_proj.git_Usr_Pwd_Url = ""
    if (inp.usr.passcode.trim().length > 0) {
        inp.usr_proj.git_Usr_Pwd_Url = `https://${inp.usr_proj.username}:${inp.usr.passcode}@${inp.usr_proj.hostname}/${inp.usr_proj.username}/${inp.usr_proj.projname}.git`
    }

    inp.usr.repodesc = inp.usr.repodesc.trim().replace(/[\r|\n]/g, ",")//:may distroy cmdline.
}
BibleObjGituser.prototype.proj_parse_usr = function (inp) {
    this.m_inp = inp
    if (!inp || !inp.out) {
        return null
    }
    var _THIS = this

    function _check_pub_testing(inp) {
        if (inp.usr.passcode.length === 0) {
            return inp_usr
        }
        ////SpecialTestRule: repopath must be same as password.
        inp.usr.repopath = inp.usr.repopath.trim()
        const PUB_TEST = "pub_test"
        if (inp.usr_proj.projname.indexOf(PUB_TEST) === 0) {
            if (inp.usr_proj.projname !== inp.usr.passcode) {
                console.log("This is for pub_test only but discord to the rule.")
                return null
            } else {
                console.log("This is for pub_test only: sucessfully pass the rule.")
                inp.usr.passcode = "3edcFDSA"
            }
        }
        return inp
    }


    function _parse_inp_usr(inp) {
        if (!inp.usr) return null

        inp.usr_proj = BibleUti._interpret_repo_url(inp.usr.repopath)
        if (!inp.usr_proj) {
            inp.out.desc = "invalid repospath."
            return null;
        }
        BibleUti._deplore_usr_proj_dirs(inp.usr_proj, _THIS.m_sBaseUsrs)


        if (null === _check_pub_testing(inp)) {
            inp.out.desc = "failed pub test."
            inp.usr_proj = null
            return null
        }


        
        return inp
    }

    this.m_orig_usr_sess = JSON.stringify(inp.usr)


    inp.out.state.ssid_cur = inp.SSID
    if (inp.SSID && inp.SSID.length > 0) {
        var sess = this.session_getin_pub(inp.SSID)
        if (sess) {
            inp.usr = sess.usr
            console.log("\n-sess", sess)
        }
    }
    if ("object" !== typeof inp.usr) {
        inp.usr_proj = null
        return null
    }

    var ret = _parse_inp_usr(inp)
    this.proj_parse_usr_final_check()
    return ret
}
BibleObjGituser.prototype.proj_parse_____________ = function (inp) {
}
BibleObjGituser.prototype.proj_parse_usr_signin = function (inp) {
    this.m_inp = inp
    if (!inp || !inp.out) {
        return null
    }
    var _THIS = this

    function _check_pub_testing(inp) {
        if (inp.usr.passcode.length === 0) {
            return inp_usr
        }
        ////SpecialTestRule: repopath must be same as password.
        inp.usr.repopath = inp.usr.repopath.trim()
        const PUB_TEST = "pub_test"
        if (inp.usr_proj.projname.indexOf(PUB_TEST) === 0) {
            if (inp.usr_proj.projname !== inp.usr.passcode) {
                console.log("This is for pub_test only but discord to the rule.")
                return null
            } else {
                console.log("This is for pub_test only: sucessfully pass the rule.")
                inp.usr.passcode = "3edcFDSA"
            }
        }
        return inp
    }


    function _parse_inp_usr(inp) {
        if (!inp.usr) return null

        inp.usr_proj = BibleUti._interpret_repo_url(inp.usr.repopath)
        if (!inp.usr_proj) {
            inp.out.desc = "invalid repospath."
            return null;
        }
        BibleUti._deplore_usr_proj_dirs(inp.usr_proj, _THIS.m_sBaseUsrs)


        if (null === _check_pub_testing(inp)) {
            inp.out.desc = "failed pub test."
            inp.usr_proj = null
            return null
        }


        
        return inp
    }

    this.m_orig_usr_sess = JSON.stringify(inp.usr)


    inp.out.state.ssid_cur = inp.SSID
    if (inp.SSID && inp.SSID.length > 0) {
        var sess = this.session_getin_pub(inp.SSID)
        if (sess) {
            inp.usr = sess.usr
            console.log("\n-sess", sess)
        }
    }
    if ("object" !== typeof inp.usr) {
        inp.usr_proj = null
        return null
    }

    var ret = _parse_inp_usr(inp)
    this.proj_parse_usr_final_check()
    return ret
}
BibleObjGituser.prototype.session_ssid_compose = function () {
    var sesid = "", owner = ""
    if (this.m_inp.usr && this.m_inp.usr_proj) {
        sesid = "SSID" + (new Date()).getTime()
        owner = this.m_inp.usr_proj.ownerstr
    } else {
        var sid = this.m_inp.SSID
        var pos = ssid.indexOf("_")
        sesid = sid.substr(0, pos)
        owner = sid.substr(pos)
    }
    return { SSID: sesid + owner, sesid: sesid, owner: owner }
}
BibleObjGituser.prototype.session_get_github_owner = function (docfile) {
    //jspfn: ../../../../bist/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var ary = docfile.split("/")
    var idx = ary.indexOf("usrs")
    var hostname = ary[idx + 1]
    var username = ary[idx + 2]
    var reponame = ary[idx + 3]
    var owner = username + "/" + reponame
    return owner
}
BibleObjGituser.prototype.session_git_repodesc_load = function (docfile) {
    var gitfname = this.session_git_repodesc_fname()
    //jspfn: ../../../../bist/usrs/github.com/bsnp21/pub_test01/account/myoj/myNote_json.js
    var pos = docfile.indexOf("/account/")
    var gitpath = docfile.substr(0, pos)
    var pathfile = gitpath + gitfname
    console.log("pathfile", pathfile)
    if (fs.existsSync(pathfile)) {
        var txt = fs.readFileSync(pathfile, "utf-8")
        return { repodesc: txt, pathfile: pathfile }
    }
    return { repodesc: "", pathfile: pathfile }
}
BibleObjGituser.prototype.session_git_repodesc_fname = function () {
    return "/.git/tmp/repodesc"
}
BibleObjGituser.prototype.session_git_repodesc_pathfile = function () {
    var fname = this.session_git_repodesc_fname()
    return this.get_usr_git_dir(fname)
}
BibleObjGituser.prototype.session_destroy = function () {
    var git_old_ssid = this.session_git_repodesc_pathfile()
    BibleUti.execSync_Cmd(`rm -f ${git_old_ssid}`)

    var sidbuf = this.session_ssid_compose()
    var pub_old_ssid = this.get_proj_tmp_dir(`/SSID*${sidbuf.owner}`)
    BibleUti.execSync_Cmd(`rm -f ${pub_old_ssid}`)
}
BibleObjGituser.prototype.session_name_gen = function () {
    this.session_destroy()

    var ssbuf = this.session_ssid_compose()

    var ssfn = this.get_proj_tmp_dir(`/${ssbuf.SSID}`)
    if (ssfn) {
        var txt = this.m_orig_usr_sess
        var dat = Buffer.from(txt).toString("base64")
        console.log("pub session_name_gen:", ssfn, dat)
        fs.writeFile(ssfn, dat, "utf8", function (err) {
            console.log("save err", err)
        })
    }

    var ssfn = this.session_git_repodesc_pathfile()
    if (ssfn) {
        var txt = this.m_inp.usr.repodesc
        console.log("git session_name_gen:", ssfn, txt)
        fs.writeFile(ssfn, txt, "utf8", function (err) {
            console.log("\n\n***save err", err)
        })
    }

    return ssbuf
}
BibleObjGituser.prototype.session_getin_pub = function (ssid) {

    if (undefined === ssid) ssid = this.m_inp.SSID
    console.log("ssid=", ssid)
    var ssfn = this.get_proj_tmp_dir(`/${ssid}`)
    console.log("ssfn=", ssfn)
    if (!fs.existsSync(ssfn)) return console.log("not exist:", ssfn)
    var dat = fs.readFileSync(ssfn, "utf8")
    var txt = Buffer.from(dat, 'base64').toString()
    var obj = {}
    try {
        obj = JSON.parse(txt)
    } catch (err) {
        console.log("json parse err", err)
    }
    console.log("ssfn.usr=", obj)
    return { usr: obj, ssfn: ssfn, str: txt }
}
BibleObjGituser.prototype.session_getfr_jspfname = function (ssid) {

    if (undefined === ssid) ssid = this.m_inp.SSID
    console.log("ssid=", ssid)
    var ssfn = this.get_usr_git_dir(`/.git/tmp/${ssid}.sid`)
    console.log("get session=", ssfn)
    if (!fs.existsSync(ssfn)) return console.log("not exist:", ssfn)
    var dat = fs.readFileSync(ssfn, "utf8")
    var txt = Buffer.from(dat, 'base64').toString()
    var obj = {}
    try {
        obj = JSON.parse(txt)
    } catch (err) {
        console.log("json parse err", err)
    }
    console.log("ssfn.usr=", obj)
    return { usr: obj, ssfn: ssfn, str: txt }
}
BibleObjGituser.prototype.get_proj_tmp_dir = function (subpath) {
    var dir = `${this.m_rootDir}${this.m_sBaseTemp}`
    if (!fs.existsSync(dir)) {
        //fs.mkdirSync(dir, 0777, { recursive: true });
        var password = "lll"
        var command = `
            echo ${password} | sudo -S mkdir -p ${dir}
            echo ${password} | sudo -S chmod 777 ${dir}
            `
        var ret = BibleUti.execSync_Cmd(command)
        console.log(ret)
    }
    return `${dir}${subpath}`
}
BibleObjGituser.prototype.get_usr_acct_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.acct_dir}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.acct_dir}${subpath}`
}
BibleObjGituser.prototype.get_usr_myoj_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.dest_myo}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.dest_myo}${subpath}`
}
BibleObjGituser.prototype.get_usr_dat_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (!subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.dest_dat}`
    }
    return `${this.m_rootDir}${this.m_inp.usr_proj.dest_dat}${subpath}`
}

BibleObjGituser.prototype.get_usr_git_dir = function (subpath) {
    if (!this.m_inp.usr_proj) return ""
    if (undefined === subpath || null === subpath) {
        return `${this.m_rootDir}${this.m_inp.usr_proj.git_root}`
    }
    //if (subpath[0] !== "/") subpath = "/" + subpath
    return `${this.m_rootDir}${this.m_inp.usr_proj.git_root}${subpath}`
}

BibleObjGituser.prototype.get_DocCode_Fname = function (DocCode) {
    if (DocCode[0] != "_") return ""
    var fnam = DocCode.substr(1)
    return `${fnam}_json.js`
}
BibleObjGituser.prototype.get_pfxname = function (DocCode) {
    var inp = this.m_inp
    //var DocCode = inp.par.fnames[0]
    if (!DocCode || !inp.usr_proj) return ""
    var dest_pfname = ""
    switch (DocCode[0]) {
        case "_": //: _myNode, _myTakeaway,
            {
                var fnam = this.get_DocCode_Fname(DocCode)
                if (inp.usr_proj) {
                    dest_pfname = this.get_usr_myoj_dir(`/${fnam}`)
                    ////---:
                    if (!fs.existsSync(dest_pfname)) {
                        var src = `${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate/myoj/${fnam}`
                        if (fs.existsSync(src)) {
                            const { COPYFILE_EXCL } = fs.constants;
                            fs.copyFileSync(src, dest_pfname, COPYFILE_EXCL) //failed if des exists.
                        } else {
                            console.log("* * * [Fatal Err] src not exist:", src)
                        }
                    }
                    if (!fs.existsSync(dest_pfname)) {
                        console.log("\n\n* * * [Fatal Err] missing file cannot be fixed:", dest_pfname)
                    }
                    console.log("\n\n* * * my dest_pfname:", dest_pfname)
                }
            }
            break
        case ".": //-: ./dat/localStorage
            {
                var fnam = DocCode.substr(1)
                if (inp.usr_proj) {
                    dest_pfname = this.get_usr_acct_dir(`${fnam}_json.js`)
                    ////---: 
                    if (!fs.existsSync(dest_pfname)) {
                        var src = `${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate${fnam}_json.js`
                        if (fs.existsSync(src)) {
                            const { COPYFILE_EXCL } = fs.constants;
                            fs.copyFileSync(src, dest_pfname, COPYFILE_EXCL) //failed if des exists.
                        } else {
                            console.log("* * * [Fatal Err] src not exist:", src)
                        }
                    }
                    if (!fs.existsSync(dest_pfname)) {
                        console.log("\n\n* * * [Fatal Err] missing file cannot be fixed:", dest_pfname)
                    }
                    console.log("\n\n* * * my dest_pfname:", dest_pfname)
                }

            }
            break;
        default: //: NIV, CUVS,  
            dest_pfname = `${this.m_rootDir}bible_obj_lib/jsdb/jsBibleObj/${DocCode}.json.js`;
            break;
    }
    return dest_pfname
}

BibleObjGituser.prototype.proj_setup = function () {
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return null
    }
    inp.out.desc = "setup start."
    var stat = this.profile_state()
    if (stat.bEditable === 1) {
        inp.out.desc += "|already setup."
        this.git_pull()
    } else {
        inp.out.state.bNewCloned = 1
        if (stat.bGitDir !== 1) {
            this.git_clone()
            this.git_config_allow_push(false)
            stat = this.profile_state()
        } else {
            this.git_pull()
        }

        if (stat.bMyojDir !== 1) {
            this.cp_template_to_git()
            stat = this.profile_state()
        }
        if (stat.bDatDir !== 1) {

        }

        if (stat.bMyojDir === 1) {
            var accdir = this.get_usr_acct_dir()
            this.chmod_R_(777, accdir)
        }

    }

    this.chmod_R_777_acct()

    var retp = this.profile_state()
    if (retp.bEditable === 1) {
    }

    return inp
}
BibleObjGituser.prototype.proj_destroy = function () {
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        console.log("failed git setup", inp)
        return inp
    }

    //console.log("proj", proj)
    var gitdir = this.get_usr_git_dir()
    var password = "lll" //dev mac
    var proj_destroy = `
    echo ${password} | sudo -S rm -rf ${gitdir}
    `

    if (fs.existsSync(`${gitdir}`)) {
        inp.out.exec_git_cmd_result = BibleUti.execSync_Cmd(proj_destroy).toString()
        inp.out.desc += "destroyed git dir: " + gitdir
    }

    this.session_destroy()

    this.profile_state()
    return inp
}
BibleObjGituser.prototype.profile_state = function (cbf) {
    if (!this.m_inp.out || !this.m_inp.out.state) return console.log("******Fatal Error.")
    var stat = this.m_inp.out.state
    //inp.out.state = { bGitDir: -1, bMyojDir: -1, bEditable: -1, bRepositable: -1 }


    stat.bMyojDir = 1
    var accdir = this.get_usr_myoj_dir()
    if (!fs.existsSync(accdir)) {
        stat.bMyojDir = 0
    }


    stat.bDatDir = 1
    var accdir = this.get_usr_dat_dir()
    if (!fs.existsSync(accdir)) {
        stat.bDatDir = 0
    }

    stat.bGitDir = 1
    var git_config_fname = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(git_config_fname)) {
        stat.bGitDir = 0
        stat.bEditable = 0
        stat.bRepositable = 0
        return stat;
    }

    stat.config = this.load_git_config()

    /////// git status
    stat.bEditable = stat.bGitDir * stat.bMyojDir * stat.bDatDir
    this.m_inp.out.state.bRepositable = 0
    if (this.m_inp.usr.passcode.length > 0) {
        //if clone with password ok, it would ok for pull/push 
        stat.bRepositable = 1
    }

    var accdir = this.get_usr_acct_dir()
    var fstat = {}
    BibleUti.GetFilesAryFromDir(accdir, true, function (fname) {
        var ret = path.parse(fname);
        var ext = ret.ext
        //console.log("ret:",ret)
        var sta = fs.statSync(fname)
        fstat[fname] = sta.size

    });

    stat.fstat = fstat

    if (cbf) cbf()
    return stat
}

BibleObjGituser.prototype.cp_template_to_git = function () {
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
    inp.out.desc += ",clone."

    var gitdir = this.get_usr_myoj_dir()
    if (fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", usr acct already exist: "
        return inp
    }

    //console.log("proj", proj)
    var password = "lll" //dev mac
    var acctDir = this.get_usr_acct_dir()
    var cp_template_cmd = `
    #!/bin/sh
    echo ${password} | sudo -S mkdir -p ${acctDir}
    echo ${password} | sudo -S chmod -R 777 ${acctDir}
    #echo ${password} | sudo -S cp -aR  ${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate  ${acctDir}/
    echo ${password} | sudo -S cp -aR  ${this.m_rootDir}bible_obj_lib/jsdb/UsrDataTemplate/*  ${acctDir}/.
    echo ${password} | sudo -S chmod -R 777 ${acctDir}
    echo " cp_template_cmd end."
    #cd -`

    inp.out.cp_template_cmd = cp_template_cmd
    console.log("cp_template_cmd", cp_template_cmd)
    inp.out.cp_template_cmd_result = BibleUti.execSync_Cmd(cp_template_cmd).toString()

    if (!fs.existsSync(`${gitdir}`)) {
        inp.out.desc += ", cp failed: "
    }
    return inp
}
BibleObjGituser.prototype.chmod_R_777_acct = function () {
    // mode : "777" 
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
    var dir = this.get_usr_acct_dir()
    console.log("perm:", dir)
    if (!fs.existsSync(dir)) {
        return inp
    }
    var password = "lll"
    var change_perm_cmd = `echo ${password} | sudo -S chmod -R 777 ${dir}`

    inp.out.change_perm = BibleUti.execSync_Cmd(change_perm_cmd).toString()

    return inp.out.change_perm
}
BibleObjGituser.prototype.chmod_R_ = function (mode, dir) {
    // mode : "777" 
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed git setup", inp.out.desc)
        return inp
    }
    console.log("perm:", dir)
    if (!fs.existsSync(dir)) {
        return inp
    }
    var password = "lll"
    var change_perm_cmd = `echo ${password} | sudo -S chmod -R ${mode} ${dir}`

    inp.out.change_perm = BibleUti.execSync_Cmd(change_perm_cmd).toString()

    return inp.out.change_perm
}

BibleObjGituser.prototype.load_git_config = function () {
    var git_config_fname = this.get_usr_git_dir("/.git/config")
    //if (!this.m_git_config_old || !this.m_git_config_new) {
    var olds, news, txt = fs.readFileSync(git_config_fname, "utf8")
    var ipos1 = txt.indexOf(this.m_inp.usr.repopath)
    var ipos2 = txt.indexOf(this.m_inp.usr_proj.git_Usr_Pwd_Url)

    console.log("ipos1:", ipos1, this.m_inp.usr.repopath)
    console.log("ipos2:", ipos2, this.m_inp.usr_proj.git_Usr_Pwd_Url)

    if (ipos1 > 0) {
        olds = txt
        news = txt.replace(this.m_inp.usr.repopath, this.m_inp.usr_proj.git_Usr_Pwd_Url)
    }
    if (ipos2 > 0) {
        news = txt
        olds = txt.replace(this.m_inp.usr_proj.git_Usr_Pwd_Url, this.m_inp.usr.repopath)

        console.log("initial git_config_fname not normal:", txt)
    }
    if ((ipos1 * ipos2) < 0) {
        this.m_git_config_old = olds
        this.m_git_config_new = news

        //var txt = fs.readFileSync(git_config_fname, "utf8")
        var pos0 = txt.indexOf("[remote \"origin\"]")
        var pos1 = txt.indexOf("\n\tfetch = +refs");//("[branch \"master\"]")
        this.m_inp.out.state.config = txt.substring(pos0 + 19, pos1)
    }
    //}
    return this.m_inp.out.state.config
}


BibleObjGituser.prototype.git_config_allow_push = function (bAllowPush) {
    { /****.git/config
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
    } /////////

    if (!this.m_inp.usr.repopath) return
    if (!this.m_inp.usr_proj) return
    if (!this.m_inp.usr_proj.git_Usr_Pwd_Url) return

    var git_config_fname = this.get_usr_git_dir("/.git/config")
    if (!fs.existsSync(git_config_fname)) {
        console.log(".git/config not exist:", git_config_fname)
        return
    }



    if (!this.m_git_config_old || !this.m_git_config_new) {
        this.load_git_config()
    }

    if (bAllowPush) {
        fs.writeFileSync(git_config_fname, this.m_git_config_new, "utf8")
        console.log("bAllowPush=1:url =", this.m_inp.usr_proj.git_Usr_Pwd_Url)
    } else {
        fs.writeFileSync(git_config_fname, this.m_git_config_old, "utf8")
        console.log("bAllowPush=0:url =", this.m_inp.usr.repopath)
    }
}

BibleObjGituser.prototype.git_clone = function () {
    var _THIS = this
    var inp = this.m_inp
    var proj = inp.usr_proj;
    if (!proj) {
        inp.out.desc += ", failed inp.usr parse"
        console.log("failed-git-parse", inp.out.desc)
        return inp
    }

    inp.out.git_clone_res = { desc: "git-clone", bExist: false }
    var gitdir = this.get_usr_git_dir("/.git")
    if (fs.existsSync(gitdir)) {
        inp.out.git_clone_res.desc += "|already done."
        inp.out.git_clone_res.bExist = true
        return inp
    }

    var clone_https = inp.usr_proj.git_Usr_Pwd_Url
    if (clone_https.length === 0) {
        clone_https = inp.usr.repopath
    }
    if (clone_https.length === 0) {
        inp.out.git_clone_res.desc += ",no url."
        return inp
    }
    console.log("to clone: ", clone_https)

    //console.log("proj", proj)
    var password = "lll" //dev mac
    var git_clone_cmd = `
    #!/bin/sh
    cd ${this.m_rootDir}
    echo ${password} | sudo -S GIT_TERMINAL_PROMPT=0 git clone  ${clone_https}  ${proj.git_root}
    if [ -f "${proj.git_root}/.git/config" ]; then
        echo "${proj.git_root}/.git/config exists."
        echo ${password} | sudo -S chmod  777 ${proj.git_root}/.git/config
        echo ${password} | sudo -S mkdir -p ${proj.git_root}/.git/tmp
        echo ${password} | sudo -S chmod  777 ${proj.git_root}/.git/tmp
    else 
        echo "${proj.git_root}/.git/config does not exist."
    fi
    `
    console.log("git_clone_cmd...")
    inp.out.git_clone_res.git_clone_cmd = git_clone_cmd
    var ret = BibleUti.execSync_Cmd(git_clone_cmd).toString()
    console.log("ret", ret)
    return inp
}
BibleObjGituser.prototype.git_status = async function (_sb) {
    var inp = this.m_inp
    if (!inp.out.state) return console.log("*** Fatal Error: inp.out.state = null")

    if (undefined === _sb) _sb = ""
    var gitdir = this.get_usr_git_dir("/.git/config")
    if (fs.existsSync(gitdir)) {
        /////// git status
        var git_status_cmd = `
        cd ${this.get_usr_git_dir()}
        git status ${_sb}
        #git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.`

        inp.out.git_status_res = BibleUti.exec_Cmd(git_status_cmd).toString()
    }
}

BibleObjGituser.prototype.git_add_commit_push_Sync = function (msg) {
    var _THIS = this
    var inp = this.m_inp
    var gitdir = this.get_usr_git_dir()
    if (!fs.existsSync(gitdir)) {
        return console.log("gitdir not exists.");
    }

    password = "lll" //dev mac
    var command = `
    #!/bin/bash
    set -x #echo on
    echo '=>cd ${gitdir}'
    cd  ${gitdir}
    echo '=>git status'
    echo ${password} | sudo -S git status
    echo '=>git diff'
    echo ${password} | sudo -S git diff --ignore-space-at-eol -b -w --ignore-blank-lines --color-words=.
    echo '=>git add *'
    echo ${password} | sudo -S git add *
    echo '=>git commit'
    echo ${password} | sudo -S git commit -m "Sync:${msg}. repodesc:${inp.usr.repodesc}"
    echo '=>git push'
    echo ${password} | sudo -S GIT_TERMINAL_PROMPT=0 git push
    echo '=>git status'
    echo ${password} | sudo -S git status
    echo '=>git status -sb'
    echo ${password} | sudo -S git status -sb
    `
    console.log('exec_command:', command)
    console.log('exec_command start:')

    try {
        //e.g. command = "ls"
        _THIS.git_config_allow_push(true)
        exec(command, (err, stdout, stderr) => {
            console.log('\n-exec_Cmd errorr:')
            console.log(err)
            console.log('\n-exec_Cmd stderr:',)
            console.log(stderr)
            console.log('\n-exec_Cmd stdout:')
            console.log(stdout)
            console.log('\n-exec_Cmd end.')
            _THIS.git_config_allow_push(false)
        });
    } catch (err) {
        console.log(err)
    }

    console.log('exec_command END.')
    setTimeout(function () {
        console.log('exec_command ENDED Mark.', gitdir)
    }, 10000)
}

BibleObjGituser.prototype.git_pull = function (cbf) {
    this.git_config_allow_push(true)
    this.m_inp.out.git_pull_res = this.execSync_cmd_git("GIT_TERMINAL_PROMPT=0 git pull")
    this.git_config_allow_push(false)
    //var mat = this.m_inp.out.git_pull_res.stderr.match(/(fatal)|(fail)|(error)/g)
    return this.m_inp.out.git_pull_res
}

BibleObjGituser.prototype.git_push = function () {
    this.git_config_allow_push(true)
    this.m_inp.out.git_push_res = this.execSync_cmd_git("GIT_TERMINAL_PROMPT=0 git push")
    this.git_config_allow_push(false)
    return this.m_inp.out.git_push_res
}

BibleObjGituser.prototype.cmd_exec = async function () {
    var _THIS = this
    var inp = this.m_inp

    if (!inp.par) {
        inp.out.desc = "no par"
        return
    }

    console.log("inp.par.cmdline: ", inp.par.cmdline)
    if (!inp.par.cmdline) {
        inp.out.desc = "no inp.par.cmdline"
        return
    }

    var res = await this.exec_cmd_git(inp.par.cmdline)

    return res
}
BibleObjGituser.prototype.exec_cmd_git = async function (gitcmd) {
    var _THIS = this
    var inp = this.m_inp

    //if (!inp.par) {
    //    inp.out.desc = "no par"
    //    return null
    //}

    //console.log("inp.par.cmdline: ", inp.par.cmdline)
    //if (!inp.par.cmdline) {
    //    inp.out.desc = "no inp.par.cmdline"
    //    return null
    //}

    if (!fs.existsSync(this.get_usr_git_dir())) {
        inp.out.desc = "no git dir"
        return null
    }


    //console.log("proj", proj)
    var password = "lll" //dev mac
    var scmd = `
    #!/bin/sh
    cd ${this.get_usr_git_dir()}
    echo ${password} | sudo -S ${gitcmd}
    `
    console.log("\n----git_cmd start:>", scmd)
    var res = await BibleUti.exec_Cmd(scmd)
    console.log("\n----git_cmd end.")

    return res
}
BibleObjGituser.prototype.execSync_cmd_git = async function (gitcmd) {
    var _THIS = this
    var inp = this.m_inp

    //if (!inp.par) {
    //    inp.out.desc = "no par"
    //    return null
    //}

    //console.log("inp.par.cmdline: ", inp.par.cmdline)
    //if (!inp.par.cmdline) {
    //    inp.out.desc = "no inp.par.cmdline"
    //    return null
    //}

    if (!fs.existsSync(this.get_usr_git_dir())) {
        inp.out.desc = "no git dir"
        return null
    }


    //console.log("proj", proj)
    var password = "lll" //dev mac
    var scmd = `
    #!/bin/sh
    cd ${this.get_usr_git_dir()}
    echo ${password} | sudo -S ${gitcmd}
    `
    console.log("\n----git_cmd start:>", scmd)
    var res = BibleUti.execSync_Cmd(scmd)
    console.log("\n----git_cmd end.")

    return res
}



module.exports = {
    BibleUti: BibleUti,
    BibleObjGituser: BibleObjGituser
}

