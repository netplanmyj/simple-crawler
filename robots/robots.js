import config from 'config';
import axios from "axios";

function getSitemap() {
  return new Promise((resolve, reject) => {
    const robots = config.url + "robots.txt";
    axios.get(robots)
        .then(function (response) {
            parseData(response);
            resolve(response.data);
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
  let array = response.data.toString().split("\n");
  for(let i in array) {
    console.log(i + array[i]);
  }
}

export default getSitemap;
