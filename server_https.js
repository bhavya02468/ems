/**
 * Set global configs.
 */
require('dotenv').config();

//Import Config
const config = require('./lib/config');

const https = require('https');
const fs = require('fs');

// Import logger
const logger = require('./lib/logger').logger;

// logger.requestLogger;
config.dbConfig(config.cfg, (err) => {
    if (err) {
        logger.error(err, 'exiting the app.');
        return;
    }

    // load external modules
    const express = require("express");

    // init express app
    const app = express();

    // set server home directory
    app.locals.rootDir = __dirname;

    // config express
    config.expressConfig(app, config.cfg.environment);

    // attach the routes to the app
    require("./lib/route")(app)

    const privateKey = fs.readFileSync('/etc/letsencrypt/live/abc.com/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/abc.com/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/abc.com/chain.pem', 'utf8');

    const https_options = {
        key: privateKey,
        cert: certificate,
        ca
    };

    const server = https.createServer(https_options, app).listen(config.cfg.port);
    console.log(`Express server listening on ${config.cfg.ip}:${config.cfg.port}, in ${config.cfg.environment} mode`);
});
