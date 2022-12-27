import config from 'config';
import axios from "axios";

function getSitemap() {
  return new Promise((resolve, reject) => {
    const robots = config.url + "robots.txt";
    axios.get(robots)
        .then(function (response) {
            const data = parseData(response);
            // resolve(response.data);
            resolve(data);
        })
        .catch(function (error) {
            // エラー時に実行
            reject(error);
        })
        .then(function () {
            // 常に実行
        });
  });
}

function parseData(response) {
  let robot = {};
  let sitemap = [];
  let disallow = [];
  let array = response.data.split("\n");
  for(let i in array) {
    let idx = array[i].indexOf('Sitemap:');
    if (idx >= 0) {
      sitemap.push(array[i].substring(9));
    }
    idx = array[i].indexOf('Disallow:');
    if (idx >= 0) {
      disallow.push(array[i].substring(10))
    }
  }
  robot.sitemap = sitemap;
  robot.disallow = disallow;
  return robot;
}

export default getSitemap;
