// Importing mongoose
const mongoose = require("mongoose");

//Import bcrypt
const bcrypt = require("bcryptjs");

//import constants
const constants = require("../../constants");

const Schema = mongoose.Schema;
var Employee;

// name, email, gender, address, mobile, dob

const EmpSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    isActive: { type: Boolean, default: false },
    mobile: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    Image:{ type: String, required:false },
    created: { type: Date, default: Date.now }, //created time
    updated: { type: Date, default: Date.now }, //updated time
  },
  {
    versionKey: false,
  }
);

//Export user module
Employee = module.exports = mongoose.model(
  constants.DB_MODEL_REF.Employee,
  EmpSchema
);
