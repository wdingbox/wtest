

const fs = require('fs');
var path = require('path');
//var cheerio=require("cheerio"); //>> npm install cheerio
 

   




function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + "," + hour + ":" + min + ":" + sec;

}
var dt=getDateTime();
console.log(dt);
//return;

function access_log_to_json(){
  var log=fs.readFileSync("/var/log/apache2/access_log","utf8");
  var lnarr=log.split(/[\n|\r]/);
  console.log(lnarr.length);
  var ret={};
  lnarr.forEach(function(line,i){
    var nodarr=line.split(/[\s]{1,}/);
    console.log(nodarr);
  });
}
access_log_to_json();