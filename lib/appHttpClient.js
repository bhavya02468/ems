const querystring = require('querystring');
const http = require('http');
const https = require('https');
const logger = require("./logger");
const TAG = "appHttpClient";
const Promise = require("bluebird")

var getResp = function (res) {
    return new Promise(function (resolve) {
        var fullResp = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            fullResp += chunk.toString();
        }).on('end', function () {
            resolve(fullResp);
        });
    })
};

function postRequest(hostname, port, path, headers, body, isSecure, callback) {
    let options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        headers: headers
    };
    let client = null;
    if (isSecure) {
        client = https;
    } else {
        client = http;
    }
    let req = client.request(options, function (res) {
        getResp(res, callback);
    });
    req.on('error', function (e) {
        logger.error({ method: "postRequest", request: options, body: body, error: e.message }, TAG)
    });
    req.write(body);
    req.end();
};

module.exports = {
    postWithHeader: function (hostname, port, path, headers, body, isSecure, callback) {
        postRequest(hostname, port, path, headers, body, isSecure, callback);
    },
    post: function (hostname, port, path, params, callback) {
        let body = querystring.stringify(params);
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body)
        };
        postRequest(hostname, port, path, headers, body, false, callback);
    },
    postSecure: function (hostname, port, path, params, callback) {
        let body = querystring.stringify(params);
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body)
        };
        postRequest(hostname, port, path, headers, body, true, callback);
    },
    get: function (url, callback) {
        http.get(url, function (res) {
            getResp(res, callback);
        }).on('error', function (e) {
            logger.error({ method: "get", "url": url, error: e.message }, TAG)
        }).end();
    },
    getSecure: function (url) {
        return new Promise(function (resolve, reject) {
            https.get(url, function (res) {
                getResp(res)
                    .then(function (result) {
                        resolve(result)
                    })
            }).on('error', function (e) {
                logger.error({ method: "getSecure", "url": url, error: e.message }, TAG)
            }).end();
        })
    }
};
