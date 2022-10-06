const empRoutr = require("express").Router();
const resHndlr = require("../../responseHandler");
const validators = require("./validators");
const middleware = require("../../middleware");
const empFacade = require("./employeeFacade");

// route for signup
empRoutr
  .route("/create")
  .post(
    [middleware.authenticate.autntctTkn, validators.validateCreateEmp],
    function (req, res) {
      let { name, email, gender, address, mobile, dob,Image } = req.body;

      empFacade
        .createEmp({
          name,
          email,
          gender,
          address,
          mobile,
          dob,
          Image
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

    console.log(req, "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");

    empFacade
      .deleteEmp({ userId })
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

empRoutr
  .route("/:empid")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    empFacade
      .getEmpDetails(req.query.empid)
      .then((result) => {
        console.log(result)
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

empRoutr
  .route("/get/list/date")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    empFacade
      .getDateEmployees(req)
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
      .getEmployees(req)
      .then((result) => {
        console.log(result)
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });


module.exports = empRoutr;
