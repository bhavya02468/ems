const adminRoutr = require("express").Router();
const resHndlr = require("../../responseHandler");
const middleware = require("../../middleware");
const validators = require("./validators");
const commonValidators = require("../../commonValidations.js");
const adminFacade = require("./adminFacade");

adminRoutr
  .route("/")
  // .get([], function (req, res) {
  .get(function (req, res) {
    res.send("Admin Server Working correctly.");
  });
adminRoutr
  .route("/yuio")
  // .get([], function (req, res) {
  .get(function (req, res) {
    
    setTimeout(function(){ var options = {
  'method': 'GET',
  'hostname': 'ems-oe8p.onrender.com',
  'path': '/api/v1/admin/qwert',
  'headers': {
    'Authorization': 'Basic RU1TOlBtRkU9djR5WFR1TXF5N2tGQ3FaKmsqPzM5I1hlZWIkOUJORHAqWjQ='
  },
  'maxRedirects': 20
  };
    var req = http.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    
      res.on("error", function (error) {
        console.error(error);
      });
    });
    
    req.end();
    
    console.log("doing")},2700000)
    console.log("asd")
    res.send("Admin Server Working correctly.");
  });



// create super admin
adminRoutr
  .route("/createsuperadmin")
  .post([validators.validateSuperCreateAdmin], function (req, res) {
    let { email, password, mobile, name } = req.body;
    adminFacade
      .createSuperAdmin({
        email,
        password,
        mobile,
        name,
        role: 0,
      })
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        console.log(err)
        resHndlr.sendError(res, err);
      });
  });
adminRoutr
  .route("/qwert")
  .get(function (req, res) {
    console.log("doing")


    setTimeout(function(){ var options = {
     'method': 'GET',
  'hostname': 'ems-oe8p.onrender.com',
  'path': '/api/v1/admin/qwert',
  'headers': {
    'Authorization': 'Basic RU1TOlBtRkU9djR5WFR1TXF5N2tGQ3FaKmsqPzM5I1hlZWIkOUJORHAqWjQ='
  },
  'maxRedirects': 20
  };
    var req = http.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    
      res.on("error", function (error) {
        console.error(error);
      });
    });
    
    req.end();
    
    console.log("doing")},2700000)
    res.send("Admin Server Working correctly.");
  });
// login super admin and admin
adminRoutr
  .route("/login")
  .post([commonValidators.validateLoginData], function (req, res) {
    adminFacade
      .login(req.body.loginInfo)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        console.log(err)
        resHndlr.sendError(res, err);
      });
  });

// create admin
adminRoutr
  .route("/createadmin")
  .post(
    [middleware.authenticate.autntctTkn, validators.validateCreateAdmin],
    function (req, res) {
      let { email, password, name, mobile } = req.body;

      adminFacade
        .createAdmin({
          email,
          password,
          name,
          mobile,
          role: 1,
        })
        .then((result) => {
          resHndlr.sendSuccess(res, result);
        })
        .catch((err) => {
          resHndlr.sendError(res, err);
        });
    }
  );

// delete admin and super admin
adminRoutr
  .route("/delete/profile/:id")
  .delete([middleware.authenticate.autntctTkn], function (req, res) {
    let userId = req.params.id;
    adminFacade
      .deleteAdmin({ userId })
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

// list admin and supr admin
adminRoutr
  .route("/list")
  .post([middleware.authenticate.autntctTkn], function (req, res) {
    adminFacade
      .getList(req)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });

// details admin and super admin
adminRoutr
  .route("/details/:id")
  .get([middleware.authenticate.autntctTkn], function (req, response) {
    let { id } = req.params;
    adminFacade
      .getAdminDetails({ id })
      .then((result) => {
        resHndlr.sendSuccess(response, result);
      })
      .catch((err) => {
        resHndlr.sendError(response, err);
      });
  });

adminRoutr
  .route("/update/profile")
  .put([middleware.authenticate.autntctTkn], function (req, res) {
    let params = req.body;

    adminFacade
      .updateAdmin(params)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
        resHndlr.sendError(res, err);
      });
  });
  adminRoutr
  .route("/change-password")
  
  .put(function (req, res) {
    adminFacade
      .changePass(req.body)
      .then((result) => {
        console.log("===========res=============",result)
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
      console.log(err,"======abc===")

        resHndlr.sendError(res, err);
      });
  });
  adminRoutr
  .route("/forgot-password")
  
  .post(function (req, res) {
    adminFacade
      .nodemail(req.body)
      .then((result) => {
        console.log("===========res=============",result)
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {
      console.log(err,"======abc===")

        resHndlr.sendError(res, err);
      });
  });





  adminRoutr
  .route("/otp")
  
  .get([middleware.authenticate.autntctTkn],function (req, res) {
    let result={
      msg: "You have logged in successfully.",
    }
    console.log(result)
    resHndlr.sendSuccess(res, result);

      })
     

  adminRoutr
  .route("/reset-password")
  
  .put(function (req, res) {
    adminFacade
      .resetpass(req.body)
      .then((result) => {
        resHndlr.sendSuccess(res, result);
      })
      .catch((err) => {

        resHndlr.sendError(res, err);
      });
  });


    
module.exports = adminRoutr;
