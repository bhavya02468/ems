//========================== Load Modules Start ===========================

//========================== Load Internal Module =========================

// Load exceptions
const Exception = require("./model/Exception");
const status_codes = require("./status_codes.json");

//========================== Load Modules End =============================

//========================== Export Module Start ===========================

module.exports = {
  intrnlSrvrErr: function (err) {
    // console.log('internal server err', err);
    return new Exception(
      status_codes.intrnlSrvrErr.code,
      status_codes.intrnlSrvrErr.msg,
      err
    );
  },
  unauthorizeAccess: function (err) {
    if (err == "noId")
      return new Exception(
        status_codes.unauth_access_id.code,
        status_codes.unauth_access_id.msg
      );
    else if (err == "noUser")
      return new Exception(
        status_codes.user_not_found.code,
        status_codes.user_not_found.msg
      );
    else
      return new Exception(
        status_codes.unauth_access.code,
        status_codes.unauth_access.msg,
        err
      );
  },
  tokenGenException: function (err) {
    return new Exception(
      status_codes.tokenGenError.code,
      status_codes.tokenGenError.msg,
      err
    );
  },
  getCustomErrorException: function (errMsg, error) {
    return new Exception(5, errMsg, error);
  },
  validationErrors: function (err) {
    // console.log('validationErrors', err, status_codes.valid_errors);
    return new Exception(
      status_codes.valid_errors.code,
      status_codes.valid_errors.msg,
      err
    );
  },
  dbErr: function (err) {
    // console.log('dbErr');
    return new Exception(
      status_codes.intrnlSrvrErr.code,
      status_codes.intrnlSrvrErr.msg,
      err
    );
  },
  completeCustomException: function (type, error) {


    // console.log(type, 'errcode', error , 'errMsg, error');
    if (error == false) {
      return new Exception(status_codes[type].code, status_codes[type].msg);
    } else
      return new Exception(
        status_codes[type].code,
        status_codes[type].msg,
        error
      );
  },
  customExcWithData: function (type, data) {
    // console.log(type, 'customExcWithData', 'data', data);
    return new Exception2(
      status_codes[type].code,
      status_codes[type].msg,
      data
    );
  },
};

//========================== Export Module   End ===========================
