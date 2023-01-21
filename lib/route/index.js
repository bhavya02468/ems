// Initilize redis connection
//const redisClient = require("../redisClient/init");

// Load admin routes
const adminRouter = require("../modules/admin/adminRoute");

// Load employeeRouter routes
const employeeRouter = require("../modules/employee/employeeRoute");
const admin2Router = require("../modules/admin2/adminRoute");


const attendenceRouter = require("../modules/attendence/attendenceRoute");

const holidaysRouter = require("../modules/holidays/holidaysRoute");


//Load basic auth

const basicAuth = require("../middleware/basic-auth");

//Load response handler

const responseHandler = require("../responseHandler");

//========================== Load Modules End ==============================================

//========================== Export Module Start ====== ========================

module.exports = function (app) {
  //cron routes
  /*
    Above of basic auth, we don't need to authenicate with basic auth like in crone
  */
  //Now below all the apis need to authenticate with basic-auth otherwise it will give unauthorized access
  app.use(basicAuth.basicAuthentication);
  // Attach Routes
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/employee", employeeRouter);
  app.use("/api/v1/admin2", admin2Router);

  app.use("/api/v1/attendence", attendenceRouter);
  app.use("/api/v1/holidays", holidaysRouter);

  app.use(responseHandler.hndlError);
};
