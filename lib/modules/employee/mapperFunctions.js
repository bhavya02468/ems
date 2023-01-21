/**
 * This file will have request and response object mappings.
 *
 * Created by author name
 */

const status_codes = require("../../status_codes.json");
const config = require("../../config").cfg;
const succ_msg = require("../../succ_msg.json");

module.exports = {
  success: function (data) {
    return {
      _id: data._id,
    };
  },
  resMapForDeleteEmp: function () {
    var respObj = {
      msg: status_codes.Employee_deleted.msg,
    };
    return respObj;
  },
  resMapForChangePass: () => {
    return {
      msg: status_codes.pass_chg_success.msg,
    };
  },
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
  resMapEmpDetails: function (response) {
    var respObj = {
      msg: "Employee Detail fetch",
      admin: {
        _id: response._id,
        name: response.name,
        email: response.email,
        mobile: response.mobile,
        isActive: response.isActive,
        gender: response.gender,
        designation:response.designation,
        address: response.address,
        dob: response.dob,
        created: response.created,
        updated: response.updated,
        Image: response.Image,
        empId:response.empId
      },
    };
    return respObj;
  },
  resMapEmpDetailsforpassword: function (response) {
    var respObj = {
      msg: "Employee Detail fetch",
      admin: {
        _id: response._id,
        name: response.name,
        email: response.email,
        mobile: response.mobile,
        isActive: response.isActive,
        gender: response.gender,
        designation:response.designation,
        address: response.address,
        dob: response.dob,
        created: response.created,
        updated: response.updated,
        Image: response.Image,
        salt: response.salt,
        hash: response.hash

      },
    };
    return respObj;
  },

  successEmployeeList: function (data) {
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

  signup: (data, usr, otp, type) => {
    let response_data = {};
    response_data = status_codes.usr_signup;
    if (type === "login") {
      if (data.is_resend) response_data = status_codes.resend_otp;
      else response_data = status_codes.enter_otp_cont;
    }
    response_data._id = usr._id;
    delete response_data.acsTkn;
    return response_data;
  },

  resSignupProcesses: (params, step, usrProfile, usrExp) => {
    let response_data = status_codes.usr_upd_succ;
    response_data.pno = params.user.pno || "0";
    if (step === 5 || step === 6 || step == 9) {
      response_data.img = params.filesArray[0].filename;
      response_data.uni = params.uni;
      response_data.bP =
        config.s3UploadPaths.endPoint + config.s3UploadPaths.user.profile;
    }
    if (step === 8) {
      if (params.user.s_type == 0)
        response_data.username = params.user.username;
      else response_data.username = "";
      response_data.f_name = usrProfile.f_name || "";
      response_data.l_name = usrProfile.l_name || "";
      response_data.img =
        usrProfile.img && usrProfile.img != ""
          ? config.s3UploadPaths.endPoint +
            config.s3UploadPaths.user.profile +
            usrProfile.img
          : "" || "";
      response_data.is_video =
        usrProfile.video && usrProfile.video != "" ? true : false || false;
      if (usrExp && usrExp.exps) {
        response_data.expInfo = {
          exps: usrExp.exps || [],
          mths: usrExp.mths,
          yrs: usrExp.yrs,
        };
      } else response_data.expInfo = {};
      delete response_data.bP;
    }
    response_data._id = params.user._id;
    return response_data;
  },

  delMedia: (params) => {
    let response_data = status_codes.del_media;
    return response_data;
  },

  usersList: (result, params) => {
    let response_data = {
      page: params.pageNo,
      lmt: params.limit,
      ttl: 0,
      usr: [],
    };
    if (result && result.length > 0 && result[0].usr) {
      response_data.usr = result[0].usr || [];
      response_data.ttl = result[0].total || 0; //total
    }
    return response_data;
  },

  viewUser: (params, data) => {
    let response_data = {
      usr: {
        username: params.usrRslt.username,
        pno: params.usrRslt.pno,
        c_code: params.usrRslt.c_code,
        s_type: params.usrRslt.s_type,
        _id: params.usrRslt._id,
        offline: params.usrRslt.offline,
        pub: params.usrRslt.pub,
        notif: params.usrRslt.notif,
      },
      prfl: (data[0] && data[0][0] ? data[0][0] : {}) || {},
      crt: (data[1] ? (data[1].certs ? data[1].certs : []) : []) || [],
      expInfo: (data[2] ? data[2] : {}) || {},
      // exp: (data[2]? data[2].exps?data[2].exps:[]: []) || [],
      is_bdge: data[3].length > 0 ? data[3][0].is_bdge : false,
      bP: config.s3UploadPaths.endPoint + config.s3UploadPaths.user.profile,
      f_count: data[4],
      v_count: data[5],
    };

    if (params.isUser === true) {
      response_data.fl_count = data[6];
      response_data.r_count = data[7];
    }
    return response_data;
  },

  viewMedia: (params) => {
    let response_data = status_codes.media_info;
    response_data.imgs = [];
    if (params.usrProfile && params.usrProfile.imgs) {
      response_data.imgs = params.usrProfile.imgs;
      response_data.bP =
        config.s3UploadPaths.endPoint + config.s3UploadPaths.user.profile;
    }
    return response_data;
  },

  firebaseMedia: (params) => {
    return {
      img:
        config.s3UploadPaths.endPoint +
        config.s3UploadPaths.firebase +
        params.usrMediaInfo.media.filename,
      th: config.s3UploadPaths.endPoint + params.th,
      uni: params.usrMediaInfo.uni,
    };
  },

  usersData: (params) => {
    return {
      bP: config.s3UploadPaths.endPoint + config.s3UploadPaths.user.profile,
      users: params,
    };
  },

  recomendList: (data, params) => {
    let msg =
      params.key == 0 || params.key == "0"
        ? status_codes.unrecomend_list.msg
        : status_codes.recomend_list.msg;
    let response_data = {
      msg: msg,
      page: params.pageNo,
      lmt: params.limit,
      ttl: 0,
      usr: [],
    };
    if (data && data.length > 0 && data[0].usr) {
      (response_data.msg = msg), (response_data.usr = data[0].usr || []);
      response_data.ttl = data[0].total || 0; //total
      response_data.bP =
        config.s3UploadPaths.endPoint + config.s3UploadPaths.user.profile;
    }
    return response_data;
  },

  otherUserView: (params, data) => {
    let response_data = {
      usr: {
        username: params.usrRslt.username,
        pno: params.usrRslt.pno,
        c_code: params.usrRslt.c_code,
        s_type: params.usrRslt.s_type,
        _id: params.usrRslt._id,
        offline: params.usrRslt.offline,
        pub: params.usrRslt.pub,
        notif: params.usrRslt.notif,
      },
      prfl: (data[0] && data[0][0] ? data[0][0] : {}) || {},
      crt: (data[1] ? (data[1].certs ? data[1].certs : []) : []) || [],
      expInfo: (data[2] ? data[2] : {}) || {},
      // exp: (data[2]? data[2].exps?data[2].exps:[]: []) || [],
      is_frnd: data[3].length > 0 ? data[3][0].is_frnd : 0,
      is_block: data[4].length > 0 ? data[4][0].is_block : 0,
      is_bdge: data[5] > 0 ? true : false,
      bP: config.s3UploadPaths.endPoint + config.s3UploadPaths.user.profile,
    };
    return response_data;
  },

  commonList: (data, params, status_codes) => {
    let msg =
      params.key == 0 || params.key == "0"
        ? status_codes.msg
        : status_codes.msg;
    let response_data = {
      msg: msg,
      page: params.pageNo,
      lmt: params.limit,
      ttl: 0,
      users: [],
    };
    if (data && data.length > 0 && data[0].usr) {
      (response_data.msg = msg), (response_data.users = data[0].usr || []);
      response_data.ttl = data[0].total || 0; //total
      response_data.bP =
        config.s3UploadPaths.endPoint + config.s3UploadPaths.user.profile;
    }
    return response_data;
  },

  recomendListOwn: (data, params, msg) => {
    let response_data = {
      msg: msg,
      page: params.pageNo,
      lmt: params.limit,
      ttl: 0,
      org: [],
    };
    if (data && data.length > 0 && data[0].orgs) {
      response_data.msg = msg;
      response_data.org = data[0].orgs || [];
      response_data.ttl = data[0].total || 0; //total
      response_data.bP =
        config.s3UploadPaths.endPoint + config.s3UploadPaths.org.profile;
    }
    return response_data;
  },

  badgesList: (result, params) => {
    let response_data = {
      page: params.pageNo,
      lmt: params.limit,
      ttl: 0,
      bdgs: [],
    };
    if (result && result.length > 0 && result[0].bdgs) {
      response_data.bdgs = result[0].bdgs || [];
      response_data.ttl = result[0].total || 0; //total
    }
    response_data.usr_bP =
      config.s3UploadPaths.endPoint + config.s3UploadPaths.user.profile;
    response_data.org_bP =
      config.s3UploadPaths.endPoint + config.s3UploadPaths.org.profile;
    return response_data;
  },
  sendMsg: (type) => {
    return {
      msg: succ_msg[type],
    };
  },
};
