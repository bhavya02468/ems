/**
 * This file will have request and response object mappings.
 *
 * Created by author name
 */

const status_codes = require("../../status_codes.json");
const succ_msg = require("../../succ_msg.json");

module.exports = {
  resMapForLogin: (admin, jwt) => {
    return {
      msg: succ_msg.success_login,
      acsT: jwt,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  },
  resmapforforgot: (admin, jwt) => {
    return {
      msg: succ_msg.success_login,
      
    };
  },

  resMapForChangePass: () => {
    return {
      msg: status_codes.pass_chg_success.msg,
    };
  },

  bulkUpload: (msg, params) => {
    return {
      msg: msg + " " + status_codes.bulk_upl.msg,
    };
  },

  resMapForDeleteAdmin: function () {
    var respObj = {
      msg: status_codes.admin_deleted.msg,
    };
    return respObj;
  },

  resMapAdminDetails: function (response) {
    var respObj = {
      msg: "Admin Detail fetch",
      admin: {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
        mobile: response.mobile,
        status: response.status,
        created: response.created,
        updated: response.updated,
        hash: response.hash,
        salt: response.salt
      },
    };
    // if (response.loginHistory) {
    //   respObj.admin.loginHistory = response.loginHistory;
    // }
    return respObj;
  },

  successAdminList: function (data) {
    return {
      result:
        data.length > 0 && Array.isArray(data[0].data) ? data[0].data : [],
      total:
        data.length > 0 && data[0].metadata.total ? data[0].metadata.total : 0,
      page:
        data.length > 0 && data[0].metadata.page ? data[0].metadata.page : 0,
      page_size:
        data.length > 0 && Array.isArray(data[0].data)
          ? data[0].data.length
          : 0,
    };
  },

  coutnInfo: (data) => {
    return {
      usr: data[0] && typeof data[0] === "number" ? data[0] : 0 || 0,
      org: data[1] && typeof data[1] === "number" ? data[1] : 0 || 0,
    };
  },

  sendMsg: (type) => {
    return {
      msg: succ_msg[type],
    };
  },
};
