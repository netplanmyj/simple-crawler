var Sitemapper = require('sitemapper');
var cheerio = require('cheerio');
const axios = require("axios");
const fs = require('fs');

var settings = require('./settings.js');

var xml = settings.xml;
var sitemapper = new Sitemapper();
sitemapper.timeout = 5000;

const dataFolder = "./data";
checkDataPath(dataFolder);

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
    urlToFileName(url);
    console.log("pagetitle:  " + $('title').text());
  })
  .catch(console.log);
}

function urlToFileName(url) {
  const sl = url.indexOf("//");
  var filename = url.substring(sl+2);
  filename = filename.replaceAll("/", "-") + ".json";
  console.log("filename:  " + filename);
}

function checkDataPath(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function isExistFile(file) {
  try {
    fs.statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}