import Sitemapper from 'sitemapper';
import pkg from 'cheerio';
const { load } = pkg;
import axios from "axios";
import { writeFile, existsSync, mkdirSync, statSync } from 'fs';
import { setTimeout } from 'timers/promises';

import { sitemap as _sitemap } from './settings.js';
import { interval as _interval } from './settings.js';

var sitemap = _sitemap;
var sitemapper = new Sitemapper();
sitemapper.timeout = 5000;

sitemapper.fetch(sitemap)
  .then(function (sites) {
    getSite(sites);
  })
  .catch(function (error) {
    console.log(error);
  });
  
async function getSite(sites) {
  var url = sites.sites[0];
  let data = {
    "urls": []
  };
  axios.get(url)
    .then((response) => {
      const $ = load(response.data);
      console.log("pagetitle:  " + $('title').text());
      let json = {
        "url": url,
        "title": $('title').text()
      }
      console.log("axios"+JSON.stringify(json));
      data.urls.push(json);
  })
  .catch(console.log);
  let file = makeFileName(url);
  console.log("data:" + data);
  // let json = JSON.parse(data);
  
  saveFile(file, JSON.stringify(data));
  await setTimeout(1000);
}

function saveFile(filename, data) {
  const dataFolder = "./data";

  if (!existsSync(dataFolder)) {
    mkdirSync(dataFolder);
  }
  
  const filepath = dataFolder + "/" + filename;
  const jsonStr = JSON.stringify(data);
  if (isExistFile(filepath) == true) {
    console.log(filepath + " already exists.");
    return;
  }

  writeFile(filepath, jsonStr, (err) => {
    if (err) rej(err);
    if (!err) {
      console.log(data);
    }
  });
}

function getDomainName(url) {
  let s = url.indexOf("//");
  let domain = url.substring(s+2);
  s = domain.indexOf("/");
  return domain.substring(0, s);
}

function makeFileName(url) {
  let file = getDomainName(url);
  file += "-" + Date.now().toString();
  return file + ".json";
}

function isExistFile(file) {
  try {
    statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}