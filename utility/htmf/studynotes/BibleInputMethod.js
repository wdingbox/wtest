














var Uti = {
    validateBibleLoad: function (inp) {
        if (null === inp.bibOj) {
            //alert("bibOj=null");
            return false;
            if (confirm("load the whole Bible?")) {
                inp.bibOj = {};
            } else {
                return false;
            }
        }
        if (inp.fname.length === 0) {
            alert("Please select a biblical BooK Name.");
            return false;
        }
        var volArr = Object.keys(inp.bibOj);
        if (volArr.length >= 66) {
            var s = JSON.stringify(inp);
            s += "\n\nLoad whole Bible vol=" + volArr.length + "\nContinue?";
            return confirm(s);
        }
        return true;
    },
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
    scrollIntoViewIfNeeded_to_vid(vid) {
        //var vid = $(this).text().trim();
        $(".vid.hiliScroll2View").removeClass("hiliScroll2View");
        var bfind = false;
        $("#oBible").find(".vid").each(function () {
            var vid2 = $(this).text().trim();
            if (vid === vid2) {
                $(this)[0].scrollIntoViewIfNeeded();
                $(this).addClass("hiliScroll2View");
                bfind = true;
            }
        });
        return bfind;
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
    get_cha_arr_after_str: function (str, BibleObjStruct) {
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
        return ks;
    },
    Get_Vol_Arr_from_KeyChar: function (ch, BibleObjStruct) {
        var arr = [];
        Object.keys(BibleObjStruct).forEach(function (vol) {
            if (vol.indexOf(ch) == 0) {
                arr.push(vol);
            };
        });
        return arr;
    },
    Gen_Vom_trs: function (vol_arr) {
        var cls = " class='v3 hili' ";
        var trarr = [];
        vol_arr.forEach(function (vol) {
            //<td align='right'>"+BibVolName[vol][0]+"</td>
            trarr.push("<tr><td" + cls + "title='" + CNST.BibVolNameEngChn(vol) + "'>" + vol + "</td></tr>");
            cls = " class='v3' ";
        });
        return trarr.join("");
    },
    validate_vcv_xxxxxx: function (vol, chp, vrs) {
        if (undefined == _Max_struct[vol]) return alert("fatal err vol=" + vol);
        else if (undefined == _Max_struct[vol][chp]) {
            var ichp = parseInt(chp);
            if (Number.isInteger(ichp)) {
                var max = Object.keys(_Max_struct[vol]).length;
                if (parseInt(chp) > max) {
                    return alert("input chp=" + chp + ":\n" + vol + " max chapter is " + max);
                }
            }

        }
        else if (undefined == _Max_struct[vol][chp][vrs]) {
            var ivrs = parseInt(vrs);
            if (Number.isInteger(ivrs)) {
                var max = Object.keys(_Max_struct[vol][chp]).length;
                if (parseInt(vrs) >= max) {
                    return alert("input vrs=" + vrs + ":\n" + vol + " " + chp + " max verse is " + max);
                }
            }
        }
        return true;
    },
    get_xOj: function (par) {
        return Uti.get_bibOj(par.vol_arr, par.chp, par.vrs);
    },
    get_bibOj: function (vol_arr, chp, vrs) {
        if ("object" != typeof vol_arr) {
            alert("assertion failed: vol must be arry");
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
            <table border="1" id="Tab_BibleSingleInputKey">
                <caption id="BibleInputCap">Bible Input Keys</caption>
                <thead id=""></thead>
                <tbody id=""></tbody>
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
            <table border="1" style="float:left;" id="Tab_cat">
                <caption class='' id='' title='Volumns Catagory'>Cat</caption>
                <thead id=""></thead>
                <tbody id=''>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <table id="Tab_vol" border="1" style="float:left;">
                <caption class='vcvCap' id='vol_capx' title='volunm name'>V<sub id="vol_cap_sub">0</sub></caption>
                <thead id=""></thead>
                <tbody id=''>

                </tbody>
            </table>

            <table id='Tab_chp' border="1" style="float:;">
                <caption>
                    <a onclick='onclick_NextChp(-1)'>chp-</a>
                    <button class='digiCap' id='chp_cap' onclick='onclick_NextChp(0)' title='chapter'>*</button>
                    <a onclick='onclick_NextChp(+1)'> + &nbsp; </a>
                    </caption>
                <thead id=""></thead>
                <tbody id=''>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <a style="float:;"></a>

            <table id="Tab_vrs" border="1" style="float;">
                <caption>vrs <button class='digiCap' id='vrs_cap' title='verse'>*</button>
                    <button id="loadVolChpVrs" onclick='onclick_load_BknVolChpVrs();' title='Load Bible'>.</button>
                    </caption>
                <thead id=""></thead>
                <tbody id="">
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            



        </div>
        <div id="ID_Explore">

            <input id="sinput" cols='50' onclick="onclick_load_search_string_history();" ></input><br>

            <button onclick="onclick_BibleObj_search_str();" title="search on svr">search</button>
            <button onclick="onclick_regex_match_next(-1);" title="find on page">Prev</button>
            <button onclick="onclick_regex_match_next(1);" title="find on page">Next</button>
            
            <button id="loadhistory" onclick='onclick_load_vcv_history(1);' title='load history sort by time'>h</button>
            <button id="sort_history_by_vcvID" onclick='onclick_load_vcv_history(0);' title='load history sort by str'>^</button>
            <button onclick="$('#searchResult').val('');" title='clearout txt'></button>
            <br>
            <textarea id="searchResult" cols="50"  value='search results...' title='load search history.'>
                </textarea><br>

            

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

            <table id="Tab_load_vcv_history" border="1" style="float:left;">
                <caption><span id='loads_buttons'>
                        <span>
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
    </div>
    <div id="others">
            <table id='tmpsel2ref' border="1" align="left">
                <thead></thead>
                <tbody>
                </tbody>
            </table>

            <table id='refslist' border="1" align="left">
                <!--thead><th>#</th><th>vcv</th><th>refs</th></thead--->
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
                            <a id="gtw" ref="https://www.biblegateway.com/passage/?search=" title='biblegateway.com'>gateway</a></caption>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a id="studylight" ref="https://www.studylight.org/commentary/" title='studylight.org'>studylight</a></caption>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a id="ccel_org" ref="http://www.ccel.org/study/" title='ChristianClassicEtherealLib'>ccel</a></caption>
                        </td>
                    </tr>
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
        <button onclick="txFontsizeIncrs(10);" title='font-size plus'>f+</button><button onclick="txFontsizeIncrs(-10);">f-</button>
    </div>

        </div>

    

</div>
<hr />
<button id="menuToggler" onclick="$('#menuContainer').slideToggle();">-</button>
<div id='oBible'>----</div>

        `;//////backtick for multiple lines. 

function txFontsizeIncrs(n) {
    if (undefined === document.m_tx_fontSize) {
        document.m_tx_fontSize = 16;
    }
    //var fsize=$("#oBible table .tx").css("font-size");
    document.m_tx_fontSize += n;
    $("#oBible table .tx").css("font-size", document.m_tx_fontSize);
}

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
        "_bnotes": "personal biblical study notes",
        "_crf": "cross-references",
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

