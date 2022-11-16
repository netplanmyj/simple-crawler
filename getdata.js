import Sitemapper from 'sitemapper';
import axios from "axios";
import pkg from 'cheerio';
const { load } = pkg;
import config from 'config';

const sitemap = config.sitemap;
var sitemapper = new Sitemapper();
sitemapper.timeout = 5000;

sitemapper.fetch(sitemap)
  .then(function (sites) {
    let urls = sites.sites;
    getAllData(urls)
      .then(resp=>{console.log(resp)})
      .catch(e=>{console.log(e)})
  })
  .catch(function (error) {
    console.log(error);
  });
 
function getAllData(URLs){
  return Promise.all(URLs.map(fetchData));
}
  
async function fetchData(URL) {
  try {
    const response = await axios
      .get(URL);
    const $ = load(response.data);
    console.log("pagetitle:  " + $('title').text());
    return {
      success: true,
      title: $('title').text()
    };
  } catch (error) {
    return { success: false };
  }
}
  
  
