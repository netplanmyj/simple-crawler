var Sitemapper = require('sitemapper');
var request = require('request');
var cheerio = require('cheerio');
var settings = require('./settings.js');

var xml = settings.xml;
var sitemapper = new Sitemapper();
sitemapper.timeout = 5000;

sitemapper.fetch(xml)
  .then(function (sites) {
    getSite(sites);
  })
  .catch(function (error) {
    console.log(error);
  });

function getSite(sites) {
  var url = sites.sites[0];
  request(url, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }
    console.log("status: " + response.statusCode);
    if(response.statusCode === 200) {
      var $ = cheerio.load(body);
      console.log("pagetitle:  " + $('title').text());
    }
  });
}
