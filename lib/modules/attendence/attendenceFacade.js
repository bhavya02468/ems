"use strict";

//========================== Load Modules Start =======================

//========================== Load internal modules ====================

// Load user service
const attendenceService = require("./attendenceService");
const customExc = require("../../customExceptions");
const status_codes = require("../../status_codes.json");
const appUtils = require("../../appUtils");
const mappers = require("./mapperFunctions");
const constants = require("../../constants");
const sms = require("../../services/sms");
const mongoose = require("mongoose");

//========================== Load Modules End ==============================================

function createAttend(body) {
  let startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  let endOfDay = new Date(
    new Date().setUTCHours(23, 59, 59, 999)
  ).toISOString();
  body.date=("inTime" in body) ? body.inTime.substring(0, 10):body.outTime.substring(0, 10);

  let queryUpdate = {
    empId: mongoose.Types.ObjectId(body.empId),
    date: body.date,
  };
  // body.date=body.inTime.substring(0, 10)||body.outTime.substring(0, 10)
  let editedData = body;
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };

  return attendenceService
    .updateDetails(queryUpdate, editedData, options)
    .then((res) => {
      return {
        response: "Data created successfully",
        data: res,
      };
    })
    .catch((error) => {
      console.log(error, "-=-=-==-=error-==-=-=-");
      throw error;
    });
}

function getAttend(req) {
  let pge_no = parseInt(req.query.page_no) ? parseInt(req.query.page_no) : 1;
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 30;
  let query = [{}];
  let column = req.query.column ? req.query.column : "name";
  let order = parseInt(req.query.order) ? parseInt(req.query.order) : -1;

  let pipeline = [
    { $match: { $and: query } },
    {
      $project: {
        name: 1,
        email: 1,
        empId: 1,
        inTime: 1,
        outTime: 1,
      },
    },
    { $sort: { [column]: order } },
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

  return attendenceService
    .findByAgg(pipeline)
    .then((empData) => {
      if (!empData) {
        console.log()
        throw customExc.completeCustomException("employee_not_exists", false);
      } else {
        return mappers.successEmployeeList(empData);
      }
    })
    .catch((error) => {
      throw error;
    });
}
function getall(req){
  let pge_no = parseInt(req.query.page_no) ? parseInt(req.query.page_no) : 0;
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 30;
  let query = [{}];
  let column ="date"
  let order =1;

  let startdate=new Date()
  startdate.setMonth(startdate.getMonth()-1)
  startdate.setDate('01')
  let enddate=new Date()


  enddate.setMonth(enddate.getMonth()-1)

  enddate.setDate("31")
  enddate.setHours("00")
  startdate.setHours("00")


  enddate.toISOString()
  startdate.toISOString()
  
  
  console.log(startdate)


  let pipeline = [
    { $match: { $and: query } },
    {
      $project: {
        name: 1,
        inTime: 1,
        date:1,
        outTime: 1,
      },
    },
    { $sort: { [column]: order } },
    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: pge_no } }],
        data: [{ $skip: parseInt(limit * pge_no) }, { $limit: limit }],
      },
    },
    { $unwind: "$metadata" },
  ];

  // if (req.query && req.query.from && req.query.to) {
  //   query.push({
  //     createdAt: {
  //       $gte: parseInt(req.query.from),
  //       $lt: parseInt(req.query.to),
  //     },
  //   });
  // }



  if(true){
    query.push({
        date: {
          $gte: startdate,
          // $lt: enddate
        },
      });
      }
  
  console.log(query)
  return attendenceService
    .findByAgg(pipeline)
    .then((empData) => {
      if (!empData) {
        throw customExc.completeCustomException("employee_not_exists", false);
      } else {
        return mappers.successEmployeeList(empData);
      }
    })
    .catch((error) => {
      console.log(error)
      throw error;
    });
}






//========================== Export Module Start ==============================

module.exports = {
  createAttend,
  getAttend,
  getall
};

//========================== Export Module End ===============================
