


function gen_table(Sons) {
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