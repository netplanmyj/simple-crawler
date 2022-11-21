import Sitemapper from 'sitemapper';
import config from 'config';
import axios from "axios";import pkg from 'cheerio';
const { load } = pkg;
import { writeFile, existsSync, mkdirSync, statSync } from 'fs';

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const sitemap = config.sitemap;
var sitemapper = new Sitemapper();
sitemapper.timeout = 5000;

sitemapper.fetch(sitemap)
  .then(function (data) {
    getPages(data.sites)
    .then((res) => {
      console.log(res);
      let file = makeFileName(data.sites[0]);
      saveFile(file, res);
    });
  })
  .catch(function (error) {
    console.log(error);
  });

const getPages = async urls => {
  const results = [];

  for (const url of urls) {
    console.log(url);
    axios.get(url)
    .then((response) => {
      
      const $ = load(response.data);
      const article = removeCtrls($('article').text());
      results.push({
        url: url,
        title: $('title').text(),
        article: article
      });

    });
    await delay(1000);
  }

  return results;
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

function removeCtrls(text) {
  text = text.replace(/\r/g, '');
  text = text.replace(/\n/g, '');
  text = text.replace(/\t/g, '');
  return text;
}