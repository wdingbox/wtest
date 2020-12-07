



var MyStorage = {
    init: function () {
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            localStorage.setItem("test", [1, 2])
            var ar = localStorage.getItem("test")
            console.log("Storage test: ", ar)
        } else {
            // Sorry! No Web Storage support..
            alert("Sorry, your browser does not support Web Storage...")
        }


        //auto set afer load for input
        setTimeout(() => {
            ["acctname", "f_path"].forEach(function (id, i) {
                var val = localStorage.getItem(id)
                $("#" + id).val(val)
                if( undefined !== typeof Jsonpster){
                    Jsonpster.inp.usr[id] = val
                }
            })
        }, 3000)

    },
    clear: function () {
        this.setRevList("")
        this.setMarkHistory("")
        this.setFontSize("")
    },
    setRevList: function (arr) {
        localStorage.setItem("RevList", arr)
    },
    getRevList: function () {
        var ar = localStorage.getItem("RevList");
        if (!ar || ar.length === 0) {
            ar = ["NIV"]
        } else {
            ar = ar.split(",")
        }
        return ar
    },
    setMarkHistory: function (obj) {
        if (!obj) {
            localStorage.setItem("MarkHistory", "")
        } else {
            localStorage.setItem("MarkHistory", JSON.stringify(obj))
        }
    },
    getMarkHistory: function () {
        var ar = localStorage.getItem("MarkHistory")
        if (!ar || ar.length === 0) {
            ar = {}
        } else {
            ar = JSON.parse(ar)
        }
        return ar
    },
    setFontSize: function (v) {
        if (parseInt(v) < 6) v = 6
        localStorage.setItem("FontSize", v)
    },
    getFontSize: function () {
        var v = parseInt(localStorage.getItem("FontSize"));
        if (!v || !Number.isInteger(v) || v.length === 0) return 16
        return (v < 6) ? 6 : v
    },
    setAcctName: function (v) {
        v = v.trim()
        if (v.length === 0) v = "pub"
        localStorage.setItem("acctname", v)
    },
    getAcctName: function () {
        var v = localStorage.getItem("acctname");
        if (!v || v.length === 0) v = "pub";
        return v;
    },
    setUserName: function (v) {
        v = v.trim()
        if (v.length === 0) v = "peter"
        localStorage.setItem("f_path", v)
    },
    getUserName: function () {
        var v = localStorage.getItem("f_path");
        if (!v || v.length === 0) v = "John";
        return v;
    },
}








function PopupMenu_BcvTag() {
    this.m_id = "#divPopupMenu_BcvTag"
}
PopupMenu_BcvTag.prototype.init_links = function () {
    var Ext_Link_Menu = {
        HiliEx: function (_this) {
            $(".hiliExt").removeClass("hiliExt")
            $(_this).parent().addClass("hiliExt")

            var sbcv = $(".bcvTag.bcvMark").text();
            var ret = Uti.vcv_parser(sbcv);
            if (!ret) return alert("ERR: bcvid=" + sbcv)
            var url = $(_this).attr("ref");
            ret.url = url;
            ret.set_href = function (str) {
                var file = this.url + str
                console.log(file);
                $(_this).attr("href", file);
            }
            ret.isNT = function () {
                return CNST.isNT(this.vol)
            }
            return ret
        },
        setup_links: function () {
            $("#blb").click(function () {
                var ret = Ext_Link_Menu.HiliEx(this)

                var blbvol = CNST.BlueLetterBibleCode[ret.vol];
                ret.set_href(blbvol + "/" + ret.chp + "/" + ret.vrs);
            });
            $("#qbible_com").click(function () {
                var ret = Ext_Link_Menu.HiliEx(this)

                //greek-new-testament/1-Thessalonians/1.html#1

                var ont = "hebrew-old-testament"
                if (ret.isNT()) {
                    ont = "greek-new-testament"
                }

                var bkc = ret.vol;
                var bkname = CNST.BiBookName[ret.vol][0];
                bkname = bkname.replace(/_/g, "-")
                ret.set_href(`${ont}/${bkname}/${ret.chp}.html#${ret.vrs}`);

            });
            $("#h_g").click(function () {
                var ret = Ext_Link_Menu.HiliEx(this)

                var volm = ret._vol;
                var bkidx = CNST.BookID2IdxCode[volm];
                ret.set_href(bkidx[0] + volm + "_" + ret.chp3 + ".htm#" + ret.vrs);

            });
            $("#gtw").click(function () {
                var ret = Ext_Link_Menu.HiliEx(this)

                var vol2 = CNST.BiBookName[ret.vol][0];
                ret.set_href(vol2 + ret.chp + ":" + ret.vrs + "&version=NIV;CUV;KJV;NKJV;ESV");
            });
            $("#studylight").click(function () {
                var ret = Ext_Link_Menu.HiliEx(this)

                //https://www.studylight.org/commentary/john/1-1.html
                var vol2 = CNST.BibVolName_Studylight([ret.vol]);
                ret.set_href(vol2 + "/" + ret.chp + "-" + ret.vrs + ".html");
            });

            $("#ccel_org").click(function () {
                var ret = Ext_Link_Menu.HiliEx(this)

                //http://www.ccel.org/study/1_Samuel%202:11-4:18 
                var bok = CNST.BibVolName_ccel([ret.vol]);
                ret.set_href(bok + " " + ret.chp + ":" + ret.vrs + ".html");
            });

            $("#crossReference").click(function () {
                var ret = Ext_Link_Menu.HiliEx(this)

                //http://www.ccel.org/study/1_Samuel%202:11-4:18 
                var bok = CNST.BlueLetterBibleCode[ret.vol];
                ret.set_href(bok + " " + ret.chp + ":" + ret.vrs + "");
            });
        }
    }
    Ext_Link_Menu.setup_links()
}
PopupMenu_BcvTag.prototype.init = function () {
    this.init_links()

    $(this.m_id).draggable()
    $(this.m_id).bind("click", function () {
        //$(this.m_id).hide()
    }).hide()
}
PopupMenu_BcvTag.prototype.hide = function () {
    if ($(this.m_id)[0].display === "none") {
        console.log("already hidden")
    } else {
        $(this.m_id).hide()
    }
}



function PopupMenu_RevTag() {
    this.m_id = "#divPopupMenu_RevTag"
    this.m_par = null
}
PopupMenu_RevTag.prototype.popup = function (par) {
    this.m_par = par

    $(this.m_id).css('top', par.m_y);

    //
    if (par.m_alreadyHili) {
        $(this.m_id).slideToggle();
    } else {
        $(this.m_id).show()
            .find("caption").text(par.m_bcv);
    }
}
PopupMenu_RevTag.prototype.hide = function () {
    $(this.m_id).hide()
}
PopupMenu_RevTag.prototype.init = function () {

    $(this.m_id).draggable()
    $(this.m_id).bind("click", function () {
        //$(this.m_id).hide()
    }).hide()

    var _THIS = this

    $("#RevTag_Edit").bind("click", function () {
        var tx = $("#" + _THIS.m_par.m_txuid).attr("contenteditable", "true").text()
        if (tx.length === 0) $("#" + _THIS.m_par.m_txuid).text("---")
        _THIS.hide()
    })

    $("#RevTag_Save").bind("click", function () {
        var tx = $("#" + _THIS.m_par.m_txuid).attr("contenteditable", null).text()
        if (tx.length === 0) $("#" + _THIS.m_par.m_txuid).text("---")
        console.log(tx)
        _THIS.hide()
    })
}










//Showup Bookcode - Chapter:Verses
function ShowupBCV() {
    this.m_showupBknID = "#bk_name"
    this.m_showupChpId = "#chp_num"
    this.m_showupVrsId = "#vrs_num"
    this.m_minus_ChpId = "#minus_ChpVal"//:--

    this.init()
}
ShowupBCV.prototype.init = function () {
    ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function Showup_CV(val_id) {
        this.m_showupValID = val_id
    }
    Showup_CV.prototype.init = function (val_id) {
        this.m_showupValID = val_id
    }
    Showup_CV.prototype.get_showupVal = function () {
        var str = $(this.m_showupValID).text()
        var ival = parseInt(str)
        if (!Number.isInteger(ival)) {
            ival = 0;
        }
        return ival
    }
    Showup_CV.prototype.set_showupVal = function (i) {
        $(this.m_showupValID).text(i)
    }
    Showup_CV.prototype.append_showupVal = function (i) {
        var _THIS = this
        var icap = _THIS.get_showupVal()
        var iupdateCap = icap * 10 + parseInt(i);
        _THIS.set_showupVal(iupdateCap);
    }
    Showup_CV.prototype.detchback = function () {
        var sval = "" + this.get_showupVal()
        var s = sval.substr(0, sval.length - 1)
        this.set_showupVal(s);
        return s
    }
    ////--------------------------------------------
    ////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function Showup_Bk(val_id) {
        this.m_showupBkiID = val_id
    }
    Showup_Bk.prototype.init = function (val_id) {
        this.m_showupBkiID = val_id
    }
    Showup_Bk.prototype.set_showupBkc = function (bkc) {
        var Bkname = CNST.BibVolNameEngChn(bkc)
        $(this.m_showupBkiID).text(Bkname).attr("volcode", bkc);
    }
    Showup_Bk.prototype.get_showupBkc = function () {
        return $(this.m_showupBkiID).attr("volcode");
    }
    Showup_Bk.prototype.get_showup_bkn_info = function (b) {
        var booknamecode = this.get_showupBkc()
        var iMaxChap = -1
        if (booknamecode && booknamecode.length > 0) {
            iMaxChap = Object.keys(_Max_struct[booknamecode]).length;
        }
        return { bkn: booknamecode, maxChp: iMaxChap }
    }
    ////--------------------------------------------

    this.m_Bki = new Showup_Bk(this.m_showupBknID)
    this.m_Chp = new Showup_CV(this.m_showupChpId)
    this.m_Vrs = new Showup_CV(this.m_showupVrsId)
}

ShowupBCV.prototype.update_showup = function (bcv) {
    var par = Uti.vcv_parser(bcv)
    this.m_Bki.set_showupBkc(par.vol)
    this.m_Chp.set_showupVal(par.chp)
    this.m_Vrs.set_showupVal(par.vrs)
}
ShowupBCV.prototype.get_selected_vcv_parm = function () {
    var vol = this.m_Bki.get_showupBkc()
    var chp = this.m_Chp.get_showupVal()
    var vrs = this.m_Vrs.get_showupVal()
    var ob = { vol: vol, chp: chp, vrs: vrs }
    return ob;
};
ShowupBCV.prototype.get_selected_bc_bibOj = function () {
    var parm = this.get_selected_vcv_parm()

    var ob = {}
    ob[parm.vol] = {}
    ob[parm.vol][parm.chp] = {}
    if (parm.vrs) {
        //ob[parm.vol][parm.chp][parm.vrs] = parm.vrs
    }
    return ob;
};


ShowupBCV.prototype.goNextChp = function (i) {
    var maxChp = this.m_Bki.get_showup_bkn_info().maxChp
    if (maxChp < 1) return

    var chp = i + this.m_Chp.get_showupVal() //showup chp

    if (chp > maxChp) chp = 1
    if (chp <= 0) chp = maxChp

    this.m_Chp.set_showupVal(chp) //showup chp
}


ShowupBCV.prototype.onclick_Vrs2_plus_minus = function (cbfLoadBible) {
    var _This = this

    $(this.m_Vrs.m_showupValID).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var maxChp = _This.m_Bki.get_showup_bkn_info().maxChp
        if (maxChp < 1) return

        var vrs = _This.m_Vrs.get_showupVal()
        if (0 === vrs) {
            _This.goNextChp(1)
            cbfLoadBible(1)
        } else {
            _This.m_Vrs.detchback()
            cbfLoadBible(1)
        }
    });


    $(this.m_minus_ChpId).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var maxChp = _This.m_Bki.get_showup_bkn_info().maxChp
        if (maxChp < 1) return

        _This.m_Vrs.set_showupVal("")
        _This.goNextChp(-1)
        cbfLoadBible(1)
    });
}
ShowupBCV.prototype.onclick_Chp = function (cbfLoadBible) {
    var _This = this
    $(this.m_Chp.m_showupValID).bind("click", function (evt) {
        evt.stopImmediatePropagation();

        var vrs = "" + _This.m_Chp.get_showupVal()
        if (vrs.length > 0) {
            _This.m_Chp.detchback()
            _This.m_Vrs.set_showupVal("")
            cbfLoadBible(1)
        } else {
            _This.m_Vrs.set_showupVal("")
            cbfLoadBible(0)
        }

        //_This.m_Chp.set_showupVal("")
        //_This.init_Chp_digiKeys_by_vol()

        //_This.m_nextDigiMenu.disable_all_digiKey(true)

        //cbfLoadBible()
    });
}
////////////////-------------------////////////////////////////////









function SingleKeyInputPanel(tbody) {
    if (!tbody) {
        tbody = "#SingleKeywordsBody"
    }
    this.m_tbody = tbody

}
SingleKeyInputPanel.prototype.rm_hili = function () {
    $(".vin").removeClass("hili");
}
SingleKeyInputPanel.prototype.gen_panel = function (par) {
    var ks = this.get_cha_arr_after_str("", _Max_struct);

    var s = "<tr id='vitr'>";
    var _This = this;
    $.each(ks, function (i, c) {
        var volarr = _This.Get_Vol_Arr_from_KeyChar(c, _Max_struct);
        var vintype = (["1", "2", "3"].indexOf(c) >= 0) ? "vinNum" : "vinCap"
        var ssb = "<sub>" + volarr.length + "</sub>";
        if (volarr.length === 1) ssb = "";
        c = c + ssb;
        s += `<th><div class='vin ${vintype}'>${c}</div></th>`;
        if (9 == i) s += "</tr><tr>";
    });
    s += "</tr>";

    $(this.m_tbody).html(s).find(".vin").bind("click", function () {
        var alreadyHili = $(this)[0].classList.contains('hili')
        console.log("alreadyHili", alreadyHili)

        $(".vin").removeClass("hili");
        $(this).addClass("hili");
        //

        var ch = $(this).text();
        var volarr = _This.Get_Vol_Arr_from_KeyChar(ch[0], _Max_struct);

        if (!par) return console.error("par is null")
        setTimeout(function () {
            if (par && par.onClickItm) par.onClickItm(ch, volarr, alreadyHili)
        }, 100)
    });
    return ks;
}
SingleKeyInputPanel.prototype.get_cha_arr_after_str = function (str, BibleObjStruct) {
    if (!BibleObjStruct) return [];
    var ret = {};
    Object.keys(BibleObjStruct).forEach(function (v) {
        if (v.indexOf(str) == 0) {
            var idx = str.length;
            if (v.length > idx) {
                var ch = v[idx];
                if (!ret[ch]) ret[ch] = 0;
                ret[ch]++;
            }
        }
    });
    var ks = Object.keys(ret).sort();

    //put numbers at tail.
    for (var i = 0; i < 3; i++) {
        var num = ks.shift()
        ks.push(num)
    }

    return ks;
}
SingleKeyInputPanel.prototype.Get_Vol_Arr_from_KeyChar = function (ch) {
    var arr = [];
    var BkAry = Object.keys(_Max_struct)
    if (ch.length != 1) return BkAry
    BkAry.forEach(function (vol) {
        var keycod = vol[0]
        if (!Number.isInteger(parseInt(ch)) && Number.isInteger(parseInt(keycod))) {
            keycod = vol[1] //:J, 1Jn
        }

        if (ch === keycod) {
            arr.push(vol);
        }
    });
    return arr;
}





function SingleKeyOutputBooksTable(tid) {
    this.m_id = tid; //"#Tab_OutputBooksList"
    this.m_chp_vrs_clsnam = "chapvrsnum"
    this.cbf_onClickItm = null
}
SingleKeyOutputBooksTable.prototype.init = function (par) {
    var _THIS = this
    $(this.m_id).bind("click", function () {
        //$(_THIS.m_id).hide()
    }).hide().draggable();
    this.cbf_onClickItm = par.onClickItm
}
SingleKeyOutputBooksTable.prototype.get_selary = function () {
    var vol_arr = []
    $(".v3.hili").each(function () {
        var svol = $(this).text();
        vol_arr.push(svol);
    });
    return vol_arr
}
SingleKeyOutputBooksTable.prototype.Gen_Vol_trs = function (vol_arr) {
    var trarr = [];
    vol_arr.forEach(function (vol, i) {
        var hili = "";//(0 === i) ? "hili" : ""
        var cls = `class='v3 ${hili} ${CNST.BibVol_OTorNT(vol)}' vol='${vol}'`;
        //<td align='right'>"+BiBookName[vol][0]+"</td>
        var iMaxChap = Object.keys(_Max_struct[vol]).length;
        trarr.push(`<tr ${cls}><td title=' ${CNST.BibVolNameEngChn(vol)}'>${vol}</td><td>${CNST.BibVolNameEngChn(vol)}</td><td>${iMaxChap}</td></tr>`);
    });
    return trarr.join("");
}


SingleKeyOutputBooksTable.prototype.Gen_BookList_Table = function (cap, vol_arr, alreadyhili) {
    var _THIS = this
    var tid = this.m_id + " tbody"
    var bcr = $("#menuContainer")[0].getBoundingClientRect();
    var h2 = $("#SingleKeywordsBody").height();

    var trs = this.Gen_Vol_trs(vol_arr);

    $(tid).html(trs).find(".v3").bind("click", function () {
        //$(".v3.hili").removeClass("hili");
        //$(this).addClass("hili");

        var vol = $(this).attr("vol");
        _THIS.cbf_onClickItm(vol)
        $(_THIS.m_id).hide()
    });

    if (alreadyhili) {
        $(this.m_id).css('top', bcr.y + h2).css('left', bcr.x).toggle();//.slideToggle()
    } else {
        $(this.m_id).css('top', bcr.y + h2).css('left', bcr.x).show()
    }

    if (vol_arr.length === -1) {//auto setup problematic
        setTimeout(() => {
            $(tid).find(".v3").each(function () {
                $(this).find("td").addClass("hili");
                $(this).trigger("click")
            })
        }, 2000)
        return
    }
};





















///var d1 = new DigitNumberInputPanel("digiChp", "#DigitOfChapt", "chp_num", showup);
function DigitNumberInputZone() {
    this.m_showup = null
}
DigitNumberInputZone.prototype.init_digi = function (shwup) {
    this.m_showup = shwup
    ///////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function DigitNumberSet(parent) {
        this.m_tbody = null
        this.m_parent = parent
    }
    DigitNumberSet.prototype.Gen_Digits = function (tbody, clsname) {
        if (!tbody) {
            tbody = "#DigitOfChapt"
        }
        this.m_tbody = tbody
        this.m_classname = clsname

        function _td(num, clsname) {
            var s = `<th><button class='digit  ${clsname}' title='${clsname}'>${num}</button></th>`;
            return s;
        }
        function gen_trs(clsname) {
            var s = "", num = 1;
            s += `<tr>`;
            for (var i = 1; i < 10; i++) {
                s += _td(num++, clsname);
            };
            s += _td(0, clsname) + `</tr>`;
            return s;
        };

        var s = gen_trs(this.m_classname);
        $(this.m_tbody).html(s)
        this.disable_all_digiKey(true);
        return
    }
    DigitNumberSet.prototype.disable_all_digiKey = function (b) {
        $(this.m_tbody).find(".digit").attr("disabled", b);
    }
    DigitNumberSet.prototype.disable_zero_only = function () {
        this.disable_all_digiKey(false)
        $(this.m_tbody).find(".digit:contains('0')").attr("disabled", true);
    }
    ///////====================================================================

    this.m_Chp = new DigitNumberSet(this)
    this.m_Vrs = new DigitNumberSet(this)

    this.m_Chp.on_Click_Digit = function (cbfLoadBible) {
        this.m_cbfLoadBible = cbfLoadBible
        var _THIS = this

        $(this.m_tbody).find("." + _THIS.m_classname).bind("click", function () {
            var dici = $(this).text();
            _THIS.m_parent.m_showup.m_Chp.append_showupVal(dici)

            _THIS.m_parent.init_Chp_digiKeys_by_vol()
            _THIS.m_parent.init_Vrs_digiKeys_by_vol()

            $(".hili_digi_key").removeClass("hili_digi_key")
            $(this).addClass("hili_digi_key")

            cbfLoadBible()
        });
    }
    this.m_Chp._enable_key = function (vol, chp) {
        $(this.m_tbody).find(".digit").each(function () {
            var dici = parseInt($(this).text());
            var schp = (chp * 10 + dici)
            if (undefined === _Max_struct[vol][schp]) {
                $(this).attr("disabled", true);
            } else {
                $(this).attr("disabled", false);
            }
        });
    }
    this.m_Vrs.on_Click_Digit = function (cbfLoadBible) {
        this.m_cbfLoadBible = cbfLoadBible
        var _THIS = this

        $(this.m_tbody).find("." + _THIS.m_classname).bind("click", function () {
            var dici = $(this).text();
            _THIS.m_parent.m_showup.m_Vrs.append_showupVal(dici)

            _THIS.m_parent.init_Vrs_digiKeys_by_vol()

            $(".hili_digi_key").removeClass("hili_digi_key")
            $(this).addClass("hili_digi_key")

            cbfLoadBible()
        });
    }
    this.m_Vrs._enable_key = function (vol, chp, vrs) {
        function _enable_key(vol, chp, vrs, dici) {
            var vrs = (vrs * 10 + dici)
            return (undefined === _Max_struct[vol][chp][vrs])
        }
        $(this.m_tbody).find(".digit").each(function () {
            var dici = parseInt($(this).text());
            var bret = _enable_key(vol, chp, vrs, dici)
            $(this).attr("disabled", bret);
        });
    }
}
DigitNumberInputZone.prototype.init_Chp_digiKeys_by_vol = function () {
    var vol = this.m_showup.m_Bki.get_showupBkc();// $(this.m_volID).attr("volcode")
    var chp = this.m_showup.m_Chp.get_showupVal();  //()
    var _THIS = this

    if (!vol) {
        this.m_Chp.disable_all_digiKey(true)
        return
    }
    var iMaxChap = Object.keys(_Max_struct[vol]).length;
    if (0 === chp) {
        if (1 === iMaxChap) {
            this.m_showup.m_Chp.append_showupVal(1)
            if (this.m_Chp.m_cbfLoadBible) this.m_Chp.m_cbfLoadBible()
        } else if (iMaxChap >= 9) {
            this.m_Chp.disable_zero_only()
        } else {
            this.m_Chp._enable_key(vol, chp)
        }
    } else {
        this.m_Chp._enable_key(vol, chp)
    }
    return iMaxChap
}
DigitNumberInputZone.prototype.init_Vrs_digiKeys_by_vol = function () {
    var vol = this.m_showup.m_Bki.get_showupBkc(); // $(this.m_volID).attr("volcode")
    var chp = this.m_showup.m_Chp.get_showupVal(); //
    var vrs = this.m_showup.m_Vrs.get_showupVal();//


    if (!vol || !chp) {
        this.m_Vrs.disable_all_digiKey(true)
        return
    }
    var iMaxVrs = Object.keys(_Max_struct[vol][chp]).length;
    if (0 === vrs) {
        if (iMaxVrs >= 9) {
            this.m_Vrs.disable_zero_only()
        } else {
            this.m_Vrs._enable_key(vol, chp, vrs)
        }
    } else {
        this.m_Vrs._enable_key(vol, chp, vrs)
    }
}
////////////////




























function Tab_Cat() {
    this.m_tabid = "#Tab_CatagryOfBooks"
}
Tab_Cat.prototype.rm_hili = function () {
    $(".cat").removeClass("hili");
}
Tab_Cat.prototype.Gen_Cat_Table = function (par) {

    $(this.m_tabid + " caption").click(function () {
        $(".cat").removeClass("hili");
        $(".v3").remove();

    });

    var _This = this;
    var s = "";
    $.each(Object.keys(CNST.Cat2VolArr), function (i, v) {
        s += "<tr><td class='cat'>" + v + "</td></tr>";
    });
    $(this.m_tabid + " tbody").html(s).find(".cat").bind("click", function () {
        var alreadyHili = $(this)[0].classList.contains('hili')

        $(".cat").removeClass("hili");
        var scat = $(this).addClass("hili").text();

        var vol_arr = CNST.Cat2VolArr[scat];

        if (par && par.onClickItm) par.onClickItm(scat, vol_arr, alreadyHili)
    });
}














function RevisionsOfBibleListTable(tid) {
    this.m_tbid = tid // "#Tab_NamesOfBible"
    this.m_onClickItm2Select = null
    this.m_selectedItems_ary = MyStorage.getRevList();//["CUVS"] //default
}
RevisionsOfBibleListTable.prototype.Init_NB_Table = function (parm) {
    this.m_onClickItm2Select = parm.onClickItm
    var bknArr = Object.keys(CNST.FnameOfBibleObj);
    this.Gen_Table(bknArr)
    var _THIS = this
    $(this.m_tbid + " caption button").bind("click", function () {
        var txt = $(this).text()
        switch (txt) {
            case "Rev":
                $(this).text("Seq")
                _THIS.Gen_Table(_THIS.m_selectedItems_ary)
                break;
            case "Seq":
                $(this).text("Rev")
                _THIS.Gen_Table(bknArr)
                break;
            case "Dn":
                $(this).text("Rev")
                _THIS.Gen_Table(bknArr)
                break;
            default:
                alert("er")
                break;
        }
    })

}

RevisionsOfBibleListTable.prototype.Gen_Table = function (bknArr) {
    var str = "";
    var _THIS = this
    //var bknArr = Object.keys(CNST.FnameOfBibleObj);
    $.each(bknArr, function (i, v) {
        var hil = "";
        if (_THIS.m_selectedItems_ary.indexOf(v) >= 0) hil = "hili";
        str += "<tr><td class='cbkn " + hil + "'>" + v + "</td></tr>";
    });


    function update_seletedItems(_this) {
        var alreadyHili = $(_this)[0].classList.contains('hili')
        var name = $(_this).text();
        if (alreadyHili) {//will be removed
            var idx = _THIS.m_selectedItems_ary.indexOf(name)
            _THIS.m_selectedItems_ary.splice(idx, 1) //remove 1.
        } else {//will be added
            _THIS.m_selectedItems_ary.push(name)
        }
        MyStorage.setRevList(_THIS.m_selectedItems_ary)
        Uti.Msg(name + " : " + CNST.FnameOfBibleObj[name]);
    }
    function update_hili(_this) {
        $(_this).toggleClass("hili");
        var nsel = $(".cbkn.hili").size()
        if (nsel === 0) {//keep at least one.
            $(_this).addClass("hili")
        }

        $(".searchFile").removeClass("searchFile");
        $(_this).toggleClass("searchFile");
    }
    function update_data(_this) {
        update_seletedItems(_this)
        update_hili(_this)
        _THIS.m_onClickItm2Select()
    }

    function moveup_selitm(_this, i) {
        var name = $(_this).text();
        var idx = _THIS.m_selectedItems_ary.indexOf(name)
        if (1 === i) {//move up
            if (idx === 0) {
                var tmp = _THIS.m_selectedItems_ary.shift()
                _THIS.m_selectedItems_ary.push(tmp)
            } else {
                var tmp = _THIS.m_selectedItems_ary[idx - 1]
                _THIS.m_selectedItems_ary.splice(idx + 1, 0, tmp) //insert after idx
                _THIS.m_selectedItems_ary.splice(idx - 1, 1) //rm prev
            }
        }
        if (-1 === i) {//move down
            if (idx === _THIS.m_selectedItems_ary.length - 1) {
                var tmp = _THIS.m_selectedItems_ary.pop()
                _THIS.m_selectedItems_ary.unshift(tmp)
            } else {
                var tmp = _THIS.m_selectedItems_ary[idx]
                _THIS.m_selectedItems_ary.splice(idx + 2, 0, tmp) //insert after idx
                _THIS.m_selectedItems_ary.splice(idx, 1) //rm prev
            }
        }
        MyStorage.setRevList(_THIS.m_selectedItems_ary)
        _THIS.Gen_Table(_THIS.m_selectedItems_ary)
        _THIS.m_onClickItm2Select()
    }

    $(this.m_tbid + " tbody").html(str).find(".cbkn").bind("click", function () {
        //$(".cbkn").removeClass("hili");
        switch ($(_THIS.m_tbid + " caption").text()) {
            case "Rev": update_data(this); break;
            case "Seq": moveup_selitm(this, +1); break;
            //case "Dn": moveup_selitm(this, -1); break;
        }
    });
}
RevisionsOfBibleListTable.prototype.get_selected_nb_fnamesArr = function () {
    var fnamesArr = [];
    $(".cbkn.hili").each(function () {
        var ss = $(this).text();
        fnamesArr.push(ss);
    });
    if (fnamesArr.length == 0) {
        alert("Err: no bookname selected.");
    }
    return fnamesArr;
};///
RevisionsOfBibleListTable.prototype.get_search_fname = function () {
    var searchFileName = $(".cbkn.hili.searchFile").text();
    return searchFileName; //{ File: searchFileName, Strn: searchStrn };
};///










function Tab_mark_bcv_history() {
    this.m_tabid = "#Tab_mark_bcv_history"
    this.m_bcvHistory = MyStorage.getMarkHistory()
}
Tab_mark_bcv_history.prototype.init = function () {
    this.update_tab(true)

    var _THIS = this
    $("#loadhistory").bind("click", function (evt) {
        evt.stopImmediatePropagation()
        _THIS.onclick_load_vcv_history(true)
    })
    $("#sort_history_by_vcvID").bind("click", function (evt) {
        evt.stopImmediatePropagation()
        alert()
        _THIS.onclick_load_vcv_history(false)
    })
}
Tab_mark_bcv_history.prototype.onClickHistoryItem = function (onClickHistoryItm) {
    this.m_onClickHistoryItm = onClickHistoryItm

    this.init()
}
Tab_mark_bcv_history.prototype.addnew = function (vcv, tm) {
    this.m_bcvHistory[vcv] = (!tm) ? (new Date()).toISOString() : tm
    this.update_tab(true)
    MyStorage.setMarkHistory(this.m_bcvHistory)
}
Tab_mark_bcv_history.prototype.gen_trs_sort_by_time = function (bSortByTime) {
    var _THIS = this
    var ar = []
    Object.keys(this.m_bcvHistory).forEach(function (vcv, i) {
        var tm = ""
        if (bSortByTime) {
            tm = _THIS.m_bcvHistory[vcv]
        }
        ar.push(`<tr><td title='${tm}'>${vcv}</td></tr>`)
    });

    ar.reverse()
    return ar.join()
}
Tab_mark_bcv_history.prototype.update_tab = function (bSortByTime) {
    var _THIS = this
    var trs = this.gen_trs_sort_by_time(bSortByTime)
    $(this.m_tabid + " tbody").html(trs).find("td").bind("click", function (evt) {
        evt.stopImmediatePropagation()
        $(this).parentsUntil("table").find(".hili").removeClass("hili")
        $(this).addClass("hili")
        var vcv = $(this).text()
        if (_THIS.m_onClickHistoryItm) _THIS.m_onClickHistoryItm(vcv)
    })
}

Tab_mark_bcv_history.prototype.onclick_load_vcv_history = function (bSortByTime) {
    var _THIS = this
    // Jsonpster.inp.par = { Search: { File: RestApi.HistFile.__history_verses_loaded } };
    // Jsonpster.api = RestApi.ApiBibleObj_access_regex_search_history;
    // Uti.Msg(Jsonpster)
    // Jsonpster.Run(function (ret) {
    //     //history
    //     console.log(ret);
    //     _THIS.read_history_to_Obj(ret);
    //     _THIS.update_tab(bSortByTime)
// 
    // });
};///
Tab_mark_bcv_history.prototype.read_history_to_opt = function (ret, bSortByTime) {
    var ops = [];
    $.each(ret, function (vol, chobj) {
        $.each(chobj, function (chp, vrsObj) {
            $.each(vrsObj, function (vrs, ob) {
                $.each(ob, function (searchStr, tm) {
                    if (!bSortByTime) tm = "";
                    ops.push("<tr><td class='option' time='" + tm + "'>" + searchStr + " &nbsp;&nbsp;&nbsp;&nbsp;</td></tr>");
                });
            });
        });
    });
    ops.sort();
    if (bSortByTime) {
        ops.reverse();
    }
    return ops;
}
Tab_mark_bcv_history.prototype.read_history_to_Obj = function (ret) {
    var _THIS = this
    $.each(ret, function (vol, chobj) {
        $.each(chobj, function (chp, vrsObj) {
            $.each(vrsObj, function (vrs, ob) {
                $.each(ob, function (searchStr, tm) {
                    _THIS.addnew(searchStr, tm)
                });
            });
        });
    });
}





function GroupsMenuMgr() {
    this.m_grpContainerID = "#GroupsContainer"
}
GroupsMenuMgr.prototype.gen_grp_bar = function (idGroupsContainer) {
    var eBar = document.createElement("div")
    $(this.m_grpContainerID).find(".hiddenGrpMenu").each(function () {
        var sid = $(this).attr("id")
        var name = " " + sid.substr(4)
        var eac = document.createElement("a")
        $(eac).text(name).attr("sid", "#" + sid).css("padding-bottom", "2px")
        $(eBar).append(eac).append(" | ")
    });

    $(this.m_grpContainerID).prepend(eBar).find("a").bind("click", function () {
        var sid = $(this).attr("sid");

        $(sid).slideToggle()
        $(this).toggleClass("GroupsMenuMgrHili")

        //close others
        $(".GroupsMenuMgrHili").each(function () {
            var _sid = $(this).attr("sid");
            if (_sid != sid) {
                $(_sid).hide()
                $(this).removeClass("GroupsMenuMgrHili")
            }
        })
    })
}

var grpmgr = new GroupsMenuMgr()





var showup = new ShowupBCV() // ShowupBknChpVrsPanel()
var skinp = new SingleKeyInputPanel()
var digi = new DigitNumberInputZone()
var skout = new SingleKeyOutputBooksTable("#Tab_OutputBooksList")

var bibcat = new Tab_Cat()
var markHistory = new Tab_mark_bcv_history()

var nambib = new RevisionsOfBibleListTable("#Tab_NamesOfBible")

var obrapport = new PopupMenu_BcvTag()


var popupMenu_RevTag = new PopupMenu_RevTag()


var BibleInputMenu = function () {
}
BibleInputMenu.prototype.init = function () {
    var _This = this

    MyStorage.init()

    $("body").prepend(BibleInputMenuContainer);
    $("#menuContainer").draggable();
    $('*').on('click', function (e) {
        e.stopPropagation();
    });
    $("body").bind("click", function (evt) {
        evt.stopImmediatePropagation();
        $("#menuContainer").hide()
        obrapport.hide()
    })

    grpmgr.gen_grp_bar()




    digi.init_digi(showup)

    showup.onclick_Vrs2_plus_minus(function (bload) {
        if (bload) {
            digi.init_Chp_digiKeys_by_vol()
            digi.init_Vrs_digiKeys_by_vol()
            _This.loadBible_chp();
        } else {
            digi.init_Vrs_digiKeys_by_vol()
        }
        $("#menuContainer").show()
    })
    showup.onclick_Chp(function (bload) {
        digi.init_Chp_digiKeys_by_vol()
        digi.init_Vrs_digiKeys_by_vol()
        if (bload) {
            _This.loadBible_chp();
        }
        $("#menuContainer").show()
    })


    digi.m_Chp.Gen_Digits("#DigitOfChapt", "chp_num")
    digi.m_Vrs.Gen_Digits("#DigitOfVerse", "vrs_num")

    digi.m_Chp.on_Click_Digit(function () {
        _This.loadBible_chp();
    })
    digi.m_Vrs.on_Click_Digit(function () {
        _This.scrollToView_Vrs();
    })


    skout.init({
        onClickItm: function (vol) {
            showup.m_Bki.set_showupBkc(vol);
            showup.m_Chp.set_showupVal("")
            showup.m_Vrs.set_showupVal("")

            digi.init_Chp_digiKeys_by_vol()
            digi.init_Vrs_digiKeys_by_vol()

            var bcv = `${vol}1:1`
            markHistory.addnew(bcv)
            //d1.init_Chp_digiKeys_by_vol()
            //d2.disable_all_digiKey(true)

            Uti.Msg(vol + " : maxChap = " + Object.keys(_Max_struct[vol]).length + "\n\n\n");
        }
    })

    skinp.gen_panel({
        onClickItm: function (ch, volary, alreadyhili) {
            skout.Gen_BookList_Table(ch, volary, alreadyhili)

            bibcat.rm_hili()
        }
    })

    bibcat.Gen_Cat_Table({
        onClickItm: function (scat, volary, alreadyHili) {
            skout.Gen_BookList_Table(scat, volary, alreadyHili);
            skinp.rm_hili()
        }
    })



    nambib.Init_NB_Table({
        onClickItm: function () {
            _This.loadBible_chp();
        }
    });



    markHistory.onClickHistoryItem(function (bcv) {
        showup.update_showup(bcv)
        digi.init_Chp_digiKeys_by_vol()
        digi.init_Vrs_digiKeys_by_vol()
        _This.loadBible_chp()
    })

    obrapport.init()
    gBout.onclick_ob_table(function () {
        $("#menuContainer").hide()
        obrapport.hide()
    })

    popupMenu_RevTag.init()
    gBout.onclick_RevTag(function (par) {
        popupMenu_RevTag.popup(par)
    })


    $("#Compare_vcv").click(function () {
        $("#oBible table").find("tr").each(function () {
            var len = $(this).find("td:eq(2)").find("[type=checkbox]").length;
            $(this).find("td:eq(0)").text(len);
        });
        table_sort("#oBible table");
    });
    $("#oBible_indxer").click(function () {
        table_col_index("#oBible table");
        table_sort("#oBible table");
    });
};




BibleInputMenu.prototype.scrollToView_Vrs = function () {
    var parmBook = showup.get_selected_vcv_parm()
    var bkchvr = parmBook.vol + parmBook.chp + ":" + parmBook.vrs
    $(".bcvTag").each(function () {
        var txt = $(this).text()
        if (txt === bkchvr) {
            $(this)[0].scrollIntoViewIfNeeded()
            $(this).addClass("hiliScroll2View");
        }
    })
};///






BibleInputMenu.prototype.loadBible_chp = function () {
    var _THIS = this
    var bibOj = showup.get_selected_bc_bibOj();
    console.log("Obj=", bibOj);
    var fnamesArr = nambib.get_selected_nb_fnamesArr();
    Jsonpster.inp.par = { fnames: fnamesArr, bibOj: bibOj, Search: null };
    Jsonpster.api = RestApi.ApiBibleObj_load_Bkns_Vols_Chp_Vrs;
    Uti.Msg(Jsonpster);
    Jsonpster.Run(function (ret) {
        apiCallback_Gen_output_table(ret)
        setTimeout(function () {
            _THIS.scrollToView_Vrs()
        }, 2100)
    })

    return bibOj;
};///
BibleInputMenu.prototype.get_search_inp = function () {
    //
    var fnamesArr = nambib.get_selected_nb_fnamesArr();
    var searchFileName = nambib.get_search_fname();
    var searchStrn = $("#sinput").val();
    if (searchStrn.length === 0) {
        return alert("no search str.")
    }

    var inp = { fnames: fnamesArr, bibOj: null, Search: { File: searchFileName, Strn: searchStrn } };
    return inp;
};
///////////
//////////
//////////
//////////
/////////
///////////
//////////
//////////
//////////
/////////

function OutputBibleTable() {
    this.m_tbid = "#oBible"
}
OutputBibleTable.prototype.incFontSize = function (n) {
    var fsz = MyStorage.getFontSize()
    fsz += n;
    $(this.m_tbid + " table .tx").css("font-size", fsz);
    $("#fontsize").text(fsz)

    MyStorage.setFontSize(fsz)
    gBim.scrollToView_Vrs()
}
OutputBibleTable.prototype.onclick_ob_table = function (cbf) {
    this.incFontSize(0);

    $(this.m_tbid).bind("click", function () {
        if (cbf) cbf()
    })
}
OutputBibleTable.prototype.onclick_RevTag = function (cbf) {
    this.m_onclick_RevTag = cbf
}
OutputBibleTable.prototype.onclick_BcvTag = function (cbf) {
    this.m_onclick_BcvTag = cbf
}
OutputBibleTable.prototype.Gen_output_table = function (ret) {
    function editing_save(_This) {
        var old = $(_This).attr("oldtxt");
        var fil = $(_This).attr("title");
        var txt = $(_This).text();
        var xid = $(_This).attr("vid");
        if (!fil) {
            return;
        }

        if (old === txt) {
            Uti.Msg("no changes on text.");
            $(_This).parent().append(`<a class='ok'> (NoChanges!)</a>`);
            return;
        } else {
            if (!confirm("Save changes?")) {
                return;
            }
        }

        var mat = xid.match(/^(\w{3})(\d+)\:(\d+)$/);
        if (!mat) {//Gen1:1
            alert("edi save err:" + xid + ":" + txt);
            return;
        }
        var dat = {}
        dat.vol = mat[1];
        dat.chp = mat[2];
        dat.vrs = mat[3];
        dat.txt = txt;

        //var _This = this;
        Jsonpster.inp.par = { fnames: [fil], vcvx: dat };
        Jsonpster.api = RestApi.ApiBibleObj_update_notes;
        Uti.Msg(Jsonpster)
        Jsonpster.Run(function () {
            var stx = txt.substr(0, 5) + " ... " + txt.substr(txt.length - 15);
            Uti.Msg(stx);
            $(_This).removeClass("edit_keydown").removeClass("editing");
            $(_This).parent().append(`<a class='ok'> [${stx}](Saved!)</a>`);
        });
    };


    var _THIS = this;
    var tb = this.create_htm_table(ret);
    Uti.Msg("tot_rows=" + tb.size);
    $(this.m_tbid).html(tb.htm);
    //table_sort("#BibOut");
    $(this.m_tbid).find(".bcvTag").bind("click", function (evt) {
        evt.stopImmediatePropagation()

        //solve confliction between toggle and hili
        var alreadyHili = $(this)[0].classList.contains('bcvMark')
        if (alreadyHili) {
            $("#divPopupMenu_BcvTag").slideToggle();
        } else {
            $("#divPopupMenu_BcvTag").show();
        }

        $(".bcvTag.bcvMark").removeClass("bcvMark");
        $(this).addClass("bcvMark");

        var bcr = $(this)[0].getBoundingClientRect();
        console.log(bcr)
        var y = bcr.y + window.scrollY + $(this).height() + 5;//  $("#divPopupMenu_BcvTag").height()

        $("#divPopupMenu_BcvTag").css('top', y);
        //$("#divPopupMenu_BcvTag").toggle("'slide', {direction: 'up' }, 1000");//()

        var bcvid = $(this).text();
        $("#divPopupMenu_BcvTag").find("caption").text(bcvid).focus()

        markHistory.addnew(bcvid)

        // Jsonpster.inp.par = { Search: { File: RestApi.HistFile.__history_verses_loaded, Strn: bcvid } };
        // Jsonpster.api = RestApi.ApiBibleObj_access_regex_search_history;
        // Uti.Msg(Jsonpster)
        // Jsonpster.Run(function (ret) {
        //     Uti.Msg(bcvid + " is stored in history; and ref is available.");
        // });
    });

    //$(this.m_tbid).find(".tx").bind("focusout", editing_save);
    $(this.m_tbid).find(".tx").bind("keydown", function () {
        $(this).addClass("edit_keydown");
    });
    $(this.m_tbid).find("[type=checkbox]").bind("click", function () {
        $(".ok").remove();
        var stit = $(this).attr("title");
        if (stit[0] != "_") { //"_bnotes") {
            if ($(this).prop("checked")) {
                if ("password123" != prompt("Only Authorized people can edit it. \nPlease enter password.", "password")) {
                    return;
                };
            }
        }
        if ($(this).prop("checked")) {
            $(this).next().attr("contenteditable", "true").addClass("editing").attr("title", stit);
            var oldtxt = $(this).next().text();
            $(this).next().attr("oldtxt", oldtxt);
        } else {
            $(this).next().attr("contenteditable", null).removeClass("editing");
            editing_save($(this).next());
        }
    });
    $(this.m_tbid).find(".tx").bind("click", function (evt) {
        evt.stopImmediatePropagation();

        $(".ok").remove();
        $(this).toggleClass("hiliVrsTxt");
        var rsn = $(this).prev().attr("title");
        var txt = $(this).text();
        var vcv = $(this).parentsUntil("tbody").find("td:eq(0)").text();
        txt = `"${txt}" (${vcv} ${rsn})`;
        Uti.Msg(txt + " (" + vcv + ")");
        //copy to clipboard.
        if ($(this).attr("contenteditable")) {
            //noop
        } else {
            //$("#CopyTextToClipboard").show();
            $("#CopyTextToClipboard").val(txt);
            $("#CopyTextToClipboard").select();//:must be focusable, like visible input element. 
            document.execCommand("copy");
            $("#CopyTextToClipboard").blur();//.hide();
            $("body").focus()//focus back after copy.
            $(this).focus()//focus back after copy.
        }
    });


    $(this.m_tbid).find("sup.revTag").bind("click", function (evt) {
        //evt.stopImmediatePropagation();

        var txt = $(this).text();
        if ("_" !== txt[0]) {
            return;
        }

        var sbcv = $(this).attr("title")
        var taguid = $(this).attr("revTagUid")

        var alreadyHili = $(this)[0].classList.contains('hiliRevTag')
        $(".revTag.hiliRevTag").removeClass("hiliRevTag");
        $(this).toggleClass("hiliRevTag");

        var bcr = $(this)[0].getBoundingClientRect();
        console.log(bcr)
        var y = bcr.y + window.scrollY + $(this).height() + 5;//  $("#divPopupMenu_BcvTag").height()

        bcr.m_y = y
        bcr.m_txuid = taguid
        bcr.m_alreadyHili = alreadyHili
        bcr.m_bcv = sbcv
        bcr.m_rev = txt

        _THIS.m_onclick_RevTag(bcr)

    });

    this.incFontSize(0)
}

OutputBibleTable.prototype.convert_rbcv_2_bcvRobj = function (ret) {
    var bcvRobj = {}
    $.each(ret, function (rev, revObj) {
        $.each(revObj, function (vol, chpObj) {
            if (!bcvRobj[vol]) bcvRobj[vol] = {}
            $.each(chpObj, function (chp, vrsObj) {
                if (!bcvRobj[vol][chp]) bcvRobj[vol][chp] = {}
                $.each(vrsObj, function (vrs, txt) {
                    if (!bcvRobj[vol][chp][vrs]) bcvRobj[vol][chp][vrs] = {}
                    bcvRobj[vol][chp][vrs][rev] = txt
                });
            });
        });
    });
    return bcvRobj;
}
OutputBibleTable.prototype.create_htm_table = function (ret) {
    //ret = this.convert_rbcv_2_bcvRobj(ret)
    var idx = 0, st = "", uuid = 1;
    $.each(ret, function (vol, chpObj) {
        $.each(chpObj, function (chp, vrsObj) {
            $.each(vrsObj, function (vrs, val) {
                //console.log("typeof val=", typeof val);
                idx++;
                var sbcv = `${vol}${chp}:${vrs}`;
                var divbcv = `<a class='bcvTag'>${sbcv}</a>`
                st += `<tr><td>${divbcv}`;
                if ("object" == typeof val) {
                    $.each(val, function (revId, str) {
                        //
                        var tag = 'a'
                        if (revId.match(/^_[b|c|x]/)) tag = 'div'
                        var clsname = `class='tx tx${revId}'`
                        if (CNST.OT_Bkc_Ary.indexOf(vol) >= 0 && revId === 'H_G') {
                            clsname = `dir='rtl' class='tx tx${revId} tx_OT'` //
                        }
                        uuid++
                        st += `<div><sup revTagUid='${uuid}' class='revTag' title='${sbcv}'>${revId}</sup><${tag} id='${uuid}' ${clsname} vid='${sbcv}'>${str}</${tag}></div>`;
                    });
                }
                if ("string" == typeof val) {
                    st += "<div>" + val + "</div>";
                }
                st += "</td></tr>";
            });
        });
    });

    var s = "<table id='BibOut' border='1'>";
    s += `<caption><p/><p>TotRows=${idx}</p></caption>`;
    s += "<thead><th>#</th></thead>";
    s += "<tbody>";
    s += st;

    s += "</tbody></table>";
    return { htm: s, size: idx };
}

var gBim = new BibleInputMenu();
var gBout = new OutputBibleTable()

function apiCallback_Gen_output_table(ret) {
    obrapport.hide()
    gBout.Gen_output_table(ret)
}












function onclick_regex_match_next(incrs) {
    var str = $("#sinput").val();
    var reg = new RegExp(str, "g");

    var matSize = $(".mat").length;
    if (matSize > 0 && str === document.g_matchStrin) {
        if (Math.abs(document.g_matchIndex) >= matSize) {
            document.g_matchIndex = 0;
        }
        var elm = ".mat:eq(" + document.g_matchIndex + ")";
        //$(elm).parentsUntil("tr").addClass ("hili");
        $(".mat.matIndex").removeClass("matIndex");
        $(elm).addClass("matIndex");
        $(elm)[0].scrollIntoViewIfNeeded();
        Uti.Msg("hili:" + document.g_matchIndex + "/" + document.g_matchCount);
        document.g_matchIndex += incrs;
        return;
    }
    $(".mat").removeClass("matIndex");
    $(".mat").removeClass("mat");
    document.g_matchStrin = str;
    document.g_matchCount = 0;
    document.g_matchIndex = 0;
    $("a[bcvTag]").each(function (idx) {
        var ss = $(this).text();
        var mat = ss.match(reg);
        if (mat) {
            $.each(mat, function (i, v) {
                if (0 == i) {
                    ss = ss.replace(v, "<font class='mat'>" + v + "</font>");
                }
            });
            $(this).html(ss).prev().attr("checked", true);
            document.g_matchCount++;
        };
    });
    Uti.Msg("tot:" + document.g_matchCount);
    if (document.g_matchCount > 0) {//save to history.
        Jsonpster.inp.par = { Search: { File: RestApi.HistFile.__history_regex_search, Strn: str } };
        Jsonpster.api = RestApi.ApiBibleObj_access_regex_search_history;
        Uti.Msg(Jsonpster)
        Jsonpster.Run(function () {
            Uti.Msg("found");
        });
    };
};
function onclick_BibleObj_search_str() {
    var s = $("#sinput").val().trim();
    Jsonpster.inp.par = gBim.get_search_inp();
    Jsonpster.api = RestApi.ApiBibleObj_search_txt; //ApiBibleObj_load_Bkns_Vols_Chp_Vrs;
    Uti.Msg(Jsonpster)
    if (!Jsonpster.inp.par) return
    Jsonpster.Run(apiCallback_Gen_output_table);

    //test
    var unicds = "";
    for (var i = 0; i < s.length; i++) {
        var ch = s.charCodeAt(i);
        if (ch > 512) {
            unicds += "\\u" + ch.toString(16);
        }
    }
    Uti.Msg(s);
    Uti.Msg(unicds);

}
function onclick_load_search_string_history(bSortByTime) {
    Jsonpster.inp.par = { Search: { File: RestApi.HistFile.__history_regex_search, Strn: null } };//readonly.
    Jsonpster.api = RestApi.ApiBibleObj_access_regex_search_history;
    Uti.Msg(Jsonpster)
    Jsonpster.Run(function (ret) {
        //history
        console.log(ret);
        var ops = Uti.read_history_to_opt(ret, true);
        $("#Tab_regex_history_lst tbody").html(ops.join("")).find(".option").bind("click", function () {
            $(this).toggleClass("hili");
            var s = $(this).text().trim();
            $("#sinput").val(s);
        });
    });
};


function onclick_btn_set_jsonpster_svr_ip() {
    var ip = $("#txtarea").val()
    var src = `http://${ip}:7778/Jsonpster/`
    console.log("jsonpster ipaddr", src)
    var scp = document.createElement("script")
    scp.src = ip
    $("body").append(scp)
    $("#txtarea").val(src)
}





var Uti = {
    Msg_Idx: 0,
    Msg: function (dat) {
        var str = dat;
        if ("object" === typeof dat) {
            str = JSON.stringify(dat, null, 4);
        }
        var results = `[${Uti.Msg_Idx++}]\n${str}\n\n\n` + $("#txtarea").val();
        //results = results.substr(0, 60);
        $("#txtarea").val(results);
    },

    read_history_to_opt: function (ret, bSortByTime) {
        var ops = [];
        $.each(ret, function (vol, chobj) {
            $.each(chobj, function (chp, vrsObj) {
                $.each(vrsObj, function (vrs, ob) {
                    $.each(ob, function (searchStr, tm) {
                        if (!bSortByTime) tm = "";
                        ops.push("<tr><td class='option' time='" + tm + "'>" + searchStr + " &nbsp;&nbsp;&nbsp;&nbsp;</td></tr>");
                    });
                });
            });
        });
        ops.sort();
        if (bSortByTime) {
            ops.reverse();
        }
        return ops;
    },
    vcv_parser: function (sbcv) {
        sbcv = sbcv.replace(/\s/g, "");
        if (sbcv.length === 0) return alert("please select an item first.");
        var ret = { vol: "", chp: "", vrs: "" };
        var mat = sbcv.match(/^(\w{3})\s{,+}(\d+)\s{,+}[\:]\s{,+}(\d+)\s{,+}$/);
        var mat = sbcv.match(/^(\w{3})\s+(\d+)\s+[\:]\s+(\d+)\s+$/);
        var mat = sbcv.match(/^(\w{3})(\d+)\:(\d+)$/);
        if (mat) {
            ret.vol = mat[1];
            ret.chp = mat[2];
            ret.vrs = mat[3];
        } else {
            alert("sbcv=" + sbcv + "," + JSON.stringify(ret));
        }
        ret.chp3 = ret.chp.padStart(3, "0");
        ret._vol = "_" + ret.vol;
        return ret;
    },



};////  Uti
////////////////////////////////////
const CNST = {
}



var BibleInputMenuContainer = `
<style>
</style>
<input id="CopyTextToClipboard" title="CopyTextToClipboard" readonly='true'></input>
<div id="menuToggler" onclick="$('#menuContainer').slideToggle();">
    <a id="bk_name">Biblic Input Keyboard</a>
    <a id="minus_ChpVal" op='—'>--</a>
    <div class='chapvrsnum' id='chp_num'>chap</div> : <div class='chapvrsnum' id='vrs_num'>ver</div>
</div>

<!----------------------------->

<div id="menuContainer">
    <div id="BibInputMenuHolder">
        <div id="ID_BibleInputMenuContainer">

            <!----------------------------->

            <table border="1" id="inputkey">
                <tbody id="SingleKeywordsBody">
                </tbody>
                <tbody id='DigitOfChapt'>
                </tbody>
                <tbody id='DigitOfVerse'>
                </tbody>
                
            </table>

            <!----------------------------->

            <!----------------------------->
            <table id="Tab_OutputBooksList" border="1">
                <caption></caption>
                <thead id="">
                </thead>
                <tbody>
                </tbody>
            </table>
            <!----------------------------->
        </div>




       
        <div id="GroupsContainer" style="display:visual">

            <div class="GrpMenu hiddenGrpMenu" id="grp_Cluster" style="float:left;display:none;">
                <table border="1" style="float:left;display:" id="Tab_CatagryOfBooks">
                    <caption class='' id='' title='Catagory of Books in Bible'>Cat</caption>
                    <thead id=""></thead>
                    <tbody id=''>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <table id="Tab_NamesOfBible" border="1" style="float:left;">
                    <caption><button title='Names of Bible' Rev="select" Seq="moveUp" Dn="moveDn">Rev</button></caption>
                    <thead id=""></thead>
                    <tbody>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <table id="Tab_mark_bcv_history" border="1" style="float:left;">
                    <caption>
                       <button id="loadhistory"  title='load history sort by time'>H</button>
                       <button id="sort_history_by_vcvID"  title='load history sort by str'>^</button>
                    </caption>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>
                                Pleas click H button <br>for History.<br>
                                <br>
                                Pleas click ^ button <br>sort by str.<br>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <div class="GrpMenu hiddenGrpMenu" id="grp_Explore" style="float:left;display:none;">

                <input id="sinput" cols='50' onclick="onclick_load_search_string_history();" ></input><br>

                <button onclick="onclick_BibleObj_search_str();" title="search on svr">search</button>
                <button onclick="onclick_regex_match_next(-1);" title="find on page">Prev</button>
                <button onclick="onclick_regex_match_next(1);" title="find on page">Next</button>
                <table id="Tab_regex_history_lst" border='1' style="float:left;">
                <tbody>
                    <tr>
                        <td>
                            click search results<br>
                            to show history serch<br>                           

                        </td>
                    </tr>
                </tbody>
            </table>
            </div>

            <div class="GrpMenu hiddenGrpMenu" id="grp_Dbg"  style="float:left;display:none;">
           
                
                <button onclick="$('#txtarea').val('');" title='clearout txt'>x</button>
                <button id="Compare_vcv">Compare_vcv</button>
                <button id="oBible_indxer">indxer</button>
                <button onclick="onclick_btn_set_jsonpster_svr_ip();">set jsonpster svr ip</button>
                <a href='../index.htm'>ref</a>
                <br>
                <textarea id="txtarea" cols='50' rows='20'  value='search results...' title='load search history.'>
                </textarea><br>

            </div>

            <div class="GrpMenu hiddenGrpMenu" id="grp_Config"  style="float:left;display:none;">
                <table id='tmpsel2ref' border="1" align="left">
                    <thead></thead>
                    <tbody>
                    </tbody>
                </table>
             
                <table border="1">
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>desc</td>
                            <td>Change</td>
                            <td>note</td>
                        </tr>
                    </thead>
                    <tbody id="">
                        <tr>
                            <td></td>
                            <td>AccontName</td>
                            <td><input id="acctname"  onkeyup="alert($(this).val());MyStorage.setAcctName($(this).val());" value='pub' ></input></td>
                            <td>note</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>UserName</td>
                            <td><input id="f_path" onkeyup="MyStorage.setUserName($(this).val());" value='peter'></input></td>
                            <td>user</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>FontSize</td>
                            <td><button onclick="gBout.incFontSize(2);" title='font-size plus'>f+</button>
                            <button onclick="gBout.incFontSize(-2);" title='font-size minus'>f-</button></td>
                            <td id='fontsize'></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>clear setting</td>
                            <td><input type="radio" onclick="MyStorage.clear();" title='clear out storage'>ClearSettings</input></td>
                        </tr>
                    </tbody>
                </table>
            

               
            
            </div> 
            <!--------- end of GroupsContainer ------>
        </div>
    </div>
</div>
<hr />



<div id="divPopupMenu_BcvTag">
    <table id='refslist' border="1" align="left">
    
    <tbody>
        <tr>
            <td>
                <a id="blb" ref="https://www.blueletterbible.org/kjv/">blueletterbible.org</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="qbible_com" ref="http://www.qbible.com/" sample="hebrew-old-testament/genesis/50.html#1" title='http://www.qbible.com/hebrew-old-testament/genesis/50.html#1'>qbible.com</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="h_g" ref="../../../../bible_concordance/rel/hgsbible/hgb/" title='Hebrew_Greek'>h_g</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="gtw" ref="https://www.biblegateway.com/passage/?search=" title='biblegateway.com'>gateway</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="studylight" ref="https://www.studylight.org/commentary/" title='studylight.org'>studylight</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="ccel_org" ref="http://www.ccel.org/study/" title='ChristianClassicEtherealLib'>ccel</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="crossReference" ref="https://www.openbible.info/labs/cross-references/search?q=" title='cross-references'>cross-references</a>
            </td>
        </tr>
    </tbody>
    <caption>ext link</caption>
    </table>
</div>

<div id="divPopupMenu_RevTag">
    <table id='refslist' border="1" align="left">
    <caption></caption>
    <tbody>
        <tr>
            <td>
                <a id="RevTag_Edit">Edit</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Save">Save</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="RevTag_Info">-</a>
            </td>
        </tr>
    </tbody>
    </table>
</div>

<div id='oBible'>----</div>
        `;//////backtick for multiple lines. 



CNST.FnameOfBibleObj =
{
    "BBE": "Basic Bible in English",
    "CUVS": "Chinese Union Version Simplified, 官話和合本, 1919",
    "CUVsen": "CUV Simplied with English Name",
    "CUVpy": "Chinese Union Version PinYing",
    "ESV": "English Standard Version",
    "H_G": "Hebrew and Greek",
    "KJV": "King James Version",
    "KJV_Jw": "King James Version Jesus' Words",
    "NIV": "New International Version",
    "NIV_Jw": "New International Version Jesus' Words",
    "STUS": "Studium Biblicum Version by Catholic,1968",
    "WLVS": "Wen Li Version. 文理和合本新約全書於1906年出版，新舊約全書於1919年出版.修訂新約後的新舊約全書，於1923年出版，至1934年印行最後一版, 原本分為官話、深文理、淺文理三種譯本，稱為「聖經唯一，譯本則三」。後來深淺文理合併為文理和合本 https://zh.wikisource.org/wiki/%E8%81%96%E7%B6%93_(%E5%92%8C%E5%90%88%E6%9C%AC) \n\nFor 1895 新約淺文理(包爾騰(John Shaw Burdon)、柏亨利(Henry Blodget)) https://bible.fhl.net/ob/nob.html?book=8 ",
    "_CrossRef": "cross-references",
    "_bnotes": "personal biblical study notes",
    "_crf": "self added cross-references",
    "_xrand": "personal extra random notes."
};

CNST.BiBookName = {
    "Gen": ['Genesis', 'genesis', '创世纪',],
    "Exo": ['Exodus', 'exodus', '出埃及记',],
    "Lev": ['Leviticus', 'leviticus', '利未记',],
    "Num": ['Numbers', 'numbers', '民数记',],
    "Deu": ['Deuteronomy', 'deuteronomy', '申命记',],
    "Jos": ['Joshua', 'joshua', '约书亚记',],
    "Jug": ['Judges', 'judges', '士师记',],
    "Rut": ['Ruth', 'ruth', '路得记',],
    "1Sa": ['1_Samuel', '1-samuel', '撒母耳记上',],
    "2Sa": ['2_Samuel', '2-samuel', '撒母耳记下',],
    "1Ki": ['1_Kings', '1-kings', '列王记上',],
    "2Ki": ['2_Kings', '2-kings', '列王记下',],
    "1Ch": ['1_Chronicles', '1-chronicles', '历代志上',],
    "2Ch": ['2_Chronicles', '2-chronicles', '历代志下',],
    "Ezr": ['Ezra', 'ezra', '以斯拉记',],
    "Neh": ['Nehemiah', 'nehemiah', '尼希米记',],
    "Est": ['Esther', 'esther', '以斯帖记',],
    "Job": ['Job', 'job', '约伯记',],
    "Psm": ['Psalm', 'psalm', '诗篇',],
    "Pro": ['Proverbs', 'proverbs', '箴言',],
    "Ecc": ['Ecclesiastes', 'ecclesiastes', '传道书',],
    "Son": ['SongOfSolomon', 'song-of-solomon', '雅歌',],
    "Isa": ['Isaiah', 'isaiah', '以赛亚书',],
    "Jer": ['Jeremiah', 'jeremiah', '耶利米书',],
    "Lam": ['Lamentations', 'lamentations', '耶利米哀歌',],
    "Eze": ['Ezekiel', 'ezekiel', '以西结书',],
    "Dan": ['Daniel', 'daniel', '但以理书',],
    "Hos": ['Hosea', 'hosea', '何西阿书',],
    "Joe": ['Joel', 'joel', '约珥书',],
    "Amo": ['Amos', 'amos', '阿摩司书',],
    "Oba": ['Obadiah', 'obadiah', '俄巴底亚书',],
    "Jon": ['Jonah', 'jonah', '约拿书',],
    "Mic": ['Micah', 'micah', '弥迦书',],
    "Nah": ['Nahum', 'nahum', '那鸿书',],
    "Hab": ['Habakkuk', 'habakkuk', '哈巴谷书',],
    "Zep": ['Zephaniah', 'zephaniah', '西番雅书',],
    "Hag": ['Haggai', 'haggai', '哈该书',],
    "Zec": ['Zechariah', 'zechariah', '撒迦利亚',],
    "Mal": ['Malachi', 'malachi', '玛拉基书',],
    "Mat": ['Matthew', 'matthew', '马太福音',],
    "Mak": ['Mark', 'mark', '马可福音',],
    "Luk": ['Luke', 'luke', '路加福音',],
    "Jhn": ['John', 'john', '约翰福音',],
    "Act": ['Acts', 'acts', '使徒行传',],
    "Rom": ['Romans', 'romans', '罗马书',],
    "1Co": ['1_Corinthians', '1-corinthians', '哥林多前书',],
    "2Co": ['2_Corinthians', '2-corinthians', '哥林多后书',],
    "Gal": ['Galatians', 'galatians', '加拉太书',],
    "Eph": ['Ephesians', 'ephesians', '以弗所书',],
    "Phl": ['Philippians', 'philippians', '腓立比书',],
    "Col": ['Colossians', 'colossians', '歌罗西书',],
    "1Ts": ['1_Thessalonians', '1-thessalonians', '帖撒罗尼迦前书',],
    "2Ts": ['2_Thessalonians', '2-thessalonians', '帖撒罗尼迦后书',],
    "1Ti": ['1_Timothy', '1-timothy', '提摩太前书',],
    "2Ti": ['2_Timothy', '2-timothy', '提摩太后书',],
    "Tit": ['Titus', 'titus', '提多书',],
    "Phm": ['Philemon', 'philemon', '腓利门书',],
    "Heb": ['Hebrews', 'hebrews', '希伯来书',],
    "Jas": ['James', 'james', '雅各书',],
    "1Pe": ['1_Peter', '1-peter', '彼得前书',],
    "2Pe": ['2_Peter', '2-peter', '彼得后书',],
    "1Jn": ['1_John', '1-john', '约翰一书',],
    "2Jn": ['2_John', '2-john', '约翰二书',],
    "3Jn": ['3_John', '3-john', '约翰三书',],
    "Jud": ['Jude', 'jude', '犹大书',],
    "Rev": ['Revelation', 'revelation', '启示录',],
};
CNST.BibVolNameEngChn = function (Vid) {
    return CNST.BiBookName[Vid][0] + " " + CNST.BiBookName[Vid][2];
};
CNST.isNT = function (Vid) {
    return (CNST.BibVol_OTorNT(Vid) === "t_NT")
};
CNST.BibVol_OTorNT = function (Vid) {
    if (CNST.OT_Bkc_Ary.indexOf(Vid) >= 0) {
        return "t_OT"
    }
    if (CNST.NT_Bkc_Ary.indexOf(Vid) >= 0) {
        return "t_NT"
    }
    return console.log("ERROR", Vid);
};
CNST.BibVolName_Studylight = function (Vid) {
    return CNST.BiBookName[Vid][1];
};
CNST.BibVolName_ccel = function (Vid) {
    return CNST.BiBookName[Vid][0];
};
CNST.BlueLetterBibleCode = {
    "Gen": "Gen",
    "Exo": "Exo",
    "Lev": "Lev",
    "Num": "Num",
    "Deu": "Deu",
    "Jos": "Jos",
    "Jug": "Jug",
    "Rut": "Rut",
    "1Sa": "1Sa",
    "2Sa": "2Sa",
    "1Ki": "1Ki",
    "2Ki": "2Ki",
    "1Ch": "1Ch",
    "2Ch": "2Ch",
    "Ezr": "Ezr",
    "Neh": "Neh",
    "Est": "Est",
    "Job": "Job",
    "Psm": "Psa",//
    "Pro": "Pro",
    "Ecc": "Ecc",
    "Son": "Son",
    "Isa": "Isa",
    "Jer": "Jer",
    "Lam": "Lam",
    "Eze": "Eze",
    "Dan": "Dan",
    "Hos": "Hos",
    "Joe": "Joe",
    "Amo": "Amo",
    "Oba": "Oba",
    "Jon": "Jon",
    "Mic": "Mic",
    "Nah": "Nah",
    "Hab": "Hab",
    "Zep": "Zep",
    "Hag": "Hag",
    "Zec": "Zec",
    "Mal": "Mal",
    "Mat": "Mat",
    "Mak": "Mak",
    "Luk": "Luk",
    "Jhn": "Jhn",
    "Act": "Act",
    "Rom": "Rom",
    "1Co": "1Co",
    "2Co": "2Co",
    "Gal": "Gal",
    "Eph": "Eph",
    "Phl": "Phl",
    "Col": "Col",
    "1Ts": "1Ts",
    "2Ts": "2Ts",
    "1Ti": "1Ti",
    "2Ti": "2Ti",
    "Tit": "Tit",
    "Phm": "Phm",
    "Heb": "Heb",
    "Jas": "Jas",
    "1Pe": "1Pe",
    "2Pe": "2Pe",
    "1Jn": "1Jn",
    "2Jn": "2Jn",
    "3Jn": "3Jn",
    "Jud": "Jud",
    "Rev": "Rev",
};//BookChapterVerseMax
CNST.BookID2IdxCode = {
    _Gen: ['01', 'h'],
    _Exo: ['02', 'h'],
    _Lev: ['03', 'h'],
    _Num: ['04', 'h'],
    _Deu: ['05', 'h'],
    _Jos: ['06', 'h'],
    _Jug: ['07', 'h'],
    _Rut: ['08', 'h'],
    _1Sa: ['09', 'h'],
    _2Sa: ['10', 'h'],
    _1Ki: ['11', 'h'],
    _2Ki: ['12', 'h'],
    _1Ch: ['13', 'h'],
    _2Ch: ['14', 'h'],
    _Ezr: ['15', 'h'],
    _Neh: ['16', 'h'],
    _Est: ['17', 'h'],
    _Job: ['18', 'h'],
    _Psm: ['19', 'h'],
    _Pro: ['20', 'h'],
    _Ecc: ['21', 'h'],
    _Son: ['22', 'h'],
    _Isa: ['23', 'h'],
    _Jer: ['24', 'h'],
    _Lam: ['25', 'h'],
    _Eze: ['26', 'h'],
    _Dan: ['27', 'h'],
    _Hos: ['28', 'h'],
    _Joe: ['29', 'h'],
    _Amo: ['30', 'h'],
    _Oba: ['31', 'h'],
    _Jon: ['32', 'h'],
    _Mic: ['33', 'h'],
    _Nah: ['34', 'h'],
    _Hab: ['35', 'h'],
    _Zep: ['36', 'h'],
    _Hag: ['37', 'h'],
    _Zec: ['38', 'h'],
    _Mal: ['39', 'h'],
    _Mat: ['40', 'b'],
    _Mak: ['41', 'b'],
    _Luk: ['42', 'b'],
    _Jhn: ['43', 'b'],
    _Act: ['44', 'b'],
    _Rom: ['45', 'b'],
    _1Co: ['46', 'b'],
    _2Co: ['47', 'b'],
    _Gal: ['48', 'b'],
    _Eph: ['49', 'b'],
    _Phl: ['50', 'b'],
    _Col: ['51', 'b'],
    _1Ts: ['52', 'b'],
    _2Ts: ['53', 'b'],
    _1Ti: ['54', 'b'],
    _2Ti: ['55', 'b'],
    _Tit: ['56', 'b'],
    _Phm: ['57', 'b'],
    _Heb: ['58', 'b'],
    _Jas: ['59', 'b'],
    _1Pe: ['60', 'b'],
    _2Pe: ['61', 'b'],
    _1Jn: ['62', 'b'],
    _2Jn: ['63', 'b'],
    _3Jn: ['64', 'b'],
    _Jud: ['65', 'b'],
    _Rev: ['66', 'b'],
};
CNST.OT_Bkc_Ary = [
    "Gen",
    "Exo",
    "Lev",
    "Num",
    "Deu",
    "Jos",
    "Jug",
    "Rut",
    "1Sa",
    "2Sa",
    "1Ki",
    "2Ki",
    "1Ch",
    "2Ch",
    "Ezr",
    "Neh",
    "Est",
    "Job",
    "Psm",
    "Pro",
    "Ecc",
    "Son",
    "Isa",
    "Jer",
    "Lam",
    "Eze",
    "Dan",
    "Hos",
    "Joe",
    "Amo",
    "Oba",
    "Jon",
    "Mic",
    "Nah",
    "Hab",
    "Zep",
    "Hag",
    "Zec",
    "Mal"
];
CNST.NT_Bkc_Ary = [
    "Mat",
    "Mak",
    "Luk",
    "Jhn",
    "Act",
    "Rom",
    "1Co",
    "2Co",
    "Gal",
    "Eph",
    "Phl",
    "Col",
    "1Ts",
    "2Ts",
    "1Ti",
    "2Ti",
    "Tit",
    "Phm",
    "Heb",
    "Jas",
    "1Pe",
    "2Pe",
    "1Jn",
    "2Jn",
    "3Jn",
    "Jud",
    "Rev"
];
CNST.Cat2VolArr = {
    "OT": CNST.OT_Bkc_Ary,
    "Moses": ["Gen", "Exo", "Lev", "Num", "Deu"],
    "History": ["Jos", "Jug", "Rut", "1Sa", "2Sa", "1Ki", "2Ki", "1Ch", "2Ch", "Ezr", "Neh", "Est"],
    "Literature": ["Job", "Psm", "Pro", "Ecc", "Son"],
    "MajorPr": ["Isa", "Jer", "Lam", "Eze", "Dan"],
    "MinorPr": ["Joe", "Amo", "Oba", "Jon", "Mic", "Nah", "Hab", "Zep", "Hag", "Zec", "Mal"],
    "NT": CNST.NT_Bkc_Ary,
    "Gospel": ["Mat", "Mak", "Luk", "Jhn"],
    "Paulines": ["Rom", "1Co", "2Co", "Gal", "Eph", "Phl", "Col", "1Ts", "2Ts", "1Ti", "2Ti", "Tit", "Phm"],
    "Epistles": ["Heb", "Jas", "1Pe", "2Pe", "1Jn", "2Jn", "3Jn", "Jud"]
};
var BookJsFlavor = {
    OTNT: ['#510000', 'wholistic Bible', '圣经全书'],
    OT: ['#001040', 'O.T.', '旧约全书'],
    Moses: ['#002E63', 'Moses', '摩西五经'],
    History: ['#002E63', 'History', '历史'],
    Literature: ['#002E63', 'Literature', '文学'],
    Major_Prophets: ['#002E63', 'Major_Prophets', '大先知'],
    Minor_Prophets: ['#002E63', 'Minor_Prophets', '小先知'],
    NT: ['#4053A9', 'N.T.', '新约全书'],
    Gospels: ['#003399', 'Gospels', '四福音书'],
    HisSayings: ['#003399', 'HisSayings', '耶稣话语'],
    Pauls: ['#003399', 'Pauls', '保罗书信'],
    Other_Epistles: ['#003399', 'OtherEpistles', '其他书信'],
};

