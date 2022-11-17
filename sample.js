import Sitemapper from 'sitemapper';
import config from 'config';
import axios from 'axios';

const sitemap = config.sitemap;
var sitemapper = new Sitemapper();

const delay = t => new Promise(resolve => setTimeout(resolve, t));

sitemapper.timeout = 5000;
sitemapper.fetch(sitemap)
  .then(function (data) {
    console.log(data.sites);
    getPages(data.sites);
  })
  .catch(function (error) {
    console.log(error);
  });

const getPages = async urls => {
    const results = [];
  
    for (const i in urls) {
      await delay(1000);  // 1 second
      const url = urls[i];
      console.log(url);
      const response = await axios.get(url);
      results.push({ url, response });
    }
  
    return results;
  }