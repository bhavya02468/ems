let environment = process.env.NODE_ENV;
if (!environment) {
    console.log('Environment is not setup now!');
}

const _ = require("lodash");
const dbConfig = require("./dbConfig");
const expressConfig = require("./expressConfig");
const cfg = require('./default.js');

//Export config module
module.exports = {
    cfg,
    dbConfig,
    expressConfig
}
