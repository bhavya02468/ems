"use strict";

//========================== Load Modules Start =======================

//========================== Load internal modules ====================

// Load user service
const empService = require("./employeeService");
const attendService = require("../attendence/attendenceService");
const customExc = require("../../customExceptions");
const status_codes = require("../../status_codes.json");
const appUtils = require("../../appUtils");
const mappers = require("./mapperFunctions");
const constants = require("../../constants");
const sms = require("../../services/sms");
const jwtHandler = require("../../jwtHandler");
const redisClient = require("../../redisClient/init");
const encrytionDecryption = require("../../encryption-decryption");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

//========================== Load Modules End ==============================================

function createEmp(params) {
  return empService
    .isEmailExist(params.email)
    .then((isExist) => {
      if (!isExist) {
        return empService.createEmp(params);
      } else
        throw customExc.completeCustomException("email_already_exist", false);
    })
    .then((response) => {
      return {
        responseMessage: "Employee created Successfully",
        data: response,
      };
    })
    .catch((error) => {
      throw error;
    });
}

function login(loginInfo) {
  return empService
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

function updateEmp(params, empData) {
  empData.updatedAt = new Date().getTime();
  let queryUpdate = { _id: params.empid };
  let prevempId="none"
  if (empData.prevempId){
    prevempId=empData.prevempId
    delete empData.prevempId
  }
  let editedData = { $set: empData };

  console.log("======",editedData)
  console.log("+++++",queryUpdate)
  console.log("+++++",prevempId)
  return empService
    .updateDetails(queryUpdate, false, editedData)
    .then((res) => {
      if (prevempId!="none"){
        let query={ empId: prevempId  }
        let empId
        let options={}
        let Data={$set:{empId:empData.empId}}
       
        console.log(query)
        console.log(Data)
        
        // { $set: { "Review" : true } }
        attendService.updateMany(query,Data,options).then((res)=>{
          console.log(res)
        })
      }
      return mappers.success(res);
    })
    .catch((err) => {
      throw customExc.completeCustomException("employee_not_found", false);
    });
}

function deleteEmp(params) {
  return empService.findByAny({ _id: params.userId }).then((admin) => {
    if (admin) {
      return empService.deleteByID({ _id: params.userId }).then((result) => {
        return mappers.resMapForDeleteEmp(result);
      });
    } else {
      throw customExc.completeCustomException("employee_not_found", false);
    }
  });
}

function getEmpDetails(empid) {
    let params={
      id:empid
    }
  return empService
    .getEmpDetails(params)
    .then((empDetails) => {
      if (empDetails) {
        console.log( "======ffff===")

        return mappers.resMapEmpDetails(empDetails);
      } else {
        throw customExc.completeCustomException("employee_not_found", false);
      }
    })
    .catch((error) => {
      throw error;
    });
}


function getDateEmployees(req) {
  let pge_no = parseInt(req.query.page_no) ? parseInt(req.query.page_no) : 0;
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10000;
  let query = [{}];
  let column = req.query.column ? req.query.column : "name";
  let order = parseInt(req.query.order) ? parseInt(req.query.order) : 1;
  let datey =new Date(req.query.date)
  console.log(req.query.date)

  let pipeline = [
    { $match: { $and: query } },
    {
      $project: {
        name: 1,
        email: 1,
        gender: 1,
        address: 1,
        mobile: 1,
        dob: 1,
        isActive: 1,
        created: 1,
        updated: 1,
        empId:1,
      },
    },
    { $sort: { [column]: order } },

    {
      $lookup: {
        from: "attendences",
        localField: "empId",
        foreignField: "empId",
        let: {
          startOfDay: datey,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: ["$date", "$$startOfDay"],
                  },
                  {
                    $lte: ["$date", "$$startOfDay"],
                  },

                ],
              },
            },
          },
        ],
        as: "fromAttend",
      },
    },

    // {
    //   $lookup: {
    //     from: "attendences",
    //     localField: "_id", // field in the orders collection
    //     foreignField: "empId", // field in the items collection
    //     as: "fromAttend",
    //   },
    // },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$fromAttend", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { fromAttend: 0 } },

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
      date: {
        $gte: parseInt(req.query.from),
        $lt: parseInt(req.query.to),
      },
    });
  }
  if (req.query && req.query.name) {
    query.push({ name: { $regex: req.query.name, $options: "i" } });
  }
  if (req.query && req.query.status) {
    let x = (req.query.status==='true')//status is string and not in boolean format
    query.push({ isActive:x});
  }

  return empService
    .findByAgg(pipeline)
    .then((empData) => {
      if (!empData) {
        throw customExc.completeCustomException("employee_not_exists", false);
      } else {
        return mappers.successEmployeeList(empData);
      }
    })
    .catch((error) => {
      throw error;
    });
}

function getEmployees(req) {
  let pge_no = parseInt(req.query.page_no) ? parseInt(req.query.page_no) : 0;
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 100000;
  let query = [{}];
  let searchval=req.query.search ? req.query.search : "";
  let column = req.query.column ? req.query.column : "name";
  let order = parseInt(req.query.order) ? parseInt(req.query.order) : 1;
  
  

  let pipeline = [
    { $match: { $and: query } },
    {
      $project: {
        name: 1,
        email: 1,
        gender: 1,
        address: 1,
        mobile: 1,
        dob: 1,
        designation:1,
        isActive: 1,
        created: 1,
        updated: 1,
        Image:1,
        empId:1,
      },
    },
    { $sort: { [column]: order } },
    {
      $lookup: {
        from: "attendences",
        localField: "empId",
        foreignField: "empId",
        let: {
          startOfDay: new Date(
            new Date().setUTCHours(0, 0, 0, 0)
          ),
          endOfDay: new Date(
            new Date().setUTCHours(23, 59, 59, 999)
          ),
         
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{
                  $gte: ["$date", "$$startOfDay"],
                },
                {
                  $lte: ["$date", "$$endOfDay"],
                },],
              }, 
            },

          },
        ],
        as: "fromAttend",
      },
    },

    // {
    //   $lookup: {
    //     from: "attendences",
    //     localField: "_id", // field in the orders collection
    //     foreignField: "empId", // field in the items collection
    //     as: "fromAttend",
    //   },
    // },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$fromAttend", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { fromAttend: 0 } },

    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: pge_no } }],
        data: [{ $skip: parseInt(limit * pge_no) }, { $limit: limit }],
      },
    },
    { $unwind: "$metadata" },
  ];

 
  if (req.query && req.query.name) {
    query.push({ name: { $regex: req.query.name, $options: "i" } });
  }
 
  if (req.query && req.query.status) {
    let x = (req.query.status==='true')//status is string and not in boolean format
    query.push({ isActive:x});
  }

  return empService
    .findByAgg(pipeline)
    .then((empData) => {
      if (!empData) {
        throw customExc.completeCustomException("employee_not_exists", false);
      } else {
        return mappers.successEmployeeList(empData);
      }
    })
    .catch((error) => {
      throw error;
    });
}



function getDashboardData(req) {
  let pge_no = parseInt(req.query.page_no) ? parseInt(req.query.page_no) : 0;
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 100000;
  let query = [{}];
  let searchval=req.query.search ? req.query.search : "";
  let column = req.query.column ? req.query.column : "name";
  let order = parseInt(req.query.order) ? parseInt(req.query.order) : 1;

  let pipeline = [
    { $match: { $and: query } },
    {
      $project: {
        name: 1,
        dob: 1,
        _id:1,
        empId:1,
        isActive:1
      },
    },
    { $sort: { [column]: order } },
    {
      $lookup: {
        from: "attendences",
        localField: "empId",
        foreignField: "empId",
        let: {
          startOfDay: new Date(
            new Date(new Date().setDate(new Date().getDate()-1)).setUTCHours(0, 0, 0, 0)
          ),
          endOfDay: new Date(
            new Date(new Date().setDate(new Date().getDate()-1)).setUTCHours(23, 59, 59, 999)//for attendence of yesterday
          ),
         
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{
                  $gte: ["$date", "$$startOfDay"],
                },
                {
                  $lte: ["$date", "$$endOfDay"],
                },],
              }, 
            },

          },
        ],
        as: "fromAttend",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$fromAttend", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { fromAttend: 0 } },

    
    {
      $lookup: {
        from: "holidays",
        pipeline: [
          { "$match": {"_id": mongoose.Types.ObjectId("636b72fbbadf5fb1fdc00ef5") }},
        ],
        as: "fromHolidays",
      },
    },
    
   
  ];
console.log(pipeline)
 
  if (req.query && req.query.name) {
    query.push({ name: { $regex: req.query.name, $options: "i" } });
  }
 
  if (req.query && req.query.status) {
    let x = (req.query.status==='true')//status is string and not in boolean format
    query.push({ isActive:x});
  }
  return empService
  .findByAgg(pipeline)
  .then((empData) => {
    if (!empData) {
      throw customExc.completeCustomException("employee_not_exists", false);
    } else {
      let main={holidays:[],employees:[],attendence:[]}
        main.holidays=empData[0]["fromHolidays"]
        empData.forEach(data => {
          delete data.fromHolidays
          
          main.employees.push(data)
          delete data.fromAttend
        })
        let x=[main]        
        console.log(x)
      return x
    }
  })
  .catch((error) => {
    console.log(error)
    throw error;
  });
}




function getProfile(req) {
  let pge_no = parseInt(req.query.page_no) ? parseInt(req.query.page_no) : 0;
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 100000;
  let query = [{_id: mongoose.Types.ObjectId(req.query.empid)}];
  let searchval=req.query.search ? req.query.search : "";
  let column = req.query.column ? req.query.column : "name";
  let order = parseInt(req.query.order) ? parseInt(req.query.order) : 1;
  var lastday
  if (new Date().getMonth==1||new Date().getMonth==3||new Date().getMonth==5||new Date().getMonth==7||new Date().getMonth==8||new Date().getMonth==10||new Date().getMonth==12){
    lastday=31
  }else if (new Date().getMonth==4||new Date().getMonth==6||new Date().getMonth==9||new Date().getMonth==11){
    lastday=30
  }else if(new Date().getFullYear%4==0){
    lastday=29
  }else{
    lastday=28
  }

  let pipeline = [
    { $match: { $and: query } },
    {
      $project: {
        name: 1,
        email: 1,
        gender: 1,
        address: 1,
        mobile: 1,
        dob: 1,
        isActive: 1,
        created: 1,
        updated: 1,
        Image:1,
        fromAttend:1,
        fromHolidays:1,
        empId:1,
      },
    },
    { $sort: { [column]: order } },
    {
      $lookup: {
        from: "attendences",
        localField: "empId",
        foreignField: "empId",
        let: {
          startOfDay: new Date(
            new Date(new Date().setDate(1)).setUTCHours(0, 0, 0, 0)
          ),
          endOfDay: new Date(
            new Date(new Date().setDate(lastday)).setUTCHours(23, 59, 59, 999)
          ),
         
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{
                  $gte: ["$date", "$$startOfDay"],
                },
                {
                  $lte: ["$date", "$$endOfDay"],
                },],
              }, 
            },

          },
        ],
        as: "fromAttend",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$fromAttend", 0] }, "$$ROOT"],
        },
      },
    },
    {
      $lookup: {
        from: "holidays",
        pipeline: [
          { "$match": {"_id": mongoose.Types.ObjectId("636b72fbbadf5fb1fdc00ef5") }},
        ],
        as: "fromHolidays",
      },
    },
    
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$fromHolidays", 0] }, "$$ROOT"],
        },
      },
    },
  ];

 
  if (req.query && req.query.name) {
    query.push({ name: { $regex: req.query.name, $options: "i" } });
  }
 
  if (req.query && req.query.status) {
    let x = (req.query.status==='true')//status is string and not in boolean format
    query.push({ isActive:x});
  }

  return empService
    .findByAgg(pipeline)
    .then((empData) => {
      if (!empData) {
        throw customExc.completeCustomException("employee_not_exists", false);
      } else {
        return empData
      }
    })
    .catch((error) => {
      console.log(error)
      throw error;
    });
}
function changePass(passInfo) {
  return getEmpDetails(passInfo.logininfo.id)
    .then((adminDetails) => {
      if (adminDetails) {
        this.adminDetails = adminDetails;
        

        let adminData = {
          key: passInfo.old_password,
          new_pass: passInfo.new_password,
        };

        console.log(adminDetails.admin)
        return empService
          .changePass(adminData, adminDetails.admin)
          .then((success) => {
            console.log( "======abc===")

            return mappers.resMapForChangePass(success);
          })
          .catch(function (err) {
        console.log( err)

            throw err;
          });
      }
    })

}
function resetpass(passInfo){
  console.log(passInfo.email)
  return empService 
  .isEmailExist(passInfo.email)
    .then((empDetails) => {
      if (empDetails) {
         let det=empDetails
         det.password=passInfo.new_password
        console.log(det)
        
        
        return empService
          .resetPass({},det)
          .then((success) => {

            return mappers.resMapForChangePass(success);
          })
          .catch(function (err) {
            console.log(err)
            throw err;
          });
      }else{
  console.log("passInfo")
        
      }
    })

}
function buildAdminTokenGenObj(admin) {
  if (admin.role == "1") {
    return {
      _id: admin._id,
      type: "admin",
    };
  } else {
    return {
      _id: admin._id,
      type: "employee",
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
  return empService
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

          return empService.updateDetails(query, editedData);
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
  return empService
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
                let x=emailsend(data,jwt)
                if (otp){
                  console.log("send")
                  return mappers.sendMsg("send_otp_email");
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

//========================== Export Module Start ==============================

module.exports = {
  createEmp,
  updateEmp,
  deleteEmp,
  getEmpDetails,
  getEmployees,
  getDateEmployees,
  login,
  getProfile,
  getDashboardData,
  nodemail,
  otp,
  resetpass,
  changePass,
  forgotPass
};

//========================== Export Module End ===============================
