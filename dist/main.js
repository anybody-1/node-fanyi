"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
var private_1 = require("./private");
var https = __importStar(require("https"));
var querystring = __importStar(require("querystring"));
var md5 = require("md5");
exports.translate = function (word) {
    var errObj = {
        52001: "请求超时",
        52002: "系统错误",
        52003: "未授权用户",
        54000: "必填参数为空",
        54001: "签名错误",
        54003: "访问频率受限",
        54005: "长query请求频繁",
        58002: "服务当前已关闭",
    };
    var from, to, path, sign;
    var salt = Math.random();
    sign = md5(private_1.appid + word + salt + private_1.key);
    if (/[a-zA-Z]/.test(word[0])) {
        from = "en";
        to = "zh";
    }
    else {
        from = "zh";
        to = "en";
    }
    var query = querystring.stringify({
        q: word,
        from: from,
        to: to,
        appid: private_1.appid,
        salt: salt,
        sign: sign,
    });
    path = "/api/trans/vip/translate?" + query;
    var options = {
        hostname: "fanyi-api.baidu.com",
        port: 443,
        path: path,
        method: "GET",
    };
    var request = https.request(options, function (response) {
        var chunks = [];
        response.on("data", function (chunk) {
            chunks.push(chunk);
        });
        response.on("end", function () {
            var string = Buffer.concat(chunks).toString();
            var obj = JSON.parse(string);
            if (obj.error_code) {
                console.error(errObj[obj.error_code] || obj.error_msg);
                process.exit(2);
            }
            else {
                obj.trans_result.map(function (res) {
                    console.log(res.dst);
                });
                process.exit(0);
            }
        });
    });
    request.on("err", function (e) {
        console.log(e);
    });
    request.end();
};
