// Importing mongoose
const mongoose = require("mongoose");

//Import bcrypt
const bcrypt = require("bcryptjs");

//import constants
const constants = require("../../constants");

const Schema = mongoose.Schema;
var holidays;

// name, email, gender, address, mobile, dob

const HolSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    holidays: [{
      name: { type: String },
      date: { type: Date },
      createdBy: { type: String },
      updatedBy: { type: String }
    }],
    createdby: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now }, //created time
    updated: { type: Date, default: Date.now }, //updated time
  },
  {
    versionKey: false,
  }
);


//Export user module
holidays = module.exports = mongoose.model(
  constants.DB_MODEL_REF.HOLIDAYS,
  HolSchema
);
