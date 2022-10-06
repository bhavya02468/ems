/**
 * Created by author name @author author name
 */

"use strict";
//========================== Load Modules Start ===========================

//========================== Load internal Module =========================

const authenticate = require("./auth");
const multer = require("./multer");
const admin = require("./admin");
const employee = require("./employee");
const admin2 = require("./admin2");

//========================== Load Modules End =============================

//========================== Export Module Start ===========================

module.exports = {
  authenticate,
  multer,
  admin,
  employee,
  admin2
};
//========================== Export module end ==================================
