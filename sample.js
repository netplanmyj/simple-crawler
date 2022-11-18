import Sitemapper from 'sitemapper';
import config from 'config';
import axios from 'axios';
import pkg from 'cheerio';
const { load } = pkg;

const sitemap = config.sitemap;
var sitemapper = new Sitemapper();

const delay = t => new Promise(resolve => setTimeout(resolve, t));

sitemapper.timeout = 5000;
sitemapper.fetch(sitemap)
  .then(function (data) {
    getPages(data.sites)
    .then((res) => {
      console.log(res);
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

  function removeCtrls(text) {
    text = text.replace(/\r/g, '');
    text = text.replace(/\n/g, '');
    text = text.replace(/\t/g, '');
    return text;
  }