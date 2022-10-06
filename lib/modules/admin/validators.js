//========================== Load Modules Start ===========================

//========================== Load external Module =========================
const _ = require("lodash");
const email_check = require("email-validator");

//========================== Load Internal Module =========================
const constants = require("../../constants");
const customExc = require("../../customExceptions");
const commonValidators = require("../../commonValidations.js");
const uploadDeleteToS3 = require("../../services/uploadDeleteToS3");

//========================== Load Modules End =============================

module.exports = {
  validateSuperCreateAdmin: function (request, response, next) {
    let { email, password } = request.body;
    var errors = [];

    email = request.body.email = _.toLower(email);
    if (_.isEmpty(email)) {
      errors.push({
        fieldName: "email",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          "{{key}}",
          "Email"
        ),
      });
    }
    if (_.isEmpty(password)) {
      errors.push({
        fieldName: "password",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          "{{key}}",
          "Password"
        ),
      });
    }
    if (errors && errors.length > 0) {
      return next(customExc.validationErrors(errors));
    }
    next();
  },

  validateCreateAdmin: function (request, response, next) {
    let { email, password, name, mobile } = request.body;
    var errors = [];

    email = request.body.email = _.toLower(email);
    if (_.isEmpty(email)) {
      errors.push({
        fieldName: "email",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          "{{key}}",
          "Email"
        ),
      });
    }
    if (_.isEmpty(name)) {
      errors.push({
        fieldName: "name",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          "{{key}}",
          "Name"
        ),
      });
    }
    if (_.isEmpty(password)) {
      errors.push({
        fieldName: "password",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          "{{key}}",
          "Password"
        ),
      });
    }
    if (_.isEmpty(mobile)) {
      errors.push({
        fieldName: "mobile",
        message: constants.MESSAGES.KEY_EMPTY_INVALID.replace(
          "{{key}}",
          "Mobile"
        ),
      });
    }
    if (errors && errors.length > 0) {
      return next(customExc.validationErrors(errors));
    }
    next();
  },
};

//========================== Export module end ==================================
