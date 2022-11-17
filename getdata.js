import Sitemapper from 'sitemapper';
import axios from "axios";
import pkg from 'cheerio';
const { load } = pkg;
import config from 'config';
import { writeFile, existsSync, mkdirSync, statSync } from 'fs';
import { setTimeout } from 'timers/promises';

const sitemap = config.sitemap;
var sitemapper = new Sitemapper();
sitemapper.timeout = 5000;

sitemapper.fetch(sitemap)
  .then(function (sites) {
    let urls = sites.sites;
    getAllData(urls)
      .then(resp=>{
        let file = makeFileName(urls[0]);
        saveFile(file, JSON.stringify(resp));
      })
      .catch(e=>{console.log(e)})
  })
  .catch(function (error) {
    console.log(error);
  });
 
function getAllData(URLs){
  return Promise.all(URLs.map(
    fetchData
  ));
}
  
async function fetchData(URL) {
  try {
    const response = await axios.get(URL);
    const $ = load(response.data);
    console.log("title:  " + $('title').text());
    console.log(config.interval);
    return {
      success: true,
      title: $('title').text(),
      article: $('article').text()
    };
  } catch (error) {
    return { success: false };
  }
}
  
  
function saveFile(filename, data) {
  const dataFolder = "./data";

  if (!existsSync(dataFolder)) {
    mkdirSync(dataFolder);
  }
  
  const filepath = dataFolder + "/" + filename;
  const jsonStr = JSON.stringify(data, null, 2);
  if (isExistFile(filepath) == true) {
    console.log(filepath + " already exists.");
    return;
  }

  writeFile(filepath, data, (err) => {
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
