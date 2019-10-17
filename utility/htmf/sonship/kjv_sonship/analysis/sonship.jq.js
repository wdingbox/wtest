


function gen_table_nt(Sons) {
    var arr = Object.keys(Sons);
    var st = "<table border='1'>";
    st += "<thead><tr><th>#</th><th>vrs</th><th>txt</th><th>usg</th><th></th></tr></thead><tbody>"
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i];
        var vrs = Sons[key];
        var idx = vrs.indexOf("G5207 of");
        var patternOf = "";
        if (vrs.indexOf("Son") >= 0 || vrs.indexOf("G5207 of God") >= 0) {
            patternOf = "Son";
        } else {
            var idx = vrs.indexOf("G5207 of");
            if (idx >= 0) {
                patternOf = vrs.substr(idx, 25);
            } else {
                var mat = vrs.match(/father/ig);
                if (mat) {
                    patternOf = "father";
                }
            }
        }
        st += `<tr><td>${i}</td><td>${key}</td><td>${vrs}</td><td>${patternOf}</td><td></td></tr>`;
    }
    st += "</tbody></table>";
    $("#holder").html(st);

    table_sort();
}

















///////////////////////////////////////////////////////////////
//
function sortObjVal(obj) {
    var valsortedObj = {};
    var keys = Object.keys(obj);
    var sarr = [];
    const MAXLEN = 10;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = "" + obj[key];
        var str = val.padStart(MAXLEN, '0') + key;
        sarr.push(str);
    }
    sarr.sort().reverse();
    for (var i = 0; i < sarr.length; i++) {
        var str = sarr[i];
        var val = parseInt(str.substr(0, MAXLEN));
        var key = str.substr(MAXLEN);
        valsortedObj[key] = val;
    }
    return valsortedObj;
}
///////////////////////////////////////////////////////////////
//son-of-xxx = 1109
function gen_table_ot(Sons) {
    var frqObj = [{}, {}, {}];
    var arr = Object.keys(Sons);
    var st = "<table border='1'>";
    st += "<thead><tr><th>#</th><th>vrs</th><th>txt</th><th>usg</th><th></th></tr></thead><tbody>"
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i];
        var vrs = Sons[key];
        var num = [0];
        var pat1 = get_pattern_Upperxx(vrs, num, frqObj[0]);
        var pat2 = get_pattern_lowerxx(vrs, num, frqObj[1]);
        var pat3 = get_pattern3(vrs, num, frqObj[2]);
        st += `<tr><td>${i}</td><td>${key}</td><td>${vrs}</td><td>${num}</td><td>${pat1}</td><td>${pat2}</td><td>${pat3}</td></tr>`;
    }
    st += "</tbody></table>";
    $("#holder").html(st);


    for (var i = 0; i < frqObj.length; i++) {
        var sortedObj = sortObjVal(frqObj[i]);
        frqObj[i] = sortedObj;
    }
    $("#out").val(JSON.stringify(frqObj, null, 4));

    table_sort();
}
function get_pattern3(vrs, num, frqObj) {
    var patternArr = [
        "H1121 and daughters",
        "his son",
        "her son",
        "their son",
        "a son",
        "the son",
        "thy son"
    ];
    for (var i = 0; i < patternArr.length; i++) {
        var pat = patternArr[i];
        var ret = new RegExp(pat, "g");
        if (vrs.match(ret)) {
            num[0]++;
            return pat;
        }
    }
    return "";
}
function get_pattern_Upperxx(vrs, num, frqObj) {
    var mat = vrs.match(/H1121\s+of\s+[A-Z]\w+[\,\.\'\"\s]+[a-zA-Z\,\.\-]+/g);
    if (mat) {
        var pattern = mat[0];
        var mat1 = pattern.match(/H1121\s+of\s+\w+/g);
        var sky = mat1[0];
        if (undefined === frqObj[sky]) {
            frqObj[sky] = 0;
        }
        frqObj[sky]++;
        num[0]++;
        return pattern;
    }
    return "";
}
function get_pattern_lowerxx(vrs, num, frqObj) {
    var mat = vrs.match(/H1121\s+of\s+[a-z]\w+[\,\.\'\"\s]+[a-zA-Z\,\.\-]+/g);
    if (mat) {
        var pattern = mat[0];
        var sky = pattern;
        if (undefined === frqObj[sky]) {
            frqObj[sky] = 0;
        }
        frqObj[sky]++;
        num[0]++;
        return pattern;
    }
    return "";
}










var ot_stat = {
    "son-of-Xxxx": {
        "frq": 949,
        "son-of-God": {
            "frq": 5
        }
    }
}