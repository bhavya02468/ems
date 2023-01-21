// load all dependencies
const Promise = require("bluebird");
const jwt = Promise.promisifyAll(require("jsonwebtoken"));
const constants = require("./constants");
const redisClient = require("./redisClient/init");
const customExc = require("./customExceptions");
const employeeService = require("./modules/employee/employeeService");
const admin2Service = require("./modules/admin/adminService");

const TOKEN_EXPIRATION_SEC = constants.TOKEN_EXPIRATION_TIME * 60;

const EMAIL_LINK_EXP_TIME = "2d";
const JWT_ALGORITHM = "RS256";
const JWT_SECRET_KEY = "login_secret_key_to_save_data";

var genAdminToken = function (admin, setExpire) {
  let options = {};
  return jwt
    .signAsync(admin, JWT_SECRET_KEY, options)
    .then(function (jwtToken) {
      return jwtToken;
    })
    .catch(function (err) {
      throw new customExc.tokenGenException();
    });
};

var genUsrToken = function (user, setExpire) {
  let options = {};
  /*
    Which I assume is mongoosejs object, which contains many methods and is not "serializable".
    You could handle this by passing a plain object, by either using .lean() from mongoose or
    plain toJSON method:
    // return jwt.signAsync(user.toJSON(), JWT_SECRET_KEY, options)
    */
  return jwt
    .signAsync(user, JWT_SECRET_KEY, options)
    .then((jwtToken) => {
      return jwtToken;
    })
    .catch((err) => {
      throw new customExc.tokenGenException();
    });
};

var verifyUsrToken = function (acsTokn) {
  return jwt
    .verifyAsync(acsTokn, JWT_SECRET_KEY)
    .then((tokenPayload) => {
      this.tokenPayload = tokenPayload;
      return redisClient.getValue(acsTokn);
    })
    .then((reply) => {
      if (reply) {
        try {
          replyInfo = JSON.parse(reply);
          if (replyInfo._id) return this.tokenPayload;
          else {console.log("error+++++++++++++")
            throw "noId";}
        } catch (ex) {
          console.log("error---------------")
          throw "noId";
        }
      } else throw {};
    })
    .catch((err) => {
      throw new customExc.unauthorizeAccess(err);
    });
};

var expireToken = function (req) {
  let token = req.get("accessToken");
  if (token) {
    //blacklist token in redis db
    //it will be removed after 6 months
    redisClient.setValue(token, true);
    redisClient.expire(token, TOKEN_EXPIRATION_SEC);
  }
};

//checking from user_collection
var verifyUsr1Token = function (acsTkn) {
  return jwt
    .verifyAsync(acsTkn, JWT_SECRET_KEY)
    .then((tokenPayload) => {
      if (tokenPayload && tokenPayload._id) {
        let query = { _id: tokenPayload._id, is_del: 0 };
        return employeeService.findByAny(query);
      } else {console.log("error++++++");throw "noId";}
    })
    .then((usrData) => {
      if (!usrData) {
        console.log("error--------")
        throw "noUser";
      } else if (usrData && usrData._id && usrData.acsTkn === acsTkn) {

        return usrData;
      } else throw "noId";
    })
    .catch((err) => {
      throw new customExc.unauthorizeAccess(err);
    });
};



var verifyUsr1Token2 = function (acsTkn) {
  return jwt
    .verifyAsync(acsTkn, JWT_SECRET_KEY)
    .then((tokenPayload) => {
      if (tokenPayload && tokenPayload._id) {
        let query = { _id: tokenPayload._id, is_del: 0 };
        return admin2Service.findByAny(query);
      } else throw "noId";
    })
    .then((usrData) => {
      if (!usrData) {
        throw "noUser";
      } else if (usrData && usrData._id && usrData.acsTkn === acsTkn) {
        return usrData;
      } else throw "noId";
    })
    .catch((err) => {
      throw new customExc.unauthorizeAccess(err);
    });
};

module.exports = {
  genAdminToken,
  genUsrToken,
  verifyUsrToken,
  expireToken,
  verifyUsr1Token,
  verifyUsr1Token2,

};
