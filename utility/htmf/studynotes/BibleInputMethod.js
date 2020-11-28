







var Ext_Link_Menu = {
    setup_links: function () {
        $("#blb").click(function () {
            var vid = $(".vid.vmark").text();
            var ret = Uti.vcv_parser(vid);
            var url = $(this).attr("ref");
            if (!ret) return;

            var blbvol = CNST.BlueLetterBibleCode[ret.vol];
            var file = blbvol + "/" + ret.chp + "/" + ret.vrs;
            $(this).attr("href", url + file);
        });
        $("#h_g").click(function () {
            var vid = $(".vid.vmark").text();
            var ret = Uti.vcv_parser(vid);
            var url = $(this).attr("ref");
            if (!ret) return;

            var volm = ret._vol;
            var bkidx = CNST.BookID2IdxCode[volm];
            var file = bkidx[0] + volm + "_" + ret.chp3 + ".htm#" + ret.vrs;
            $(this).attr("href", url + file);
        });
        $("#gtw").click(function () {
            var vid = $(".vid.vmark").text();
            var ret = Uti.vcv_parser(vid);
            var url = $(this).attr("ref");
            if (!ret) return;

            var vol2 = CNST.BibVolName[ret.vol][0];
            var file = vol2 + ret.chp + ":" + ret.vrs + "&version=NIV;CUV;KJV;NKJV;ESV";
            $(this).attr("href", url + file);
        });
        $("#studylight").click(function () {
            var vid = $(".vid.vmark").text();
            var ret = Uti.vcv_parser(vid);
            var url = $(this).attr("ref");
            if (!ret) return;

            //https://www.studylight.org/commentary/john/1-1.html
            var vol2 = CNST.BibVolName_Studylight([ret.vol]);
            var file = vol2 + "/" + ret.chp + "-" + ret.vrs + ".html";
            $(this).attr("href", url + file);
            console.log(url + file);
        });

        $("#ccel_org").click(function () {
            var vid = $(".vid.vmark").text();
            var ret = Uti.vcv_parser(vid);
            var url = $(this).attr("ref");
            if (!ret) return;

            //http://www.ccel.org/study/1_Samuel%202:11-4:18 
            var bok = CNST.BibVolName_ccel([ret.vol]);
            var file = bok + " " + ret.chp + ":" + ret.vrs + ".html";
            $(this).attr("href", url + file);
            console.log(url + file);
        });

        $("#crossReference").click(function () {
            var vid = $(".vid.vmark").text();
            var ret = Uti.vcv_parser(vid);
            var url = $(this).attr("ref");
            if (!ret) return;

            //http://www.ccel.org/study/1_Samuel%202:11-4:18 
            var bok = CNST.BlueLetterBibleCode[ret.vol];
            var file = bok + " " + ret.chp + ":" + ret.vrs + "";
            $(this).attr("href", url + file);
            console.log(url + file);
        });

    }
}











function SingleKeyInputMenu(tbody) {
    if (!tbody) {
        tbody = "#Tab_BibleSingleInputKey tbody"
    }
    this.m_tbody = tbody
    this.m_chp_vrs_clsnam = "chapvrsnum"
}
SingleKeyInputMenu.prototype.gen_menu = function (cbf) {
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
    s += "</td></tr>";

    $(this.m_tbody).html(s).find(".vin").bind("click", function () {
        $(".vin").removeClass("hili");
        $(this).addClass("hili");
        $("." + _This.m_chp_vrs_clsnam).text("")

        var ch = $(this).text();
        var volarr = _This.Get_Vol_Arr_from_KeyChar(ch[0], _Max_struct);
        var bcr = $(this)[0].getBoundingClientRect();
        var y = bcr.y + $(this).height();// + window.scrollY;// - $("#externalinkMenu").height()
        var x = bcr.x + $(this).width();// + window.scrollX;// - $("#externalinkMenu").width()
        // $("#externalinkMenu").css('top', y).show();
        if (!cbf) return console.error("cbf is null")
        cbf(ch, volarr, x, y)
    });
    return ks;
}
SingleKeyInputMenu.prototype.get_cha_arr_after_str = function (str, BibleObjStruct) {
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
SingleKeyInputMenu.prototype.Get_Vol_Arr_from_KeyChar = function (ch, BibleObjStruct) {
    var arr = [];
    Object.keys(BibleObjStruct).forEach(function (vol) {
        if (['1', '2', '3'].indexOf(ch) >= 0) {
            if (vol.indexOf(ch) === 0) {
                arr.push(vol);
            }
            return arr
        }

        var firstChar = vol[0]
        var flag = 0
        if (['1', '2', '3'].indexOf(firstChar) >= 0) {
            flag = 1
        }

        if (vol.indexOf(ch) === flag) {
            arr.push(vol);
        }
    });
    return arr;
}













function BookNamesListTable(tbody) {

    this.m_tbid = tbody // "#Tab_bkn"
}
BookNamesListTable.prototype.gen_table = function (cbf) {


}

BookNamesListTable.prototype.Gen_BKN_Table = function (parm) {
    var str = "";
    var bknArr = Object.keys(CNST.FnameOfBibleObj);
    $.each(bknArr, function (i, v) {
        var hil = "";
        if (i == 1) hil = "hili";
        str += "<tr><td class='cbkn " + hil + "'>" + v + "</td></tr>";
    });
    $(this.m_tbid + " tbody").html(str).find(".cbkn").bind("click", function () {
        //$(".cbkn").removeClass("hili");
        $(this).toggleClass("hili");

        $(".searchFile").removeClass("searchFile");
        $(this).toggleClass("searchFile");

        $("#searchFile").text($(this).text());

        var name = $(this).text();
        Uti.Msg(name + " : " + CNST.FnameOfBibleObj[name]);

        parm.onClick(name)
    });
}
BookNamesListTable.prototype.get_selected_bkn_fnamesArr = function () {
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
BookNamesListTable.prototype.get_selected_Search_Parm = function () {
    var searchFileName = $(".cbkn.hili.searchFile").text();
    var searchStrn = $("#sinput").val();
    return { File: searchFileName, Strn: searchStrn };
};///




function DigitNumberInputMenu(digiType, tbody, clsname) {
    this.m_digiType = digiType;// chpDigi or vrsDigi

    if (!tbody) {
        tbody = "#DigitOfChapter"
    }
    this.m_tbody = tbody
    this.m_classname = clsname

    this.m_displayId = "#" + clsname

    this.m_volID = "#BibleInputCap"
}
DigitNumberInputMenu.prototype.set_Neightbor = function (nextDigiMenu) {
    this.m_nextDigiMenu = nextDigiMenu
}
DigitNumberInputMenu.prototype.isDigiChp = function () {
    return (this.m_digiType === "digiChp")
}

DigitNumberInputMenu.prototype.Gen_Digit_Table = function () {
    function _td(num, clsname) {
        var s = `<td><button class='digit  ${clsname}' title='${clsname}'>${num}</button></td>`;
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

    var _This = this;
    var s = gen_trs(this.m_classname);
    $(this.m_tbody).html(s).find("button").attr("disabled", true);


    $(this.m_displayId).bind("click", function () {
        $(this).text("")
        if (_This.isDigiChp()) {//Chp Digi Key
            _This.init_chap_digiKeys_by_vol()

            _This.m_nextDigiMenu.set_showupVal("")
            _This.m_nextDigiMenu.disable_all_digiKey(true)
        } else {
            _This.init_verse_digiKeys_by_vol()
        }
    });
}


DigitNumberInputMenu.prototype.init_chap_digiKeys_by_vol = function () {
    var vol = $(this.m_volID).attr("volcode")
    var chp = this.get_showupVal()
    var _THIS = this

    function _enable_key(vol, chp) {
        $(_THIS.m_tbody).find(".digit").each(function () {
            var dici = parseInt($(this).text());
            var schp = (chp * 10 + dici)
            if (undefined === _Max_struct[vol][schp]) {
                $(this).attr("disabled", true);
            } else {
                $(this).attr("disabled", false);
            }
        });
    }

    if (!vol) {
        $(this.m_tbody).find(".digit").attr("disabled", true);
        return
    }
    var iMaxChap = Object.keys(_Max_struct[vol]).length;
    if (0 === chp) {
        if (iMaxChap >= 9) {
            $(this.m_tbody).find(".digit").attr("disabled", false);
            $(this.m_tbody).find(".digit:contains('0')").attr("disabled", true);
        } else {
            _enable_key(vol, chp)
        }
    } else {
        _enable_key(vol, chp)
    }
}

DigitNumberInputMenu.prototype.init_verse_digiKeys_by_vol = function () {
    var vol = $(this.m_volID).attr("volcode")
    var chp = this.m_nextDigiMenu.get_showupVal()
    var vrs = this.get_showupVal()

    function _enable_key(vol, chp, vrs, dici) {
        var vrs = (vrs * 10 + dici)
        return (undefined === _Max_struct[vol][chp][vrs])
    }


    if (!vol || !chp) {
        $(this.m_tbody).find(".digit").attr("disabled", true);
        return
    }
    var iMaxVrs = Object.keys(_Max_struct[vol][chp]).length;
    if (0 === vrs) {
        if (iMaxVrs >= 9) {
            $(this.m_tbody).find(".digit").attr("disabled", false);
            $(this.m_tbody).find(".digit:contains('0')").attr("disabled", true);
        } else {
            $(this.m_tbody).find(".digit").each(function () {
                var dici = parseInt($(this).text());
                var bret = _enable_key(vol, chp, vrs, dici)
                $(this).attr("disabled", bret);
            });
        }
    } else {
        $(this.m_tbody).find(".digit").each(function () {
            var dici = parseInt($(this).text());
            var bret = _enable_key(vol, chp, vrs, dici)
            $(this).attr("disabled", bret);
        });
    }
}
DigitNumberInputMenu.prototype.disable_all_digiKey = function (b) {
    $(this.m_tbody).find(".digit").attr("disabled", b);
}

DigitNumberInputMenu.prototype.get_showupVal = function () {
    var chap = $(this.m_displayId).text()
    var ichap = parseInt(chap)
    if (!Number.isInteger(ichap)) {
        ichap = 0;
    }
    return ichap
}
DigitNumberInputMenu.prototype.set_showupVal = function (i) {
    $(this.m_displayId).text(i)
}
DigitNumberInputMenu.prototype.add_showupVal = function (i) {
    var _THIS = this
    var icap = _THIS.get_showupVal()
    var iupdateCap = icap * 10 + parseInt(i);
    _THIS.set_showupVal(iupdateCap);
}

DigitNumberInputMenu.prototype.on_Click_digitKey = function (cbfLoadBible) {
    var _THIS = this

    $(this.m_tbody).find("." + _THIS.m_classname).bind("click", function () {
        var dici = $(this).text();
        _THIS.add_showupVal(dici)

        if (_THIS.isDigiChp()) {//Chp Digi Key
            _THIS.init_chap_digiKeys_by_vol()
            _THIS.m_nextDigiMenu.init_verse_digiKeys_by_vol()
        } else {
            _THIS.init_verse_digiKeys_by_vol()
        }
        cbfLoadBible()
    });
    if (_THIS.isDigiChp()) {//Chp Digi Key 
        _THIS.m_nextDigiMenu.disable_all_digiKey(true)
    }
}

DigitNumberInputMenu.prototype.onclick_NextChp = function (i) {

}






function VolumesMiniSelectTable(tid) {
    this.m_id = tid; //"Tab_vol"
}
VolumesMiniSelectTable.prototype.init = function () {
    $(this.m_id).bind("click", function () {
        $(this).hide()
    }).hide()
}
VolumesMiniSelectTable.prototype.get_selary = function () {
    var vol_arr = []
    $(".v3.hili").each(function () {
        var svol = $(this).text();
        vol_arr.push(svol);
    });
    return vol_arr
}
VolumesMiniSelectTable.prototype.Gen_Vol_trs = function (vol_arr) {
    var trarr = [];
    vol_arr.forEach(function (vol, i) {
        var hili = "";//(0 === i) ? "hili" : ""
        var cls = ` class='v3 ${hili} ${CNST.BibVol_OTorNT(vol)}' `;
        //<td align='right'>"+BibVolName[vol][0]+"</td>
        var iMaxChap = Object.keys(_Max_struct[vol]).length;
        trarr.push(`<tr><td ${cls} title=' ${CNST.BibVolNameEngChn(vol)}'>${vol}</td><td>${CNST.BibVolNameEngChn(vol)}</td><td>${iMaxChap}</td></tr>`);
    });
    return trarr.join("");
}


VolumesMiniSelectTable.prototype.Gen_Vol_Table = function (cap, vol_arr, x, y) {
    var tid = this.m_id;

    var bcr = $("#menuContainer")[0].getBoundingClientRect();
    $(tid).css('top', y).css('left', bcr.x).show()


    var trs = this.Gen_Vol_trs(vol_arr);
    //$("#vol_cap_sub").text("");
    $("#vol_capx").text(cap);


    //$("#BibleInputCap").text(CNST.BibVolNameEngChn(vol_arr[0]));
    tid += " tbody"
    $(tid).html(trs).find(".v3").bind("click", function () {

        $(".v3.hili").removeClass("hili");
        $(this).addClass("hili");

        var vol = $(this).text();
        $("#BibleInputCap").text(CNST.BibVolNameEngChn(vol)).attr("volcode", vol);

        d1.init_chap_digiKeys_by_vol()
        d2.disable_all_digiKey(true)

        Uti.Msg(vol + " : maxChap = " + Object.keys(_Max_struct[vol]).length + "\n\n\n");
        //update_digit_cap(tid);
    });
    //update_digit_cap(tid);
};







function Tab_mark_bcv_history() {
    this.m_tabid = "#Tab_mark_bcv_history"
    this.m_vcvHistory = {}
}
Tab_mark_bcv_history.prototype.onClickHistoryItem = function (onClickHistoryItm) {
    this.m_onClickHistoryItm = onClickHistoryItm

    var _THIS = this
    $(this.m_tabid + " #loadhistory").bind("click", function () {
        _THIS.onclick_load_vcv_history(true)
    })
    $(this.m_tabid + " #sort_history_by_vcvID").bind("click", function () {
        _THIS.onclick_load_vcv_history(false)
    })
}
Tab_mark_bcv_history.prototype.addnew = function (vcv, tm) {
    this.m_vcvHistory[vcv] = (!tm) ? (new Date()).toISOString() : tm
    this.update_tab(true)
}
Tab_mark_bcv_history.prototype.gen_trs_sort_by_time = function (bSortByTime) {
    var _THIS = this
    var ar = []
    Object.keys(this.m_vcvHistory).forEach(function (vcv, i) {
        var tm = ""
        if (bSortByTime) {
            tm = _THIS.m_vcvHistory[vcv]
        }
        ar.push(`<tr><td title='${tm}'>${vcv}</td></tr>`)
    });

    ar.reverse()
    return ar.join()
}
Tab_mark_bcv_history.prototype.update_tab = function (bSortByTime) {
    var _THIS = this
    var trs = this.gen_trs_sort_by_time(bSortByTime)
    $(this.m_tabid + " tbody").html(trs).find("td").bind("click", function () {
        var vcv = $(this).text()
        var par = Uti.vcv_parser(vcv)
        $("#BibleInputCap").attr("volcode", par.vol).text(par.vol)
        $("#chp_num").text(par.chp)
        $("#vrs_num").text(par.vrs)

        if (_THIS.m_onClickHistoryItm) _THIS.m_onClickHistoryItm()
    })
}
Tab_mark_bcv_history.prototype.init = function () {

}
Tab_mark_bcv_history.prototype.onclick_load_vcv_history = function (bSortByTime) {
    var _THIS = this
    var inp = { Search: { File: RestApi.HistFile.__history_verses_loaded } };
    var prm = { api: RestApi.ApiBibleObj_access_regex_search_history, inp: inp };
    Jsonpster.Run(prm, function (ret) {
        //history
        console.log(ret);
        _THIS.read_history_to_Obj(ret);
        _THIS.update_tab(bSortByTime)

    });
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











function Tab_Cat() {
    this.m_tabid = "#Tab_cat"
}
Tab_Cat.prototype.Gen_Cat_Table = function (cbf) {

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
        $(".cat").removeClass("hili");
        var scat = $(this).addClass("hili").text();

        if (cbf) cbf(scat)
        //if (document.m_current_cat === scat) {
        //
        //} else {
        //    //document.m_current_cat = scat;
        //    var vol_arr = CNST.Cat2VolArr[scat];
        //    tabsel.Gen_Vol_Table(scat, vol_arr);
        //}

    });
}




var catab = new Tab_Cat()
var markHistory = new Tab_mark_bcv_history()



var d1 = new DigitNumberInputMenu("digiChp", "#DigitOfChapter", "chp_num");
var d2 = new DigitNumberInputMenu("digiVrs", "#DigitOfVerse", "vrs_num");
d1.set_Neightbor(d2)
d2.set_Neightbor(d1)

var tabsel = new VolumesMiniSelectTable("#Tab_vol")
var bkntab = new BookNamesListTable("#Tab_bkn")


var BibleInputMenu = function () {
}
BibleInputMenu.prototype.init = function () {


    $("body").prepend(BibleInputMenuContainer);
    $("#menuContainer").draggable();

    
    $("#externalinkMenu").draggable()
    $("#externalinkMenu").bind("click", function () {
        $("#externalinkMenu").hide()
    }).hide()


    tabsel.init()
    catab.Gen_Cat_Table(function (scat) {
        var vol_arr = CNST.Cat2VolArr[scat];
        tabsel.Gen_Vol_Table(scat, vol_arr);
    })

    //this.Gen_Keys_Menu();
    var _This = this
    var sikm = new SingleKeyInputMenu()

    sikm.gen_menu(function (ch, volary, x, y) {
        tabsel.Gen_Vol_Table(ch, volary, x, y)
        d1.disable_all_digiKey(true)
        d2.disable_all_digiKey(true)
    })

    bkntab.Gen_BKN_Table({
        onClick: function () {
            _This.loadBible_chp();
        }
    });



    d1.Gen_Digit_Table()
    d2.Gen_Digit_Table()

    d1.on_Click_digitKey(function () {
        _This.loadBible_chp();
    })
    d2.on_Click_digitKey(function () {
        _This.scrollToView_Vrs()
    })

    markHistory.onClickHistoryItem(function () {
        _This.loadBible_chp()
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









    Ext_Link_Menu.setup_links()
};




BibleInputMenu.prototype.scrollToView_Vrs = function () {
    var parmBook = this.get_selected_vcv_parm()
    var bkchvr = parmBook.vol + parmBook.chp + ":" + parmBook.vrs
    $(".vid").each(function () {
        var txt = $(this).text()
        if (txt === bkchvr) {
            $(this)[0].scrollIntoViewIfNeeded()
            $(this).addClass("hiliScroll2View");
        }
    })
};///




BibleInputMenu.prototype.get_selected_vcv_parm = function () {
    var vol = $("#BibleInputCap").attr("volcode");
    var chp = $("#chp_num").text();
    var vrs = $("#vrs_num").text();
    var ob = { vol: vol, chp: chp, vrs: vrs }
    return ob;
};
BibleInputMenu.prototype.get_selected_bc_bibOj = function () {
    var parm = this.get_selected_vcv_parm()

    var ob = {}
    ob[parm.vol] = {}
    ob[parm.vol][parm.chp] = {}
    if (parm.vrs) {
        //ob[parm.vol][parm.chp][parm.vrs] = parm.vrs
    }
    return ob;
};
BibleInputMenu.prototype.loadBible_chp = function () {
    var _THIS = this
    var bibOj = this.get_selected_bc_bibOj();
    console.log("Obj=", bibOj);
    var fnamesArr = bkntab.get_selected_bkn_fnamesArr();
    var inp = { fname: fnamesArr, bibOj: bibOj, Search: null };
    var par = { api: RestApi.ApiBibleObj_load_Bkns_Vols_Chp_Vrs, inp: inp };
    console.log("RestApi:", RestApi)
    console.log("loadpar:", par)
    Uti.Msg(par);
    Jsonpster.Run(par, function (ret) {
        apiCallback_Gen_clientBibleObj_table(ret)
    });
    setTimeout(function () {
        _THIS.scrollToView_Vrs()
    }, 2100)
    return bibOj;
};///
BibleInputMenu.prototype.get_selected_load_parm = function () {
    //
    var fnamesArr = bkntab.get_selected_bkn_fnamesArr();
    var vcvpar = this.get_selected_vcv_parm();
    var bibOj = Uti.get_xOj(vcvpar);
    var ret = { fname: fnamesArr, bibOj: bibOj, Search: null };

    return ret;
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
OutputBibleTable.prototype.Gen_clientBibleObj_table = function (ret) {
    function editing_save(_This) {
        var old = $(_This).attr("oldtxt");
        var fil = $(_This).attr("title");
        var txt = $(_This).text();
        var vid = $(_This).attr("vid");
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

        var mat = vid.match(/^(\w{3})(\d+)\:(\d+)$/);
        if (!mat) {//Gen1:1
            alert("edi save err:" + vid + ":" + txt);
            return;
        }
        var dat = {}
        dat.vol = mat[1];
        dat.chp = mat[2];
        dat.vrs = mat[3];
        dat.txt = txt;

        //var _This = this;
        var inp = { fname: [fil], vcvx: dat };
        var par = { api: RestApi.ApiBibleObj_update_notes, inp: inp };
        Jsonpster.Run(par, function () {
            Uti.Msg(par);
            var stx = txt.substr(0, 5) + " ... " + txt.substr(txt.length - 15);
            Uti.Msg(stx);
            $(_This).removeClass("edit_keydown").removeClass("editing");
            $(_This).parent().append(`<a class='ok'> [${stx}](Saved!)</a>`);
        });
    };


    var tb = Uti.gen_clientBibleObj_table(ret);
    Uti.Msg("tot=" + tb.size);
    $(this.m_tbid).html(tb.htm);
    table_sort("#BibOut");
    $(this.m_tbid).find("td.vid").bind("click", function () {
        var _This = this;
        $(".vid.vmark").removeClass("vmark");
        $(_This).toggleClass("vmark");
        var bcr = $(this)[0].getBoundingClientRect();
        console.log(bcr)
        var y = bcr.y + window.scrollY - $("#externalinkMenu").height()
        $("#externalinkMenu").css('top', y).slideToggle();
        //$("#externalinkMenu").toggle("'slide', {direction: 'up' }, 1000");//()

        var vid = $(this).text();
        $("#externalinkMenu").find("caption").text(vid).focus()

        markHistory.addnew(vid)

        var inp = { Search: { File: RestApi.HistFile.__history_verses_loaded, Strn: vid } };
        var prm = { api: RestApi.ApiBibleObj_access_regex_search_history, inp: inp };
        console.log(prm)
        Jsonpster.Run(prm, function (ret) {
            Uti.Msg(vid + " is stored in history; and ref is available.");
        });
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
    $(this.m_tbid).find(".tx").bind("click", function () {
        $(".ok").remove();
        $(this).toggleClass("hili2");
        var rsn = $(this).prev().attr("title");
        var txt = $(this).text();
        var vcv = $(this).parentsUntil("tbody").find("td:eq(0)").text();
        txt = `"${txt}" (${vcv} ${rsn})`;
        Uti.Msg(txt + " (" + vcv + ")");
        //copy to clipboard.
        if ($(this).attr("contenteditable")) {
            //nop
        } else {
            $("#CopyTextToClipboard").val(txt);
            $("#CopyTextToClipboard").select();
            document.execCommand("copy");
        }
    });
    this.setFontSize(0);
}
OutputBibleTable.prototype.setFontSize = function (n) {
    if (undefined === document.m_tx_fontSize) {
        document.m_tx_fontSize = 16;
    }
    document.m_tx_fontSize += n;
    $(this.m_tbid + " table .tx").css("font-size", document.m_tx_fontSize);
}



var gobt = new OutputBibleTable()

function apiCallback_Gen_clientBibleObj_table(ret) {
    gobt.Gen_clientBibleObj_table(ret)
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
    $("a[vid]").each(function (idx) {
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
        var inp = { Search: { File: RestApi.HistFile.__history_regex_search, Strn: str } };
        var prm = { api: RestApi.ApiBibleObj_access_regex_search_history, inp: inp };
        console.log(prm)
        Jsonpster.Run(prm, function () {
            Uti.Msg("found");
        });
    };
};
function onclick_BibleObj_search_str() {
    var s = $("#sinput").val().trim();
    var inp = gBim.get_selected_load_parm();
    inp.Search = bkntab.get_selected_Search_Parm();
    if (!Uti.validateSearch(inp)) return;
    console.log(inp);
    var par = { api: RestApi.ApiBibleObj_load_Bkns_Vols_Chp_Vrs, inp: inp };
    console.log(par)
    Uti.Msg(par);
    Jsonpster.Run(par, apiCallback_Gen_clientBibleObj_table);

    console.log(Jsonpster);
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
    var inp = { Search: { File: RestApi.HistFile.__history_regex_search, Strn: null } };//readonly.
    var prm = { api: RestApi.ApiBibleObj_access_regex_search_history, inp: inp };
    Jsonpster.Run(prm, function (ret) {
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







var Uti = {
  
    validateSearch: function (inp) {
        if (!inp.Search.File) {
            alert("no searchFile");
            return false;
        }
        if (inp.Search.Strn.length == 0) {
            alert("no searchStrn");
            return false;
        }
        return true;
    },


    Msg: function (dat) {
        var str = dat;
        if ("object" === typeof dat) {
            str = JSON.stringify(dat, null, 4);
        }
        var results = str + "\n" + $("#searchResult").val();
        //results = results.substr(0, 60);
        $("#searchResult").val(results);
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
    vcv_parser: function (vid) {
        vid = vid.replace(/\s/g, "");
        if (vid.length === 0) return alert("please select an item first.");
        var ret = { vol: "", chp: "", vrs: "" };
        var mat = vid.match(/^(\w{3})\s{,+}(\d+)\s{,+}[\:]\s{,+}(\d+)\s{,+}$/);
        var mat = vid.match(/^(\w{3})\s+(\d+)\s+[\:]\s+(\d+)\s+$/);
        var mat = vid.match(/^(\w{3})(\d+)\:(\d+)$/);
        if (mat) {
            ret.vol = mat[1];
            ret.chp = mat[2];
            ret.vrs = mat[3];
        } else {
            alert("vid=" + vid + "," + JSON.stringify(ret));
        }
        ret.chp3 = ret.chp.padStart(3, "0");
        ret._vol = "_" + ret.vol;
        return ret;
    },

    get_xOj: function (par) {
        if (!par.vol_arr) par.vol_arr = [par.vol]
        return Uti.get_bibOj(par.vol_arr, par.chp, par.vrs);
    },
    get_bibOj: function (vol_arr, chp, vrs) {
        if ("object" != typeof vol_arr) {
            alert("assertion failed: vol must be arry");
            console.log(vol_arr)
            return null;
        }
        if (!vol_arr === 0) {
            //alert("vol_arr is empty");
            return {};
        }
        var bibOj = {};
        ////vol
        var vol = "";
        for (var i = 0; i < vol_arr.length; i++) {
            vol = vol_arr[i];
            if (undefined === _Max_struct[vol]) {
                alert("invalide vol=" + vol);
                return null;
            }
            bibOj[vol] = {};
        }
        if (vol_arr.length > 1) {//for cat or multiple vol names.
            return bibOj;
        };////////////////////////////////////////////////
        ////////
        //vol 1, chp
        //
        if (chp.length == 0) { return bibOj; }
        if (isNaN(chp)) {
            console.log("chp isNaN:", chp);
            return bibOj;
        }
        if (undefined === _Max_struct[vol][chp]) {
            alert("ERR:\n" + vol + "_" + chp + "\n not exist.")
            return null;
        }
        bibOj[vol][chp] = {};
        /////
        //vrs
        if (vrs.length === 0) { return bibOj; }

        if (isNaN(vrs)) {
            console.log("vrs isNaN:", vrs);
            return bibOj;
        }
        if (undefined === _Max_struct[vol][chp][vrs]) {
            alert("ERR:\n" + vol + "_" + chp + ":" + vrs + " not exist.")
            return null;
        }
        bibOj[vol][chp][vrs] = "";
        return bibOj;
    },

    gen_clientBibleObj_table: function (ret) {
        var idx = 0, st = "";
        $.each(ret, function (vol, chpObj) {
            $.each(chpObj, function (chp, vrsObj) {
                $.each(vrsObj, function (vrs, val) {
                    //console.log("typeof val=", typeof val);
                    idx++;
                    var vid = vol + "<br>" + chp + ":" + vrs;
                    st += "<tr><td class='vid'>" + vid + "</td><td>";
                    if ("object" == typeof val) {
                        $.each(val, function (key, str) {
                            var vid = vol + chp + ":" + vrs;
                            st += `<div><input type='checkbox' title='${key}'/><a class='tx tx${key}' vid='${vid}'>${str}</a></div>`;
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
        s += "<thead><th>vcv</th><th>scripts</th></thead>";
        s += "<tbody>";
        s += st;

        s += "</tbody></table>";
        return { htm: s, size: idx };
    },
};////  Uti
////////////////////////////////////
const CNST = {
}



var BibleInputMenuContainer = `
<style>
    body {
        background-color: black;
        color: white;
        width: 100%;
        font-size: 100%;

        padding: 0px 0px 0px 0px;
        margin: 0px 0px 0px 0px;

        font-family: 'Times New Roman';
    }
</style>

<div id="menuContainer">
    <div id="BibInputMenuHolder">
        <div id="ID_BibleInputMenuContainer">

            <!----------------------------->

            <table border="1" id="Tab_BibleSingleInputKey">
                <caption><a id="BibleInputCap">Bible Input Keys</a> <button class='chapvrsnum' id='chp_num'></button>:<button class='chapvrsnum' id='vrs_num'></button></caption>
                <thead id=""></thead>
                <tbody id=""></tbody>
            </table>

            <!----------------------------->

            <table id='Tab_chp'  style="float:;">
                        
                <thead id=""></thead>
                <tbody id=''>
                    <tr id='DigitOfChapter'>
                        <td></td>
                    </tr>
                    <tr id='DigitOfVerse'>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <!----------------------------->
            <table id="Tab_vol" border="1" style="float:left;">
                <caption class='vcvCap' id='vol_capx' title=''></caption>
                <thead id=""></thead>
                <tbody id=''>

                </tbody>
            </table>


            <table border="1" style="float:left;" id="Tab_cat">
                <caption class='' id='' title='Volumns Catagory'>Cat</caption>
                <thead id=""></thead>
                <tbody id=''>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <table id="Tab_bkn" border="1" style="float:left;">
                <caption class='bbbCap' id='bkn_cap' title='Biblical Book Name'>BKN</caption>
                <thead id=""></thead>
                <tbody id=''>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            
            <table id="Tab_mark_bcv_history" border="1" style="float:left;">
                <caption>
                   <button id="loadhistory"  title='load history sort by time'>h</button>
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
        <div id="ID_Explore">

            <input id="sinput" cols='50' onclick="onclick_load_search_string_history();" ></input><br>

            <button onclick="onclick_BibleObj_search_str();" title="search on svr">search</button>
            <button onclick="onclick_regex_match_next(-1);" title="find on page">Prev</button>
            <button onclick="onclick_regex_match_next(1);" title="find on page">Next</button>
            
           
            <button onclick="$('#searchResult').val('');" title='clearout txt'>x</button>
            <br>
            

            

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


            <textarea id="searchResult" cols='50' rows='20'  value='search results...' title='load search history.'>
                </textarea><br>

        
            
        </div>
    </div>
    <div id="others">
            <table id='tmpsel2ref' border="1" align="left">
                <thead></thead>
                <tbody>
                </tbody>
            </table>


            <div id="othersx">
        <button id="oBible_indxer">indxer</button>
        <button id="Compare_vcv">Compare_vcv</button>
        <a href='../index.htm'>ref</a>

        <table border="1">
            <thead>
                <tr>
                    <td>#</td>
                    <td>Vol</td>
                    <td>Chp</td>
                    <td>Ver</td>
                </tr>
            </thead>
            <tbody id="StructAna"></tbody>
        </table>
        <input id="CopyTextToClipboard" title="CopyTextToClipboard"/><br>
        <button onclick="gobt.setFontSize(10);" title='font-size plus'>f+</button><button onclick="gobt.setFontSize(-10);">f-</button>
    </div>

        </div>

    

</div>
<hr />
<button id="menuToggler" onclick="$('#menuContainer').slideToggle();">-</button>


<div id="externalinkMenu">
    <table id='refslist' border="1" align="left">
    
    <tbody>
        <tr>
            <td>
                <a id="blb" ref="https://www.blueletterbible.org/kjv/">blueletter</a>
            </td>
        </tr>
        <tr>
            <td>
                <a id="h_g" ref="../../../../../../../___bigdata/unzipped/rel/ham12/hgsbible/hgb/" title='Hebrew_Greek'>h_g</a>
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

CNST.BibVolName = {
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
    return CNST.BibVolName[Vid][0] + " " + CNST.BibVolName[Vid][2];
};
CNST.BibVol_OTorNT = function (Vid) {
    var ary = Object.keys(CNST.BibVolName)
    var idx = ary.indexOf(Vid)
    if (idx >= 38) {
        return "NT"
    }
    return "OT";
};
CNST.BibVolName_Studylight = function (Vid) {
    return CNST.BibVolName[Vid][1];
};
CNST.BibVolName_ccel = function (Vid) {
    return CNST.BibVolName[Vid][0];
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
CNST.OT_Vols_Ary = [
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
CNST.NT_Vols_Ary = [
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
    "OT": CNST.OT_Vols_Ary,
    "Moses": ["Gen", "Exo", "Lev", "Num", "Deu"],
    "History": ["Jos", "Jug", "Rut", "1Sa", "2Sa", "1Ki", "2Ki", "1Ch", "2Ch", "Ezr", "Neh", "Est"],
    "Literature": ["Job", "Psm", "Pro", "Ecc", "Son"],
    "MajorPr": ["Isa", "Jer", "Lam", "Eze", "Dan"],
    "MinorPr": ["Joe", "Amo", "Oba", "Jon", "Mic", "Nah", "Hab", "Zep", "Hag", "Zec", "Mal"],
    "NT": CNST.NT_Vols_Ary,
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

