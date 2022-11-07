var Sitemapper = require('sitemapper');
var cheerio = require('cheerio');
const axios = require("axios");

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
  axios.get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    console.log("pagetitle:  " + $('title').text());
  })
  .catch(console.log);
}

function getContentTitle(html) {
  
}
