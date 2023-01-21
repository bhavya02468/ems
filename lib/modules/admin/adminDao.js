"use strict";

//========================== Load Modules Start =======================

//========================== Load internal modules ====================
const mongoose = require("mongoose");

//========================== Load internal modules ====================
const Admin = require("./adminModel");
const customExc = require("../../customExceptions");

let BaseDao = new require("../../dao/baseDao");
const adminDao = new BaseDao(Admin);

//========================== Load Modules End ==============================================

function createSuperAdmin(params) {
  var admin = new Admin(params);
  return adminDao.save(admin);
}

function createAdmin(params) {
  var admin = new Admin(params);
  return adminDao.save(admin);
}

function findByAgg(query) {
  return adminDao
    .aggregate(query)
    .then(function (result) {
      return result;
    })
    .catch(function (err) {
      return "db_err";
    });
}

/*function for check email existense in database*/
function findByEmail(params) {
  let query = {};
  query.email = {
    $regex: new RegExp(["^", params.email, "$"].join("")),
    $options: "i",
  };
  let projection = {};
  return adminDao
    .findOne(query, projection)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err)
      throw customExc.dbErr(err);
    });
}

/*function for check id existense in database*/
function findById(params) {
  let query = {};
  query._id = mongoose.Types.ObjectId(params._id);
  let projection = {};
  return adminDao
    .findOne(query, projection)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw customExc.dbErr(err);
    });
}

function changePass(query, userInfo, options) {

  return adminDao.findOneAndUpdate(query,userInfo)
    .then((result) => {
      console.log(result)
      return result;
    })
    .catch((err) => {
      console.log(err)

      throw customExc.dbErr(err);

    });
}

/*function for finding info*/
function findByAny(query, projection) {
  return adminDao.findOne(query, projection).then((result) => {
    if (result) return result;
    return false;
  });
}

/*function to update admin data */
function updateDetails(query, editedData, options) {
  return adminDao
    .findOneAndUpdate(query, editedData, options)
    .then((result) => {
      if (result) return result;
      return false;
    });
}
//function to signup
function signup(adminInfo) {
  let admin = new Admin(adminInfo);
  return adminDao.save(admin);
}

function deleteByID(params) {
  return adminDao.findByIdAndRemove(params, {});
}

//========================== Export Module Start ==============================

module.exports = {
  findByEmail,
  findById,
  changePass,
  findByAny,
  updateDetails,
  signup,
  createSuperAdmin,
  createAdmin,
  deleteByID,
  findByAgg,
};

//========================== Export Module End ===============================
