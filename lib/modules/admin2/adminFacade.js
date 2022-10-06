"use strict";

//========================== Load Modules Start =======================

//========================== Load internal modules ====================

// Load user service
const empService = require("./adminService");
const customExc = require("../../customExceptions");
const status_codes = require("../../status_codes.json");
const appUtils = require("../../appUtils");
const mappers = require("./mapperFunctions");
const constants = require("../../constants");
const sms = require("../../services/sms");
const jwtHandler = require("../../jwtHandler");
const redisClient = require("../../redisClient/init");
const encrytionDecryption = require("../../encryption-decryption");


//========================== Load Modules End ==============================================

function createEmp(params) {
  return empService
    .isEmailExist(params.email)
    .then((isExist) => {
      if (!isExist) {
        return empService.createEmp(params);
      } else
        throw customExc.completeCustomException("email_already_exist", false);
    })
    .then((response) => {
      return {
        responseMessage: "Admin created Successfully",
        data: response,
      };
    })
    .catch((error) => {
      console.log(error)
      throw error;
    });
}

function updateEmp(params, empData) {
  empData.updatedAt = new Date().getTime();
  let queryUpdate = { _id: params.empid };
  let editedData = { $set: empData };

  return empService
    .updateDetails(queryUpdate, false, editedData)
    .then((res) => {
      return mappers.success(res);
    })
    .catch((err) => {
      throw customExc.completeCustomException("admin_not_found", false);
    });
}

function deleteEmp(params) {
  return empService.findByAny({ _id: params.userId }).then((admin) => {
    if (admin) {
      console.log("found")
      return empService.deleteByID({ _id: params.userId }).then((result) => {
        return mappers.resMapForDeleteEmp(result);
      });
    } else {
      console.log("not found")
      throw customExc.completeCustomException("admin_not_found", false);
    }
  });
}

function getEmpDetails(id) {
  let query = {
    _id: id,
  };

  return empService
    .getEmpDetails(query)
    .then((empDetails) => {
      if (empDetails) {
        return mappers.resMapEmpDetails(empDetails);
      } else {
        throw customExc.completeCustomException("admin_not_found", false);
      }
    })
    .catch((error) => {
      throw error;
    });
}


function buildAdminTokenGenObj(admin) {
  return {
    _id: admin._id,
    type: "admin",
  };
}
function login(loginInfo) {
  return empService
    .login(loginInfo)
    .then((admin) => {
      this.admin = admin;
      let tokenObj = buildAdminTokenGenObj(admin);
      return jwtHandler.genAdminToken(tokenObj);
    })
    .then((jwt) => {
      if (jwt) {
        let redisObj = appUtils.createRedisValueObjectAdmin(this.admin);

        redisClient.setValue(jwt, JSON.stringify(redisObj));

        return mappers.resMapForLogin(this.admin, jwt);
      } else {
        throw new customExc.tokenGenException();
      }
    });
}
function getAdmins(req) {
  let pge_no = parseInt(req.query.page_no) ? parseInt(req.query.page_no) : 0;
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 30;
  let query = [{}];
  let column = req.query.column ? req.query.column : "updated";
  let order = parseInt(req.query.order) ? parseInt(req.query.order) : -1;

  console.log(new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString());
  console.log(new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString());

  let pipeline = [
    { $match: { $and: query } },
    {
      $project: {
        name: 1,
        email: 1,
        gender: 1,
        address: 1,
        mobile: 1,
        dob: 1,
        isActive: 1,
        created: 1,
        updated: 1,
      },
    },
    { $sort: { [column]: order } },

    {
      $lookup: {
        from: "attendences",
        let: {
          startOfDay: new Date(
            new Date().setUTCHours(0, 0, 0, 0)
          ).toISOString(),
          endOfDay: new Date(
            new Date().setUTCHours(23, 59, 59, 999)
          ).toISOString(),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: ["$created", "$$startOfDay"],
                  },
                  {
                    $lte: ["$created", "$$endOfDay"],
                  },
                ],
              },
            },
          },
        ],
        as: "fromAttend",
      },
    },

    // {
    //   $lookup: {
    //     from: "attendences",
    //     localField: "_id", // field in the orders collection
    //     foreignField: "empId", // field in the items collection
    //     as: "fromAttend",
    //   },
    // },
    // {
    //   $replaceRoot: {
    //     newRoot: {
    //       $mergeObjects: [{ $arrayElemAt: ["$fromAttend", 0] }, "$$ROOT"],
    //     },
    //   },
    // },
    // { $project: { fromAttend: 0 } },

    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: pge_no } }],
        data: [{ $skip: parseInt(limit * pge_no) }, { $limit: limit }],
      },
    },
    { $unwind: "$metadata" },
  ];

  if (req.query && req.query.from && req.query.to) {
    query.push({
      createdAt: {
        $gte: parseInt(req.query.from),
        $lt: parseInt(req.query.to),
      },
    });
  }

  if (req.query && req.query.name) {
    query.push({ name: { $regex: req.query.name, $options: "i" } });
  }
  if (req.query && req.query.status) {
    query.push({ status: parseInt(req.query.status) });
  }
  
 console.log(query)
  return empService
    .findByAgg(pipeline)
    .then((empData) => {
      if (!empData) {
        throw customExc.completeCustomException("admin_not_exists", false);
      } else {
        return mappers.successAdminList(empData);
      }
    })
    .catch((error) => {
      throw error;
    });
}
//========================== Export Module Start ==============================

module.exports = {
  createEmp,
  updateEmp,
  deleteEmp,
  getEmpDetails,
  getAdmins,
  login
};

//========================== Export Module End ===============================
