/**
 * Set global configs.
 */
require("dotenv").config();

//Import Config
const config = require("./lib/config");

//Import Socket
// const socketLib = require('./lib/socket');

// Import logger
var logger = require("./lib/logger").logger;

//Generic basic auth Authorization header field parser for whatever.
var auth = require("basic-auth");

var compare = require("tsscmp");

// logger.requestLogger;
config.dbConfig(config.cfg, (err) => {
  if (err) {
    logger.error(err, "exiting the app.");
    return;
  }

  // load external modules
  const express = require("express");

  // const mediaUpload = require("./lib/mediaupload/configure")();
  // mediaUpload();

  // init express app
  const app = express();

  // set server home directory
  app.locals.rootDir = __dirname;

  // config express
  config.expressConfig(app, config.cfg.environment);

  // intialize socket
  // socketLib.initializeSocket(app);

  // console.log(config);

  /* This move to middleware because for some apis we don't need authenication */

  /*
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var credentials = auth(req)

       // Check credentials
       // The "check" function will typically be against your user store
       if (!credentials || !check(credentials.name, credentials.pass, config.cfg)) {
         res.statusCode = 401
         res.setHeader('WWW-Authenticate', 'Basic realm="example"')
         res.end('Access denied')
       } else {
         console.log('here also check');
         // res.end('Access granted')
         next();
       }
  });
  */

  // attach the routes to the app
  require("./lib/route")(app);

  // start server
  app.listen(config.cfg.port, () => {
    // logger.info(`Express server listening on ${config.cfg.port}, in ${config.cfg.environment} mode`);
    console.log(
      `Express server listening on ${config.cfg.port}, in ${config.cfg.environment} mode`
    );
  });
});

/*

// Basic function to validate credentials for example
function check (name, pass, configData) {
  var valid = true

  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(name, configData.basicAuth.username) && valid
  valid = compare(pass, configData.basicAuth.password) && valid

  return valid
}

*/
