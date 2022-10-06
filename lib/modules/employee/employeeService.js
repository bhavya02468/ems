"use strict";

//========================== Load Modules Start =======================

//========================== Load External modules ====================
const _ = require("lodash");

//========================== Load internal modules ====================
const emprDao = require("./employeeDao");
const customExc = require("../../customExceptions");
const appUtil = require("../../appUtils");

//========================== Load Modules End ==============================================

function isEmailExist(email, options) {
  let query = {};
  query.email = {
    $regex: new RegExp(["^", email, "$"].join("")),
    $options: "i",
  };
  let projection = {};
  return emprDao.findByAny(query, projection);
}

function createEmp(params) {
  return emprDao.createEmp(params);
}

function findByAny(query, projection) {
  return emprDao.findByAny(query, projection);
}

function updateDetails(query, delOptions, editedData) {
  let options = { new: false };
  return emprDao.updateDetails(query, editedData, options);
}
function deleteByID(params) {
  return emprDao.deleteByID(params);
}

function getEmpDetails(params) {
  console.log();
  return emprDao.findById(params);
}

function findByAgg(aggPipe) {
  return emprDao.findByAgg(aggPipe);
}
//========================== Export Module Start ==============================

module.exports = {
  isEmailExist,
  createEmp,
  findByAny,
  updateDetails,
  deleteByID,
  getEmpDetails,
  findByAgg,
};

//========================== Export Module End ===============================
