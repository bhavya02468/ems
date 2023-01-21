"use strict"

//========================== Load Modules Start ==========================

//========================== Load Internal Modules ==========================

const constants = require('../constants');

//========================== Load Modules End ==========================

//========================== Class Definitions Start =====================

class APIResponse {
    constructor(sc, result) {
        this.status = sc;
        if (sc == constants.STATUS_CODE.SUCCESS) {
            result ? this.res = result : constants.EMPTY;
        } else {
            result ? this.err = result : constants.EMPTY;
        }
        // this.time = new Date().getTime();
    }
}

//========================== Class Definitions End =======================

//========================== Export module start ==================================

module.exports = APIResponse;

//========================== Export module end ==================================
