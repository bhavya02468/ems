const STATUS_CODE = {
  ERROR: 0,
  SUCCESS: 1,
};

const ACCOUNT_LEVEL = {
  ADMIN: 1,
  NORMAL_USER: 0,
};

const STATIC_AUTHZ = {
  PASSWORD: "ABC!@ex@39211$",
  INVALID: "Authorization is invalid.",
  ERR: "Authorization Error.",
};

const DB_MODEL_REF = {
  Employee: "Employee",
  ADMIN: "Admin",
  SUPERADMIN: "Admin",
  ATTENDENCE: "Attendence",
};

const PUSH_NOTIF = {
  short_title: "abc Jobs",
  title: "ABC",
  usr_chat: ["A user send you a message"],
};

const MESSAGES = {
  KEY_EMPTY_INVALID: "{{key}} is empty or invalid.",
  KEY_EMPTY: "{{key}} is empty.",
  KEY_INVALID: "{{key}} is invalid.",
  KEY_MIN: "{{key}} should be minimum of {{Number}} characters.",
  MIN_IMG_UPLOAD: "Atleast one file required to upload the media.",
  KEY_INVALID_OBJ_ID: "{{key}} is of invalid object id.",
  MIN_ONE_FIELD_REQD: "Minimum one field is required to update data.",
  ATLEAST_ONE_ID:
    "Please provide atleast one id. It may be either email or linkedin or facebook.",
  OLD_NEW_PASS_CANT_SAME: "Old and new password can't be same.",
  NO_UPD_DATA_FND: "No update data found.",
  NO_EMAIL_PNO: "Neither email nor phonenumber found.",
};

const DEVICE_TYPE = [1, 2, 3]; // 1 for ios, 2 for android, 3 for web

const DATE_FORMATS = {
  DOB: "YYYY MM DD",
};

module.exports = Object.freeze({
  STATUS_CODE,
  ACCOUNT_LEVEL,
  DB_MODEL_REF,
  MESSAGES,
  STATIC_AUTHZ,
  DEVICE_TYPE,
  DATE_FORMATS,
  PUSH_NOTIF,
});
