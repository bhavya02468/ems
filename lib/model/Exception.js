"use strict";

//========================== Class Definitions Start =====================

class Exceptions {
  constructor(errorCode, msg, errStackTrace) {
    this.errCode = errorCode;
    this.msg = msg;
    if (errStackTrace) {
      if (!Array.isArray(errStackTrace)) {
        this.errs = [{ err: errStackTrace }]
      } else {
        this.errs = errStackTrace;
      }
    }
  }
}

//========================== Class Definitions End =======================

//========================== Export module start ==================================

module.exports = Exceptions;

//========================== Export module end ==================================
