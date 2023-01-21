/**
 * Created by author name @author author name
 */

"use strict";

//========================== Load Modules Start ===========================
const _ = require("lodash");

//========================== Load internal Module =========================
const customExc = require("../customExceptions");
const jwtHandler = require("../jwtHandler");
const constants = require("../constants");

//========================== Load Modules End =============================

var autntctStatPass = function (req, res, next) {
  if (_.isEqual(req.headers.static_authz, constants.STATIC_AUTHZ.PASSWORD)) {
    next();
  } else {
    let errors = [];
    errors.push({ message: constants.STATIC_AUTHZ.INVALID });
    return next(
      customExc.getCustomErrorException(constants.STATIC_AUTHZ.ERR, errors)
    );
  }
};

var __verifyTok = function (acsTokn) {
  return jwtHandler
    .verifyUsrToken(acsTokn)
    .then((tokenPayload) => {
      return tokenPayload;
    })
    .catch((err) => {
      throw err;
    });
};

var __verifyTok1 = function (acsTokn) {
  return jwtHandler
    .verifyUsr1Token(acsTokn)
    .then((tokenPayload) => {
      return tokenPayload;
    })
    .catch((err) => {
      throw err;
    });
};

var __verifyTok1 = function (acsTokn) {
  return jwtHandler
    .verifyUsr1Token2(acsTokn)
    .then((tokenPayload) => {
      return tokenPayload;
    })
    .catch((err) => {
      throw err;
    });
};

var expireToken = function (req, res, next) {
  return jwtHandler
    .expireToken(req)
    .then((result) => {
      return result;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

var __verifyAppVersion = function (app_version) {
  if (app_version && !Number.isInteger(app_version)) {
    app_version = parseInt(app_version);
  }
  return versionDao.getLatestVersion().then((version) => {
    let current_version;
    if (version.length > 0) {
      current_version = version[0].current_version;
    }
    if (app_version < current_version) {
      throw customExc.invalidAppVersion();
    }
    return version;
  });
};

var autntctTkn = function (req, res, next) {
  let acsToken = req.get("accessToken");
  __verifyTok(acsToken)
    .then((tokenPayload) => {
      return tokenPayload;
    })
    .then(function (result) {
      req.user = result;
      return next();
    })
    .catch(function (err) {
      return next(err);
    });
};

var getISO = function (req, res, next) {
  let ISO = req.get("countryISO");
  return ISO;
};

var verifyAppVersion = function (req, res, next) {
  let app_version = req.get("app_version");
  return __verifyAppVersion(app_version)
    .then(function (result) {
      next();
    })
    .catch(function (err) {
      next(err);
    });
};

var verifyAdminToken = function (req, res, next) {
  let admin = req.user || {};
  if (_.isEqual(admin.type, "admin")) {
    next();
  } else {
    let errors = [];
    errors.push({ message: constants.MESSAGES.unAuthAccess });
    return next(customExc.unauthorizeAccess());
  }
};

var verifyOrgToken = function (req, res, next) {
  let org = req.user || {};
  if (_.isEqual(org.type, "org")) {
    next();
  } else {
    let errors = [];
    errors.push({ message: constants.MESSAGES.unAuthAccess });
    return next(customExc.unauthorizeAccess());
  }
};

var verifyLOrgToken = function (req, res, next) {
  let org = req.user || {};
  if (_.isEqual(org.type, "lorg")) {
    next();
  } else {
    let errors = [];
    errors.push({ message: constants.MESSAGES.unAuthAccess });
    return next(customExc.unauthorizeAccess());
  }
};

//validate both organization smaill as well as large
var verifyBOrgToken = function (req, res, next) {
  let org = req.user || {};
  if (_.isEqual(org.type, "org") || _.isEqual(org.type, "lorg")) {
    next();
  } else {
    let errors = [];
    errors.push({ message: constants.MESSAGES.unAuthAccess });
    return next(customExc.unauthorizeAccess());
  }
};

//checking from user db
var autntctUsrTkn = function (req, res, next) {
  let acsToken = req.get("accessToken");
  __verifyTok1(acsToken)
    .then((tokenPayload) => {
      return tokenPayload;
    })
    .then((result) => {
      req.user = result;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

//========================== Export Module Start ===========================

module.exports = {
  autntctStatPass,
  autntctTkn,
  verifyAppVersion,
  getISO,
  expireToken,
  verifyAdminToken,
  verifyOrgToken,
  verifyLOrgToken,
  verifyBOrgToken,
  autntctUsrTkn,
};

//========================== Export Module End ===========================
