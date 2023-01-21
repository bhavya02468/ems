const empRoutr = require("express").Router();
const resHndlr = require("../../responseHandler");
const validators = require("./validators");
const middleware = require("../../middleware");
const empFacade = require("./adminFacade");
const commonValidators = require("../../commonValidations.js");

// route for signup
empRoutr
  .route("/create")
  .post(
    [middleware.authenticate.autntctTkn, validators.validateCreateEmp],
    function (req, res) {
      let { name, email, gender, address, mobile, dob,password } = req.body;

      empFacade
        .createEmp({
          name,
          email,
          gender,
          address,
          mobile,
          dob,
          password
        })
        .then((result) => {
          resHndlr.sendSuccess(res, result);
        })
        .catch((err) => {
          resHndlr.sendError(res, err);
        });
    }
  );

empRoutr
  .route("/update/:empid")
  .put([middleware.authenticate.autntctTkn], function (req, res) {
    empFacade
      .updateEmp(req.params, req.body.data)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

empRoutr
  .route("/delete/profile/:id")
  .delete([middleware.authenticate.autntctTkn], function (req, res) {
    let userId = req.params.id;


    empFacade
      .deleteEmp({ userId })
      .then((result) => {
        console.log("deleted")

        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        console.log("not deleted")

        resHndlr.sendError(res, err);
      });
  });

empRoutr
  .route("/:empid")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    empFacade
      .getEmpDetails(req.query.empid)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

empRoutr
  .route("/get/list")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    empFacade
      .getAdmins(req)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });
  empRoutr
  .route("/login")
  .post([commonValidators.validateLoginData], function (req, res) {
    empFacade
      .login(req.body.loginInfo)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });
module.exports = empRoutr;
