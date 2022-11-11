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
  var url = sites.sites[0];
  axios.get(url)
  .then((response) => {
    const $ = load(response.data);
    const f = dataFolder + "/" + urlToFileName(url);
    console.log("pagetitle:  " + $('title').text());
    let data = {
      url: url,
      title: $('title').text()
    }
    saveFile(f, data);
  })
  .catch(console.log);
  await setTimeout(1000);
}
function saveFile(path, data) {
  const jsonStr = JSON.stringify(data);
  if (isExistFile(path) == true) {
    return;
  }
  writeFile(path, jsonStr, (err) => {
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
  if (!existsSync(path)) {
    mkdirSync(path);
  }
}

function isExistFile(file) {
  try {
    statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}