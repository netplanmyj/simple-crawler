var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var settings = require('./settings.js');

var pageToVisit = settings.url;

console.log("閲覧ページ: " + pageToVisit);
request(pageToVisit, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   // ステータスコードの確認 (200はHTTP OK)
   console.log("ステータスコード: " + response.statusCode);
   if(response.statusCode === 200) {
     // ソース内のdocumentのbodyを解析
     var $ = cheerio.load(body);
     console.log("ページタイトル:  " + $('title').text());
   }
});