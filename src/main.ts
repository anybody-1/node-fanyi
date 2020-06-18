import { appid, key } from "./private";
import * as https from "https";
import * as querystring from "querystring";
const md5 = require("md5");
export const translate = (word: string) => {
  type ErrorObj = {
    [key: string]: string;
  };
  const errObj: ErrorObj = {
    52001: "请求超时",
    52002: "系统错误",
    52003: "未授权用户",
    54000: "必填参数为空",
    54001: "签名错误",
    54003: "访问频率受限",
    54005: "长query请求频繁",
    58002: "服务当前已关闭",
  };
  let from, to, path, sign;
  let salt = Math.random();
  sign = md5(appid + word + salt + key);
  if (/[a-zA-Z]/.test(word[0])) {
    from = "en";
    to = "zh";
  } else {
    from = "zh";
    to = "en";
  }
  const query: string = querystring.stringify({
    q: word,
    from,
    to,
    appid,
    salt,
    sign,
  });
  path = "/api/trans/vip/translate?" + query;
  const options = {
    hostname: "fanyi-api.baidu.com",
    port: 443,
    path,
    method: "GET",
  };
  const request = https.request(options, (response) => {
    let chunks: Buffer[] = [];
    response.on("data", (chunk) => {
      chunks.push(chunk);
    });
    response.on("end", () => {
      const string = Buffer.concat(chunks).toString();
      type BaiduResult = {
        error_code?: string;
        error_msg?: string;
        from: string;
        to: string;
        trans_result: { src: string; dst: string }[];
      };
      const obj: BaiduResult = JSON.parse(string);
      if (obj.error_code) {
        console.error(errObj[obj.error_code] || obj.error_msg);
        process.exit(2);
      } else {
        obj.trans_result.map((res) => {
          console.log(res.dst);
        });
        process.exit(0);
      }
    });
  });
  request.on("err", (e) => {
    console.log(e);
  });
  request.end();
};
