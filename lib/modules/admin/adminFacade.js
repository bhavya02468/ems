"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
const Promise = require("bluebird");
const _ = require("lodash");

//========================== Load internal modules ====================

// Load admin service
const adminService = require("./adminService");
const jwtHandler = require("../../jwtHandler");
const appUtils = require("../../appUtils");
const redisClient = require("../../redisClient/init");
const mappers = require("./mapperFunctions");
const customExc = require("../../customExceptions");
const encrytionDecryption = require("../../encryption-decryption");
const status_codes = require("../../status_codes.json");
const nodemailer = require("nodemailer");
const { remove } = require("lodash");

//========================== Load Modules End ==============================================

var otp
function createSuperAdmin(params) {
  return adminService
    .isEmailExist(params.email)
    .then((isExist) => {
      if (isExist) {
        throw customExc.completeCustomException("email_already_exist", false);
      } else {
        return adminService.createSuperAdmin(params);
      }
    })
    .then((response) => {
      return { responseMessage: "Super Admin created Successfully", response };
    })
    .catch((error) => {
      throw error;
    });
}

function login(loginInfo) {
  return adminService
    .login(loginInfo)
    .then((admin) => {
      console.log(admin,)

      this.admin = admin;
      console.log(admin)
      let tokenObj = buildAdminTokenGenObj(admin);
      return jwtHandler.genAdminToken(tokenObj);
    })
    .then((jwt) => {
      if (jwt) {
        console.log(jwt)
        let redisObj = appUtils.createRedisValueObjectAdmin(this.admin);

        redisClient.setValue(jwt, JSON.stringify(redisObj));

        return mappers.resMapForLogin(this.admin, jwt);
      } else {
        console.log("error")
        throw new customExc.tokenGenException();
      }
    });
}

function createAdmin(params) {
  return adminService
    .isEmailExist(params.email)
    .then((isExist) => {
      if (!isExist) {
        return adminService.createAdmin(params);
      } else
        throw customExc.completeCustomException("email_already_exist", false);
    })
    .then((response) => {
      return { responseMessage: "Admin created Successfully", data: response };
    })
    .catch((error) => {
      throw error;
    });
}

function deleteAdmin(params) {
  return adminService.findByAny({ _id: params.userId }).then((admin) => {
    if (admin) {
      return adminService.deleteByID({ _id: params.userId }).then((result) => {
        return mappers.resMapForDeleteAdmin(result);
      });
    } else {
      throw customExc.completeCustomException("admin_not_found", false);
    }
  });
}

function getList(req) {
  let { role } = req.body;
  let pge_no = parseInt(req.query.page_no) ? parseInt(req.query.page_no) : 0;
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 30;
  let query = [{ is_deleted: { $ne: true } }];
  let column = req.query.column ? req.query.column : "updated";
  let order = parseInt(req.query.order) ? parseInt(req.query.order) : -1;
  let pipeline = [
    { $match: { $and: query } },
    { $sort: { [column]: order } },
    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: pge_no } }],
        data: [{ $skip: parseInt(limit * pge_no) }, { $limit: limit }],
      },
    },
    { $unwind: "$metadata" },
  ];

  if (req.query && req.query.from && req.query.to) {
    query.push({
      created: { $gte: parseInt(req.query.from), $lt: parseInt(req.query.to) },
    });
  }
  // if (req.query && req.query.loginType) {
  //   query.push({ loginType: { $regex: req.query.loginType, $options: "i" } });
  // }
  // if (req.query && req.query.name) {
  //   let regex = new RegExp(req.query.name, "i");
  //   query.push({
  //     $and: [
  //       {
  //         $or: [{ name: regex }, { email: regex }, { "reporting.name": regex }],
  //       },
  //     ],
  //   });
  // }
  if (req.query && req.query.status) {
    query.push({ status: parseInt(req.query.status) });
  }

  if (role || role == 0) {
    query.push({ role: parseInt(role) });
  }
  return adminService
    .findByAgg(pipeline)
    .then((adminData) => {
      if (!adminData)
        throw customExc.completeCustomException("admin_name_not_exists", false);
      else return mappers.successAdminList(adminData);
    })
    .catch((err) => {
      throw err;
    });
}

function getAdminDetails(params) {
  return adminService
    .getAdminDetails(params.id)
    .then((adminDetails) => {
      if (adminDetails) {
        this.adminDetails = adminDetails;
        //let userId = params.id;
        //return loginHistoryService.getUserLoginHistory({ userId });
      } else throw customExc.completeCustomException("user_not_found", false);
    })
    .then((loginHistory) => {
      if (loginHistory) this.adminDetails.loginHistory = loginHistory;
      return mappers.resMapAdminDetails(this.adminDetails);
    })
    .catch((error) => {
      throw error;
    });
}

function updateAdmin(params) {
  let query = { _id: params._id };
  return adminService
    .findByAny(query)
    .then(async (admin) => {
      if (admin) return adminService.updateDetails({ _id: params._id }, params);
    })
    .catch((err) => {
      throw customExc.completeCustomException("admin_not_found", false);
    });
}

function changePass(passInfo) {
  return this.getAdminDetails(passInfo.logininfo)
    .then((adminDetails) => {
      if (adminDetails) {
        this.adminDetails = adminDetails;


        let adminData = {
          key: passInfo.old_password,
          new_pass: passInfo.new_password,
        };


        return adminService
          .changePass(adminData, adminDetails.admin)
          .then((success) => {

            return mappers.resMapForChangePass(success);
          })
          .catch(function (err) {
            throw err;
          });
      }
    })

}
function resetpass(passInfo){
  console.log(passInfo.email)
  return adminService 
  .isEmailExist(passInfo.email)
    .then((adminDetails) => {
      if (adminDetails) {
        this.adminDetails = adminDetails;
        let det=_.omit(adminDetails,'salt');
        det.password=passInfo.new_password
        console.log(det)
      

        return adminService
          .resetPass({},det)
          .then((success) => {

            return mappers.resMapForChangePass(success);
          })
          .catch(function (err) {
            throw err;
          });
      }
    })

}
function buildAdminTokenGenObj(admin) {
  if (admin.role == "0") {
    return {
      _id: admin._id,
      type: "superadmin",
    };
  } else {
    return {
      _id: admin._id,
      type: "admin",
    };
  }

}

function buildforgotTokenGenObj(email) {
 
    return {
      email:email,
      purpose: "forgot",
      type: "superadmin",
    };
    
  

}
//forgotPass via email
function forgotPass(email) {
  let resetToken = "";
  return adminService
    .isEmailExist(email, false)
    .then((emailResult) => {
      if (!emailResult) {
        throw customExc.completeCustomException("admin_not_found", false);
      } else {
        //now gennerate reset token
        resetToken = encrytionDecryption.generate_token();
        console.log(resetToken)
        if (resetToken == "") {
          throw customExc.completeCustomException("not_gen_link", false);
        } else {
          let query = { _id: emailResult._id };
          let editedData = {
            reset_token: resetToken,
            updated: new Date(),
          };

          return adminService.updateDetails(query, editedData);
        }
      }
    })
    .then((updAdmin) => {
      if (!updAdmin || updAdmin == "db_err") {
        throw customExc.completeCustomException("reset_token_mismatch", false);
      } else {
        passwordEmailFunction.send_password_link(updAdmin, resetToken, "admin");
        return mappers.sendMsg("send_otp_email");
      }
    })
    .catch((err) => {
      throw err;
    });
}



function nodemail(data) {
  return adminService
    .isEmailExist(data.email)
    .then((emailresult) => {
      if (!emailresult) {
        throw customExc.completeCustomException("admin_not_found", false);
      } else {
          let tokenObj = buildforgotTokenGenObj(data.email);
          return jwtHandler.genUsrToken(tokenObj)
            .then((jwt) => {
              if (jwt) {
                let redisObj = appUtils.createRedisValueObject(emailresult);
                console.log(redisObj)
                redisClient.setValue(jwt, JSON.stringify(redisObj));
                let x=emailsend(data.email,jwt)
                if (x){
                  return mappers.sendMsg(send_otp_email);
                }
         
              } else {
                throw new customExc.tokenGenException();
              }
            })
    
      




      }
    })
}
function emailsend(data,token){
         
  otp = Math.floor((Math.random() * 10000) + 1)
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'employeemanagementsy@gmail.com',
      pass: data.pass
    }
  });

  let mailOptions = {
    from: 'employeemanagementsy@gmail.com',
    to: data.email,
    subject: 'Password Reset',
    text: `A Password Reset from your email has beeen issued. The code is- ${token}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error.message, "====================");
    }else{
      console.log("done 12111111111111111111111111111111111111111111")
      return info
    }
   

  })
}
function otp() {
    return mappers.sendMsg(success_login)
}
//logout
function logout(user, accessToken, deviceData) {
  redisClient.delToken(accessToken);
  return Promise.resolve(status_codes.logout_success);
}

//matchCodeResetPass
function matchCodeResetPass(tokenPassData) {
  let query = {
    $and: [
      { reset_token: tokenPassData.reset_token },
      { reset_token: { $ne: "" } },
      { reset_token: { $ne: null } },
      { email: { $ne: "" } },
      { email: { $ne: null } },
    ],
  };
  let projection = {};
  return adminService
    .findByAny(query, projection)
    .then((admin) => {
      if (!admin) {
        throw customExc.completeCustomException("reset_token_mismatch", false);
      } else {
        admin.password = tokenPassData.password;
        admin.reset_token = "";
        return adminService.resetPass({}, admin);
      }
    })
    .then((updAdmin) => {
      if (!updAdmin || updAdmin == "db_err") {
        throw customExc.completeCustomException("intrnlSrvrErr", false);
      } else {
        passwordEmailFunction.send_password_reset_success(updAdmin);
        return mappers.sendMsg("pass_chg_success");
      }
    })
    .catch((err) => {
      throw err;
    });
}
//========================== Export Module Start ==============================

module.exports = {
  login,
  changePass,
  matchCodeResetPass,
  forgotPass,
  logout,
  createSuperAdmin,
  createAdmin,
  deleteAdmin,
  getList,
  getAdminDetails,
  updateAdmin,
  nodemail,
  otp,
  resetpass
};

//========================== Export Module End ===============================
