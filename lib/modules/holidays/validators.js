//========================== Load Modules Start ===========================

//========================== Load external Module =========================
const _ = require("lodash");
const email_check = require("email-validator");

//========================== Load Internal Module =========================
const constants = require("../../constants");
const customExc = require("../../customExceptions");
const commonValidators = require("../../commonValidations.js");
const Joi = require("joi");

//========================== Load Modules End =============================

module.exports = {
  validateCreateEmp: function (req, res, next) {
    try {
      const schema = Joi.object({
        _id: Joi.string(),
        name: Joi.string().required(),
        createdBy: Joi.string().required(),
        date: Joi.string().required(),
      }).options({ abortEarly: false });

      let value = schema.validate(req.body);
      if (!value.error) {
        next();
      } else {
        let { details } = value.error;
        let message = details.map((i) => {
          return {
            message: i.message.replace(/['"]/g, ""),
            fieldName: i.context.key,
          };
        });
        return next(customExc.validationErrors(message));
      }
    } catch (err) {
      console.log(err);
      return next(customExc.intrnlSrvrErr(err));
    }
  },
};

//========================== Export module end ==================================
