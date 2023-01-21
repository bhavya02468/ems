"use strict";

//========================== Load Modules Start ===========================

//========================== Load External Module =========================

const sha256 = require("sha256");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const moment = require("moment");
const commonValidations = require("./commonValidations");
const mongoose = require("mongoose");
//========================== Load Modules End =============================

//========================== Export Module Start ===========================

/**
 * return user home
 * @returns {*}
 */
function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function getNodeEnv() {
  return process.env.NODE_ENV;
}

/**
 * returns if email is valid or not
 * @returns {boolean}
 */
function isValidEmail(email) {
  let pattern = /(([a-zA-Z0-9\-?\.?]+)@(([a-zA-Z0-9\-_]+\.)+)([a-z]{2,3}))+$/;
  return new RegExp(pattern).test(email);
}

/**
 * returns if zipCode is valid or not (for US only)
 * @returns {boolean}
 */
/*function isValidPhoneNumber(num) {
 if (Number.isInteger(num)) {
 num = num.toString();
 }
 if (phoneNumber.indexOf("+") > -1)
 return new RegExp(pattern).test(zipcode);
 }*/
/**
 * returns if zipCode is valid or not (for US only)
 * @returns {boolean}
 */
function isValidZipCode(zipcode) {
  let pattern = /^\d{5}(-\d{4})?$/;
  return new RegExp(pattern).test(zipcode);
}
/**
 * returns if zipCode is valid or not (for US only)
 * @returns {boolean}
 */
function createHashSHA256(pass) {
  return sha256(pass);
}

/**
 * returns random number for password
 * @returns {string}
 */
var getRandomPassword = function () {
  return getSHA256(Math.floor(Math.random() * 1000000000000 + 1));
};

var getSHA256 = function (val) {
  return sha256(val + "password");
};

var encryptHashPassword = function (password, salt) {
  return bcrypt.hashSync(password, salt);
};

var generateSaltAndHashForPassword = function (password) {
  let encryptPassword = { salt: "", hash: "" };
  encryptPassword["salt"] = bcrypt.genSaltSync(10);
  encryptPassword["hash"] = bcrypt.hashSync(password, encryptPassword["salt"]);
  return encryptPassword;
};

/**
 *
 * @returns {string}
 * get random 6 digit number
 * FIX ME: remove hard codeing
 * @private
 */

function getRandomOtp(length) {
  //Generate Random Number
  return randomstring.generate({
    charset: "numeric",
    length: length || 6,
  });
}

function isValidPhone(phone, verifyCountryCode) {
  let reExp = verifyCountryCode ? /^\+\d{6,16}$/ : /^\d{6,16}$/;
  return reExp.test(phone);
}

function createRedisValueObject(user) {
  let respObj = {
    _id: user._id,
  };
  return respObj;
}

function createRedisValueObjectAdmin(admin) {
  let respObj = {};
  respObj.name = admin.name;
  respObj.email = admin.email;
  respObj._id = admin._id;
  return respObj;
}

function delUnwantResult(data) {
  try {
    if (!commonValidations.isEmptyObj(data)) {
      let result_data = data.toObject();
      delete result_data.salt;
      delete result_data.hash;
      return result_data;
    } else {
      return data;
    }
  } catch (ex) {
    if (!commonValidations.isEmptyObj(data)) {
      delete data.salt;
      delete data.hash;
    }
    return data;
  }
}

function toObjectId(_id) {
  return mongoose.Types.ObjectId(_id);
}

//========================== Export Module Start ===========================

module.exports = {
  appHttpClient: require("./appHttpClient"),
  getUserHome,
  getNodeEnv,
  isValidEmail,
  isValidZipCode,
  //isValidPhoneNumber,
  createHashSHA256,
  getRandomPassword,
  encryptHashPassword,
  generateSaltAndHashForPassword,
  getRandomOtp,
  isValidPhone,
  createRedisValueObject,
  createRedisValueObjectAdmin,
  delUnwantResult,
  toObjectId,
};

//========================== Export Module End===========================
