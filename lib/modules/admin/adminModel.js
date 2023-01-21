// Importing mongoose
const mongoose = require("mongoose");

//Import bcrypt
const bcrypt = require("bcryptjs");

//import constants
const constants = require("../../constants");

const Schema = mongoose.Schema;
var Admin;

const AdminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    mobile: { type: String, required: true },
    dob:  { type: Date, default:false },
    gender: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    address: { type: String, required: true },
    role: { type: Number, enum: [0, 1], default: 1 },
    salt: { type: String, required: false },
    hash: { type: String, required: false },
    created: { type: Date, default: Date.now }, //created time
    updated: { type: Date, default: Date.now }, //updated time
  },
  {
    versionKey: false,
  }
);

//Load password virtually
AdminSchema.virtual("password")
  .get(function () {
    return this._password;
  })
  .set(function (password) {
    this._password = password;
    var salt = (this.salt = bcrypt.genSaltSync(10));
    this.hash = bcrypt.hashSync(password, salt);
  });

AdminSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

//Export admin module
Admin = module.exports = mongoose.model(
  constants.DB_MODEL_REF.SUPERADMIN,
  AdminSchema
);
