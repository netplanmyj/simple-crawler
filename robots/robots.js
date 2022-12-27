import config from 'config';
import axios from "axios";

function getSitemap() {
  return new Promise((resolve, reject) => {
    const robots = config.url + "robots.txt";
    axios.get(robots)
        .then(function (response) {
            let result = response.data;
            resolve(result);
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

export default getSitemap;
