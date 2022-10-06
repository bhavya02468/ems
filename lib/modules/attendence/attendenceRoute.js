const attendRoutr = require("express").Router();
const resHndlr = require("../../responseHandler");
const validators = require("./validators");
const middleware = require("../../middleware");
const attendFacade = require("./attendenceFacade");

// route for create and update
attendRoutr
  .route("/create")
  .post(
    [middleware.authenticate.autntctTkn, validators.validateAttendence],
    function (req, res) {
      attendFacade
        .createAttend(req.body)
        .then((result) => {
          resHndlr.sendSuccess(res, result);
        })
        .catch((err) => {
          resHndlr.sendError(res, err);
        });
    }
  );

attendRoutr
  .route("/get/list")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    attendFacade
      .getAttend(req)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });
  attendRoutr
  .route("/get/excel")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    attendFacade
      .getall(req)
      .then((result) => {
        console.log(result)
        resHndlr.sendSuccess(res, result);

      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

// attendRoutr
//   .route("/update/:empid")
//   .put([middleware.authenticate.autntctTkn], function (req, res) {
//     attendFacade
//       .updateEmp(req.params, req.body.data)
//       .then((result) => {
//         resHndlr.sendSuccess(res, result);
//       })
//       .catch((err) => {
//         resHndlr.sendError(res, err);
//       });
//   });

// attendRoutr
//   .route("/delete/profile/:id")
//   .delete([middleware.authenticate.autntctTkn], function (req, res) {
//     let userId = req.params.id;

//     console.log(req, "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");

//     return;
//     attendFacade
//       .deleteEmp({ userId })
//       .then((result) => {
//         resHndlr.sendSuccess(res, result);
//       })
//       .catch((err) => {
//         resHndlr.sendError(res, err);
//       });
//   });

// attendRoutr
//   .route("/:empid")
//   .get([middleware.authenticate.autntctTkn], function (req, res) {
//     attendFacade
//       .getEmpDetails(req.query.empid)
//       .then((result) => {
//         resHndlr.sendSuccess(res, result);
//       })
//       .catch((err) => {
//         resHndlr.sendError(res, err);
//       });
//   });

// attendRoutr
//   .route("/get/list")
//   .get([middleware.authenticate.autntctTkn], function (req, res) {
//     attendFacade
//       .getEmployees(req)
//       .then((result) => {
//         resHndlr.sendSuccess(res, result);
//       })
//       .catch((err) => {
//         resHndlr.sendError(res, err);
//       });
//   });

module.exports = attendRoutr;
