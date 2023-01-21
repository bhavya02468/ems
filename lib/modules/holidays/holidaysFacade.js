"use strict";

//========================== Load Modules Start =======================

//========================== Load internal modules ====================

// Load user service
const holidayService = require("./holidaysService");
const customExc = require("../../customExceptions");
const status_codes = require("../../status_codes.json");
const appUtils = require("../../appUtils");
const mappers = require("./mapperFunctions");
const constants = require("../../constants");
const sms = require("../../services/sms");
const jwtHandler = require("../../jwtHandler");
const redisClient = require("../../redisClient/init");
const mongoose = require("mongoose")
//========================== Load Modules End ==============================================

function createHol(params) {
  return holidayService.createHol(params)
    .then((response) => {
      return {
        responseMessage: "Holiday created Successfully",
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
  let queryUpdate = {
    _id:mongoose.Types.ObjectId("636b72fbbadf5fb1fdc00ef5"),
    "holidays._id": mongoose.Types.ObjectId(params.empid)
  }
  let Data = { 
    $set: { 
      "holidays.$.name": empData.name, 
    "holidays.$.date": empData.date 
    }
  }
    
 // console.log(params, empData)
  return holidayService
    .updateDetails(queryUpdate, false, Data)
    .then((res) => {
    
      return mappers.success(res);
    })
    .catch((err) => {
      console.log(err)
      throw customExc.completeCustomException("employee_not_found", false);
    });
}

function deleteHol(params) {
  let projection = {holidays: {$elemMatch: {_id:mongoose.Types.ObjectId(params.userId)}}};
  let query = {_id:mongoose.Types.ObjectId("636b72fbbadf5fb1fdc00ef5")};

  return holidayService.findByAny(query,projection).then((admin) => {
    if (admin) {
     let query= { '_id': mongoose.Types.ObjectId("636b72fbbadf5fb1fdc00ef5") }
     let projection={ $pull: { holidays: { _id: mongoose.Types.ObjectId(params.userId) } } }
     let options={new:false}

      return holidayService.deleteByID(query,projection,options).then((result) => {
        return mappers.resMapForDeleteEmp(result);
      });
    } else {
      throw customExc.completeCustomException("employee_not_found", false);
    }
  });
}

function getHolDetails(id) {
  let query = {
    _id: id,
  };

  return holidayService
    .getHolDetails(query)
    .then((HolDetails) => {
      if (HolDetails) {
        return mappers.resMapHolDetails(HolDetails);
      } else {
        throw customExc.completeCustomException("employee_not_found", false);
      }
    })
    .catch((error) => {
      throw error;
    });
}


function getHolidays(req) {
  let pge_no = parseInt(req.query.page_no) ? parseInt(req.query.page_no) : 0;
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 100000;
  let query = [{}];
  let searchval = req.query.search ? req.query.search : "";
  let column = req.query.column ? req.query.column : "name";
  let order = parseInt(req.query.order) ? parseInt(req.query.order) : 1;

  let pipeline = [
    { $match: { $and: query } },
    {
      $project: {
        name: 1,
        createdby: 1,
        date: 1,
        holidays: 1,
        created: 1,
        updated: 1,
      },
    },
    { $sort: { [column]: order } },



    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$fromAttend", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { fromAttend: 0 } },

    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: pge_no } }],
        data: [{ $skip: parseInt(limit * pge_no) }, { $limit: limit }],
      },
    },
    { $unwind: "$metadata" },
  ];
console.log(req.query.name)
  if (req.query && req.query.name) {
   query.push({ _id:mongoose.Types.ObjectId("636b72fbbadf5fb1fdc00ef5")})
    query.push({
      _id:mongoose.Types.ObjectId("636b72fbbadf5fb1fdc00ef5"),holidays: {$elemMatch: {name:req.query.name}}}
      );
  }

  return holidayService
    .findByAgg(pipeline)
    .then((empData) => {
      if (!empData) {
        throw customExc.completeCustomException("employee_not_exists", false);
      } else {
        return mappers.successEmployeeList(empData);
      }
    })
    .catch((error) => {
      throw error;
    });
}


//========================== Export Module Start ==============================

module.exports = {
  createHol,
  updateEmp,
  deleteHol,
  getHolDetails,
  getHolidays,
};

//========================== Export Module End ===============================
