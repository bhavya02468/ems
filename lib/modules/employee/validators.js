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
        mobile: Joi.string()
          .pattern(/^[0-9]+$/)
          .required(),
        role: Joi.number().required(),
        email: Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "org", "edu", "gov", "mil", "int"] },
        }),
        gender: Joi.string().required(),
        address: Joi.string().required(),
        designation: Joi.string().required(),
        dob: Joi.string().required(),
        status: Joi.boolean(),
        Image: Joi.string(),
        password:Joi.string().required(),
        empId:Joi.string()
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
