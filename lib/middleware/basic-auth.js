/**
 * Created by author name @author author name
 */

"use strict";
//========================== Load Modules Start ===========================
const auth = require('basic-auth');
const compare = require('tsscmp');
//========================== Load internal Module =========================
const config = require('../config');
//========================== Load Modules End =============================

var basicAuthentication = function (req, res, next) {
  let credentials = auth(req);
  if (!credentials || !check(credentials.name, credentials.pass, config.cfg)) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    // res.end('Access granted')
    next();
  }
}


// Basic function to validate credentials for example
function check(name, pass, configData) {
  let valid = true
  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(name, configData.basicAuth.username) && valid
  valid = compare(pass, configData.basicAuth.password) && valid
  return valid
}

module.exports = {
  basicAuthentication
}
