"use strict";

//========================== Load Modules Start =======================

//========================== Load External modules ====================
const _ = require("lodash");

//========================== Load internal modules ====================
const attndDao = require("./attendenceDao");
const customExc = require("../../customExceptions");
const appUtil = require("../../appUtils");

//========================== Load Modules End ==============================================

// function isEmailExist(email, options) {
//   let query = {};
//   query.email = {
//     $regex: new RegExp(["^", email, "$"].join("")),
//     $options: "i",
//   };
//   let projection = {};
//   return emprDao.findByAny(query, projection);
// }

// function createAttend(params) {
//   return emprDao.createAttend(params);
// }

// function findByAny(query, projection) {
//   return emprDao.findByAny(query, projection);
// }

function updateDetails(query, editedData, options) {
  console.log(editedData)
  return attndDao.updateDetails(query, editedData, options);
}
// function deleteByID(params) {
//   return emprDao.deleteByID(params);
// }

// function getEmpDetails(params) {
//   console.log();
//   return emprDao.findById(params);
// }

function findByAgg(aggPipe) {
  return attndDao.findByAgg(aggPipe);
}
function getall() {
  return attndDao.getall();
}

function updateMany(query, editedData, options) {
  return attndDao.updateMany(query, editedData, options);
}
//========================== Export Module Start ==============================

module.exports = {
  // isEmailExist,
  // createAttend,
  // findByAny,
  updateDetails,
  // deleteByID,
  // getEmpDetails,
  findByAgg,
  getall,
  updateMany,
};

//========================== Export Module End ===============================
