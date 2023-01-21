const empRoutr = require("express").Router();
const resHndlr = require("../../responseHandler");
const validators = require("./validators");
const middleware = require("../../middleware");
const empFacade = require("./employeeFacade");
const commonValidators = require("../../commonValidations.js");

// route for signup
empRoutr
  .route("/create")
  .post(
    [middleware.authenticate.autntctTkn, validators.validateCreateEmp],
    function (req, res) {
      let { name, email, gender, password, address, role, designation, mobile, dob, Image,empId } = req.body;

      empFacade
        .createEmp({
          name,
          email,
          gender,
          password,
          designation,
          address,
          mobile,
          dob,
          Image,
          role,
          empId
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
  .route("/login")
  .post([commonValidators.validateLoginData], function (req, res) {
    console.log("+++++++")
    empFacade
      .login(req.body.loginInfo)
      .then((result) => {
        console.log(result)
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });




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
    console.log(req.query.empid)
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
  .route("/dashboard/list")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    console.log("asdasdasd")
    empFacade
      .getDashboardData(req)
      .then((result) => {
        
        resHndlr.sendSuccess(res,result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });



  empRoutr
  .route("/otp/get")
  
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    let result = {
      msg: "You have logged in successfully.",
    }
    console.log(req.body)
    resHndlr.sendSuccess(res, result);

      })
     

 

empRoutr
  .route("/get/profile/:empid")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    empFacade
      .getProfile(req)
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

empRoutr
  .route("change/put/reset-password")
  .put(function (req, res) {
    console.log("route")
    empFacade
      .resetpass(req.body)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {

        resHndlr.sendError(res, err);
      });
  });

module.exports = empRoutr;
