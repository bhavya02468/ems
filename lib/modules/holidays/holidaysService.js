"use strict";

//========================== Load Modules Start =======================

//========================== Load External modules ====================
const _ = require("lodash");

//========================== Load internal modules ====================
const holDao = require("./holidaysDao");
const customExc = require("../../customExceptions");
const appUtil = require("../../appUtils");
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
//========================== Load Modules End ==============================================

function isHoldayExist(name, options) {
  let query = {};
  query.name = {
    $regex: new RegExp(["^", name, "$"].join("")),
    $options: "i",
  };
  let projection = {};
  return holDao.findByAny(query, projection);
}

function createHol(params) {
  return holDao.createHol(params);
}
function login(loginInfo) {
  return holDao.findByEmail(loginInfo).then((adminInfo) => {
    if(!adminInfo.isActive){
      throw customExc.completeCustomException("admin_not_active", false);
    }
    if (!adminInfo) {
      throw customExc.completeCustomException("admin_not_found", false);
    }
    loginInfo.hash = appUtil.encryptHashPassword(
      loginInfo.password,
      adminInfo.salt
    );
    if (_.isEqual(loginInfo.hash, adminInfo.hash)) {
      return adminInfo;
    } else {
      throw customExc.completeCustomException("incorrect_pass", false);
      // throw customExc.incorrectPass();
    }
  });
}

function findByAny(query, projection) {

  return holDao.findByAny(query, projection);
}

function updateDetails(query, delOptions, editedData) {
  let options = { new: false };
  return holDao.updateDetails(query, editedData, options);
}
function deleteByID(query,projection,options) {
  return holDao.deleteByID(query,projection,options);
}

function getHolDetails(params) {
  return holDao.findById(params);
}

function findByAgg(aggPipe) {
  return holDao.findByAgg(aggPipe);
}
//========================== Export Module Start ==============================

module.exports = {
  isHoldayExist,
  createHol,
  findByAny,
  updateDetails,
  deleteByID,
  getHolDetails,
  findByAgg,
  login
};

//========================== Export Module End ===============================
