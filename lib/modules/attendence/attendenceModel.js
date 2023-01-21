// Importing mongoose
const mongoose = require("mongoose");

//Import bcrypt
const bcrypt = require("bcryptjs");

//import constants
const constants = require("../../constants");

const Schema = mongoose.Schema;
var Attendence;

// name, email, gender, address, mobile, dob

const attendSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    // comment: { type: String },
    inTime: { type: Date },
    outTime: { type: Date },
    empId: {  type: String,required: true},
    created: { type: Date, default: Date.now }, //created time
    updated: { type: Date, default: Date.now }, //updated time
    date: { type: Date } //date of intime
  },
  {
    versionKey: false,
  }
);

//Export user module
Attendence = module.exports = mongoose.model(
  constants.DB_MODEL_REF.ATTENDENCE,
  attendSchema
);
