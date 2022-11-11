var Sitemapper = require('sitemapper');
var cheerio = require('cheerio');
const axios = require("axios");
const fs = require('fs');

var settings = require('./settings.js');

var sitemap = settings.sitemap;
var sitemapper = new Sitemapper();
sitemapper.timeout = 5000;

const dataFolder = "./data";
checkDataPath(dataFolder);

sitemapper.fetch(sitemap)
  .then(function (sites) {
    getSite(sites);
  })
  .catch(function (error) {
    console.log(error);
  });

async function getSite(sites) {
  const setTimeout = require('timers/promises');
  var url = sites.sites[0];
  axios.get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    f = dataFolder + "/" + urlToFileName(url);
    console.log("pagetitle:  " + $('title').text());
    let data = {
      url: url,
      title: $('title').text()
    }
    saveFile(f, data);
  })
  .catch(console.log);
}
function saveFile(path, data) {
  const jsonStr = JSON.stringify(data);
  if (isExistFile(path) == true) {
    return;
  }
  fs.writeFile(path, jsonStr, (err) => {
    if (err) rej(err);
    if (!err) {
      console.log(data);
    }
  });
}
function urlToFileName(url) {
  const sl = url.indexOf("//");
  let filename = url.substring(sl+2);
  return filename.replaceAll("/", "-") + ".json";
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