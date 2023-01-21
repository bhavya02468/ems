"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
const _ = require("lodash");

//========================== Load internal modules ====================
const adminDao = require("./adminDao");
const customExc = require("../../customExceptions");
const appUtil = require("../../appUtils");
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");

//========================== Load Modules End ==============================================

function createSuperAdmin(params) {
  return adminDao.createSuperAdmin(params);
}

function createAdmin(params) {
  return adminDao.createAdmin(params);
}

/* Login Function for admin */
function login(loginInfo) {
  return adminDao.findByEmail(loginInfo).then((adminInfo) => {
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

function findByAgg(aggPipe) {
  return adminDao.findByAgg(aggPipe);
}

function getAdminDetails(params) {
  return adminDao.findById({ _id: params });
}

function updateDetails(query, editedData) {
  let options = { new: true,};
  return adminDao.updateDetails(query, editedData, options);
}

/* Change Password Info */
function changePass(passInfo, adminInfo) {
  if (!adminInfo) {

    throw customExc.completeCustomException("admin_not_found", false);
  }
  
  passInfo.hash = appUtil.encryptHashPassword(passInfo.key, adminInfo.salt); //new hash
  //old hash (admin info)

  console.log("=======================",passInfo.hash, "++++++++++",adminInfo.hash)
  if (_.isEqual(passInfo.hash, adminInfo.hash)) {
    
    let query = { _id: mongoose.Types.ObjectId(adminInfo._id) };
    adminInfo.updated=new Date().toISOString()
    var salt = ( bcrypt.genSaltSync(10));
    adminInfo.hash = bcrypt.hashSync(passInfo.new_pass, salt);
    adminInfo.salt=salt

    return adminDao.changePass(query,adminInfo);
  } else {
    console.log("00in else")
    // throw customExc.passNotMatch();
    throw customExc.completeCustomException("pass_not_match", false);
  }
}

function isEmailExist(email, options) {
  let query = {};
  query.email = {
    $regex: new RegExp(["^", email, "$"].join("")),
    $options: "i",
  };
  let projection = {};
  return adminDao.findByAny(query, projection);
}

/* Reset Password Info */
function resetPass(query, passwordInfo) {
  delete passwordInfo.salt
  console.log(typeof(passwordInfo))
  let x={}
  x.name=passwordInfo.name
  x.isActive=passwordInfo.isActive
  x.role=passwordInfo.role
  x.email=passwordInfo.email
  x.gender=passwordInfo.gender
  x.mobile=passwordInfo.mobile
  x.dob=passwordInfo.dob
  x.created=passwordInfo.created
  x.updated=passwordInfo.updated
  x.password=passwordInfo.password

  var salt = ( bcrypt.genSaltSync(10));
    x.hash = bcrypt.hashSync(x.password, salt);
    x.salt=salt
  console.log(x)
  return adminDao.changePass(query,x);
}

/* update Details */
function updateDetails(query, editedData) {
  let options = { new: true, fields: { salt: 0, hash: 0 } };
  return adminDao.updateDetails(query, editedData, options);
}

function findByAny(query, projection) {
  return adminDao.findByAny(query, projection);
}
function signup(adminInfo) {
  return adminDao.signup(adminInfo);
}

function deleteByID(params) {
  return adminDao.deleteByID(params);
}
//========================== Export Module Start ==============================

module.exports = {
  login,
  changePass,
  isEmailExist,
  updateDetails,
  findByAny,
  resetPass,
  signup,
  createSuperAdmin,
  createAdmin,
  deleteByID,
  findByAgg,
  getAdminDetails,
  updateDetails,
};

//========================== Export Module End ===============================
