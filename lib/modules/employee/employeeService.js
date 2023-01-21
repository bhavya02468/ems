"use strict";

//========================== Load Modules Start =======================

//========================== Load External modules ====================
const _ = require("lodash");

//========================== Load internal modules ====================
const emprDao = require("./employeeDao");
const customExc = require("../../customExceptions");
const appUtil = require("../../appUtils");
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
//========================== Load Modules End ==============================================

function isEmailExist(email, options) {
  let query = {};
  query.email = {
    $regex: new RegExp(["^", email, "$"].join("")),
    $options: "i",
  };
  let projection = {};
  console.log("passInfo.email")
  return emprDao.findByAny(query, projection);
}

function createEmp(params) {
  return emprDao.createEmp(params);
}
function login(loginInfo) {
  return emprDao.findByEmail(loginInfo).then((adminInfo) => {
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
  console.log( "======fff===")
  return emprDao.findById(params);
}

function findByAgg(aggPipe) {
  return emprDao.findByAgg(aggPipe);
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

    return emprDao.changePass(query,adminInfo);
  } else {
    // throw customExc.passNotMatch();
    throw customExc.completeCustomException("pass_not_match", false);
  }
}


/* Reset Password Info */
function resetPass(query, passwordInfo) {
  delete passwordInfo.salt
  let x={}
  x.isActive=passwordInfo.isActive
  x.name=passwordInfo.name
  x.email=passwordInfo.email
  x.gender=passwordInfo.gender
  x.designation=passwordInfo.designation
  x.address=passwordInfo.address
  x.mobile=passwordInfo.mobile
  x.dob=passwordInfo.dob
  x.role=passwordInfo.role
  x.created=passwordInfo.created
  x.updated=passwordInfo.updated  
  x.password=passwordInfo.password
  


  console.log(x)

  var salt = ( bcrypt.genSaltSync(10));
    x.hash = bcrypt.hashSync(x.password, salt);
    x.salt=salt
  return emprDao.changePass(query,x);
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
  login,
  resetPass,
  changePass
};

//========================== Export Module End ===============================
