"use strict";

//========================== Load Modules Start =======================

//========================== Load internal modules ====================

//========================== Load internal modules ====================
const customExceptions = require("../../customExceptions");
const mongoose = require("mongoose");

const Admin = require("../admin/adminModel");

// init user dao
let BaseDao = new require("../../dao/baseDao");
const empDao = new BaseDao(Admin);

//========================== Load Modules End ==============================================

function createEmp(params) {
  var emp = new Admin(params);
  return empDao.save(emp);
}

function findByAny(query, projection) {
  return empDao.findOne(query, projection).then((result) => {
    if (result) return result;
    return false;
  });
}

function updateDetails(query, editedData, options) {
  return empDao.findOneAndUpdate(query, editedData, options).then((result) => {
    if (result) return result;
    return false;
  });
}

function deleteByID(params) {
  return empDao.findByIdAndRemove(params, {});
}

function findById(params) {
  let query = {};
  query._id = mongoose.Types.ObjectId(params._id);
  let projection = {};
  return empDao
    .findOne(query, projection)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw customExc.dbErr(err);
    });
}

function findByAgg(query) {
  return empDao
    .aggregate(query)
    .then(function (result) {
      return result;
    })
    .catch(function (err) {
      return "db_err";
    });
}
function findByEmail(params) {
  let query = {};
  query.email = {
    $regex: new RegExp(["^", params.email, "$"].join("")),
    $options: "i",
  };
  let projection = {};
  return empDao
    .findOne(query, projection)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw customExc.dbErr(err);
    });
}
//========================== Export Module Start ==============================

module.exports = {
  createEmp,
  findByAny,
  updateDetails,
  deleteByID,
  findById,
  findByAgg,
  findByEmail
};

//========================== Export Module End ===============================
