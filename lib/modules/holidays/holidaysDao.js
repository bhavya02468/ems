"use strict";

//========================== Load Modules Start =======================

//========================== Load internal modules ====================

//========================== Load internal modules ====================
const customExceptions = require("../../customExceptions");
const mongoose = require("mongoose");

const holidays = require("./holidaysModel");

// init user dao
let BaseDao = new require("../../dao/baseDao");
const holDao = new BaseDao(holidays);

//========================== Load Modules End ==============================================
function createHol(params) {
  let query={"_id": mongoose.Types.ObjectId("636b72fbbadf5fb1fdc00ef5")}
  console.log(params)
  let editedData={$push: {"holidays": params}}
  let options={new:false}
  return holDao.update(query, editedData, options)
  .then((result) => {
    if (result) return result;
    return false;
  });

}

function findByAny(query, projection) {
  return holDao.findOne(query, projection).then((result) => {
    if (result) return result;
    return false;
  });
}

function updateDetails(query, editedData, options) {
  console.log(query,editedData)

  return holDao.
  update(query, editedData, options)
   .then((result) => {
      console.log(result)
      return result;
    })
    .catch((err) => {
      throw customExc.dbErr(err);
    });
}

function deleteByID(query,projection,options) {
  return holDao.update(query,projection,options)
}

function findById(params) {
  let projection = {holidays: {$elemMatch: {_id:mongoose.Types.ObjectId(params._id)}}};
  let query = {_id:mongoose.Types.ObjectId("636b72fbbadf5fb1fdc00ef5")};
  return holDao
    .findOne(query,projection)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw customExc.dbErr(err);
    });
}

function findByAgg(query) {
  return holDao
    .aggregate(query)
    .then(function (result) {
      return result;
    })
    .catch(function (err) {
      return "db_err";
    });
}
function findByEmail(params) {
  let query = {};
  query.email = {
    $regex: new RegExp(["^", params.email, "$"].join("")),
    $options: "i",
  };
  let projection = {};
  return holDao
    .findOne(query, projection)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err)
      throw customExc.dbErr(err);
    });
}
//========================== Export Module Start ==============================

module.exports = {
  createHol,
  findByAny,
  updateDetails,
  deleteByID,
  findById,
  findByAgg,
  findByEmail
};

//========================== Export Module End ===============================
