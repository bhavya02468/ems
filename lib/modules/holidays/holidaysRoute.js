const holidayRoutr = require("express").Router();
const resHndlr = require("../../responseHandler");
const validators = require("./validators");
const middleware = require("../../middleware");
const holidayFacade = require("./holidaysFacade");
const commonValidators = require("../../commonValidations.js");

// route for signup
holidayRoutr
.route("/see")
.get([], function (req, res) {
  res.send("working")}
)
holidayRoutr
  .route("/create")
  .post(
    [middleware.authenticate.autntctTkn, validators.validateCreateEmp],
    function (req, res) {
      let { name, date, createdBy, } = req.body;

      holidayFacade
        .createHol({
          name,
          date,
          createdBy,
        })
        .then((result) => {
          resHndlr.sendSuccess(res, result);
        })
        .catch((err) => {
          resHndlr.sendError(res, err);
        });
    }
  );


holidayRoutr
  .route("/update/:empid")
  .put([middleware.authenticate.autntctTkn], function (req, res) {
    holidayFacade
      .updateEmp(req.params, req.body.data)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

holidayRoutr
  .route("/delete/profile/:id")
  .delete([middleware.authenticate.autntctTkn], function (req, res) {
    let userId = req.params.id;
    holidayFacade
      .deleteHol({ userId })
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

holidayRoutr
  .route("/:empid")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    holidayFacade
      .getHolDetails(req.query.empid)
      .then((result) => {
        console.log(result)
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

  
 holidayRoutr
  .route("/get/list")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    holidayFacade
      .getHolidays(req)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });


module.exports = holidayRoutr;
