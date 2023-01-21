//========================== Load Modules Start ===========================

//========================== Load external Module =========================
const _ = require("lodash");
const email_check = require("email-validator");

//========================== Load Internal Module =========================
const constants = require("./constants");
const customExc = require("./customExceptions");

//========================== Load Modules End =============================

//========================== Export Module Start ===========================

module.exports = {
  isValid: function isValid(isFound) {
    let isValue = true;
    if (isFound == "0") {
    }
    if (
      typeof isFound === "undefined" ||
      isFound == null ||
      isFound == "null" ||
      isFound == "" ||
      isFound == undefined ||
      isFound == "undefined" ||
      String(isFound).trim() == ""
    ) {
      isValue = false;
    }
    return isValue;
  },

  validatePlatform: function (req, res, next) {
    let { platform } = req.headers;
    var errors = [];
    if (
      platform == undefined ||
      isNaN(platform) ||
      platform > 3 ||
      platform < 1
    ) {
      errors.push({
        fieldName: "platform",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          constants.MESSAGES.KEY,
          constants.MESSAGES.PLATFORM
        ),
      });
    }
    if (errors && errors.length > 0) {
      return next(customExc.validationErrors(errors));
    }
    next();
  },

  isEmptyObj: function isEmptyObj(obj) {
    try {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    } catch (ex) {
      return false;
    }
  },

  trimSpaces: function (string_val) {
    try {
      let mystring = string_val || "";
      mystring = mystring.replace(/^\s+|\s+$/g, "");
      return mystring;
    } catch (ex) {
      return "";
    }
  },

  arrayEmptyVal: function arrayEmptyVal(el) {
    // checks whether an element is empty or notMIN_IMG_UPLOAD
    let e = el || "";
    e = e.toString();
    // e = (e).replace(/^\s+|\s+$/g, "");
    e = module.exports.trimSpaces(e);
    return !e || 0 === e.length;
  },

  arraytrimSpaces: function arrayEmptyVal(arr) {
    arr.forEach(function (part, index, theArray) {
      let e = theArray[index] || "";
      e = e.toString();
      theArray[index] = module.exports.trimSpaces(e);
    });
    return arr;
  },

  validateLoginData: function loginDataValidate(req, res, next) {
    var loginInfo = {
      email: req.body.email || "",
      password: req.body.password || "",
    };
    var errors = [];
    if (!email_check.validate(loginInfo.email)) {
      errors.push({
        fieldName: "email",
        message: constants.MESSAGES.KEY_INVALID.replace(
          constants.MESSAGES.KEY,
          constants.MESSAGES.EMAIL
        ),
      });
    }
    if (errors && errors.length > 0) {
      return next(customExc.validationErrors(errors));
    }
    req.body.loginInfo = loginInfo;
    next();
  },

  validatePasswordInfo: function passDataValidate(req, res, next) {
    let passData = {
      old_pass: req.body.old_pass || "",
      new_pass: req.body.new_pass || "",
    };
    passData.old_pass = passData.old_pass.trim();
    passData.new_pass = passData.new_pass.trim();
    var errors = [];

    if (_.isEmpty(passData.old_pass) || passData.old_pass == "") {
      errors.push({
        fieldName: "old_pass",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          constants.MESSAGES.KEY,
          constants.MESSAGES.OLD_PASS
        ),
      });
    }
    if (_.isEmpty(passData.new_pass) || passData.new_pass == "") {
      errors.push({
        fieldName: "new_pass",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          constants.MESSAGES.KEY,
          constants.MESSAGES.NEW_PASS
        ),
      });
    }
    if (passData.old_pass.length < 2) {
      errors.push({
        fieldName: "old_pass",
        message: constants.MESSAGES.KEY_MIN.replace(
          constants.MESSAGES.KEY,
          constants.MESSAGES.OLD_PASS
        ).replace(constants.MESSAGES.NUMBER, 2),
      });
    }
    if (passData.new_pass.length < 2) {
      errors.push({
        fieldName: "new_pass",
        message: constants.MESSAGES.KEY_MIN.replace(
          constants.MESSAGES.KEY,
          constants.MESSAGES.NEW_PASS
        ).replace(constants.MESSAGES.NUMBER, 2),
      });
    }
    if (_.isEqual(passData.new_pass, passData.old_pass)) {
      errors.push({ message: constants.MESSAGES.OLD_NEW_PASS_CANT_SAME });
    }
    if (errors && errors.length > 0) {
      return next(customExc.validationErrors(errors));
    }
    next();
  },

  langCheck: function checkLanguage(req, res, next) {
    var lang = req.params.lang;
    if (lang === undefined) {
      lang = "en";
    }
    req.lang = lang;
    next();
  },

  validateObjectId: function objectIdValidation(objectId) {
    if (
      typeof objectId != "string" ||
      _.isEmpty(objectId) ||
      !objectId.match(/^[0-9a-fA-F]{24}$/)
    )
      return false;
    else return true;
    // return ( objectId.match( /^[0-9a-fA-F]{24}$/ ) );
  },

  validateAccType: function accTypeValidation(accountType, chkOther = false) {
    if (
      _.isEmpty(accountType) ||
      isNaN(accountType) ||
      accountType > 2 ||
      platform < 1
    ) {
      return false;
    } else if (chkOther) {
      //need to check
    } else {
      return true; //only check accoun type
    }
  },

  validDateFormat: function (dateString, inputFormat) {
    var validation = moment(moment(dateString).format(inputFormat)).inspect();
    if (validation.indexOf("invalid") < 0) return true;
    else return false;
  },

  inArrayFound: function foundInArray(array, value) {
    if (array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == value) return true;
      }
      return false;
    } else {
      return false;
    }
  },

  validateUserId: function useridValidate(req, res, next) {
    let userid = req.params.userid || req.query.userid || req.body.userid || "";
    if (!module.exports.validateObjectId(userid)) {
      let custom_err = [
        {
          fieldName: "userid",
          message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
            constants.MESSAGES.KEY,
            constants.MESSAGES.USERID
          ),
        },
      ];
      return next(customExc.validationErrors(custom_err));
    } else {
      next();
    }
  },

  validatePhoneInfo: function phoneinfoValidate(req, res, next) {
    let phoneInfo = {
      phonenumber: req.body.phonenumber || 0,
      country_code: req.body.country_code || 0,
      type: req.body.type,
    };
    let errors = [];
    if (
      phoneInfo.country_code == 0 ||
      isNaN(phoneInfo.country_code) ||
      isNaN(parseInt(phoneInfo.country_code)) ||
      !/^\d+$/.test(phoneInfo.country_code)
    ) {
      errors.push({
        fieldName: "country_code",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          constants.MESSAGES.KEY,
          constants.MESSAGES.COUNTRY_CODE
        ),
      });
    }
    if (
      phoneInfo.phonenumber == 0 ||
      isNaN(phoneInfo.phonenumber) ||
      isNaN(parseInt(phoneInfo.phonenumber)) ||
      !/^\d+$/.test(phoneInfo.phonenumber)
    ) {
      errors.push({
        fieldName: "phonenumber",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          constants.MESSAGES.KEY,
          constants.MESSAGES.PHONENO
        ),
      });
    }
    if (
      phoneInfo.type == undefined ||
      isNaN(phoneInfo.type) ||
      phoneInfo.type < 0 ||
      phoneInfo.type > 1
    ) {
      errors.push({
        fieldName: "type",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          constants.MESSAGES.KEY,
          constants.MESSAGES.TYPE
        ),
      });
    }
    if (errors && errors.length > 0) {
      return next(customExc.validationErrors(errors));
    }
    phoneInfo.phonenumber = phoneInfo.phonenumber.toString(); // need string in authy-client
    phoneInfo.country_code = phoneInfo.country_code.toString(); // need string in authy-client
    req.body.phoneInfo = phoneInfo;
    next();
  },

  validateOtp: function otpValidate(req, res, next) {
    let otp = req.body.otp || "";
    if (isNaN(otp) || isNaN(parseInt(otp))) {
      let custom_err = [
        {
          fieldName: "otp",
          message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
            constants.MESSAGES.KEY,
            constants.MESSAGES.OTP
          ),
        },
      ];
      return next(customExc.validationErrors(custom_err));
    } else {
      req.body.otp = req.body.otp.toString();
      next();
    }
  },

  //date check for YYYYMMDD format
  validateDate: function dateValidation(date) {
    if (date == undefined || date == "" || !String(date).match(/^[0-9]{8}$/))
      return false; //Invalid date
    else return true;
  },

  inArrayObjectFound: function foundInArrayObject(array, value, key) {
    try {
      return array.some((element) => element[key] == value);
    } catch (ex) {
      return false;
    }
  },

  stringAndTrim: function stringandTrim(value) {
    try {
      if (value) {
        value = value.toString().trim();
      }
      return value;
    } catch (ex) {
      return value;
    }
  },

  isInt(n) {
    try {
      return n % 1 === 0; //true means integer, false means float value
    } catch (ex) {
      return true;
    }
  },

  hasWhiteSpace(str) {
    try {
      if (str) {
        str = str.toString();
        return /\s/g.test(str);
      }
      return "fail";
    } catch (ex) {
      return "fail";
    }
  },

  validateUsertype: function usertypeValidate(req, res, next) {
    let user_type = req.query.user_type || "";
    if (
      isNaN(user_type) ||
      isNaN(parseInt(user_type)) ||
      parseInt(user_type) < 0 ||
      parseInt(user_type) > 1
    ) {
      let custom_err = [
        {
          fieldName: "user_type",
          message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
            constants.MESSAGES.KEY,
            constants.MESSAGES.USER_TYPE
          ),
        },
      ];
      return next(customExc.validationErrors(custom_err));
    } else {
      req.query.user_type = parseInt(req.query.user_type);
      next();
    }
  },
};

//========================== Export module end ==================================
