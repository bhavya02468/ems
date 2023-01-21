"use strict";

//========================== Load Modules Start =======================

//========================== Load internal modules ====================

//========================== Load internal modules ====================
const customExceptions = require("../../customExceptions");
const mongoose = require("mongoose");

const Attendence = require("./attendenceModel");

// init user dao
let BaseDao = new require("../../dao/baseDao");
const attndDao = new BaseDao(Attendence);

//========================== Load Modules End ==============================================

// function updateDetails(params) {
//   var attend = new Attendence(params);
//   return attndDao.save(attend);
// }

// function findByAny(query, projection) {
//   return attndDao.findOne(query, projection).then((result) => {
//     if (result) return result;
//     return false;
//   });
// }

function updateDetails(query, editedData, options) {
  return attndDao
    .findOneAndUpdate(query, editedData, options)
    .then((result) => {
      if (result) return result;
      return false;
    });
}
function updateMany(query, editedData, options) {
  return attndDao
    .updateMany(query, editedData, options)
    .then((result) => {
      if (result) return result;
      return false;
    });
}

// function deleteByID(params) {
//   return attndDao.findByIdAndRemove(params, {});
// }

// function findById(params) {
//   let query = {};
//   query._id = mongoose.Types.ObjectId(params._id);
//   let projection = {};
//   return attndDao
//     .findOne(query, projection)
//     .then((result) => {
//       return result;
//     })
//     .catch((err) => {
//       throw customExc.dbErr(err);
//     });
// }

function findByAgg(query) {
  return attndDao
    .aggregate(query)
    .then(function (result) {
      return result;
    })
    .catch(function (err) {
      return "db_err";
    });
}
function getall(){
  return attndDao
  .find()
  .then(function (result) {
    return result;
  })
  .catch(function (err) {
    console.log(err)
    return "db_err";
  });
}
  

//========================== Export Module Start ==============================

module.exports = {
  updateDetails,
  // findByAny,
  // updateDetails,
  // deleteByID,
  // findById,
  findByAgg,
  getall,
  updateMany
};

//========================== Export Module End ===============================
