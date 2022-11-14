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
  axios.get(url)
  .then((response) => {
    const $ = load(response.data);
    console.log("pagetitle:  " + $('title').text());
    let data = {
      url: url,
      title: $('title').text()
    }
    saveFile(urlToFileName(url), data);
  })
  .catch(console.log);
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

function urlToFileName(url) {
  const sl = url.indexOf("//");
  let filename = url.substring(sl+2);
  return filename.replaceAll("/", "-") + ".json";
}

function isExistFile(file) {
  try {
    statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}