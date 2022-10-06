"use strict";

//========================== Load Modules Start ===========================

//========================== Load Internal Module =========================

// Load exceptions
const constants = require("./constants");
const excep = require("./customExceptions");
const logger = require("./logger").logger;
const APIResponse = require("./model/APIResponse");

//========================== Load Modules End =============================

function hndlError(err, req, res, next) {
  // unhandled error
  sendError(res, err);
}

function sendError(res, err) {
  // if error doesn't has sc than it is an unhandled error,
  // log error, and throw intrnl server error
  // if (!err.errorCode) {
  if (!err.errCode) {
    // logger.error(err, "unhandled error");
    err = excep.intrnlSrvrErr(err);
  }
  let result = new APIResponse(constants.STATUS_CODE.ERROR, err);
  _sendResponse(res, result);
}

function sendSuccessWithMsg(res, msg) {
  let rslt = { message: msg };
  let result = new APIResponse(constants.STATUS_CODE.SUCCESS, rslt);
  _sendResponse(res, result);
}

function sendSuccess(res, rslt) {
  let result = new APIResponse(constants.STATUS_CODE.SUCCESS, rslt);
  _sendResponse(res, result);
}

/*
function sendCustomRes(res, rslt) {
    if(typeof rslt == 'undefined' || rslt == undefined){
      rslt = {};
    }
    rslt.time = new Date().getTime();
    _sendResponse(res, rslt)
}
*/

//========================== Exposed Action Start ==========================

module.exports = {
  hndlError,
  sendError,
  sendSuccess,
  sendSuccessWithMsg,
};

//========================== Exposed Action End ==========================

function _sendResponse(res, rslt) {
  let oldRslt;
  try {
    oldRslt = rslt;
    if (
      rslt &&
      rslt.status == 0 &&
      rslt.error &&
      rslt.error.errors &&
      rslt.error.errors.errorCode &&
      rslt.error.errors.errorCode.special_exception
    ) {
      rslt.status = 0;
      rslt.err = {
        errCode: rslt.error.errors.errorCode.code,
        msg: rslt.error.errors.errorCode.msg,
      };
    }
  } catch (ex) {
    rslt = oldRslt;
  } finally {
    if (!res.headersSent) {
      if (rslt.err) {
        res.status(rslt.err.errCode);
      }
    }
    return res.send(rslt);
  }
}
