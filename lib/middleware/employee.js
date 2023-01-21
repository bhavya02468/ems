/**
 * Created by author name  @author author name
 */
const customExc = require("../customExceptions");
const employeeService = require("../modules/employee/employeeService");

module.exports = {
  checkUserExists: function isUserExists(options) {
    return function (req, res, next) {
      let query = {};
      if (options == "queryParmsBody") {
        query._id = req.req.query.userid;
      } else {
        query._id = req.user._id;
      }
      let projection = {};
      return employeeService
        .findByAny(query, projection)
        .then((userResult) => {
          if (userResult == "db_err") {
            return next(
              customExc.completeCustomException("intrnlSrvrErr", false)
            );
          } else {
            if (!userResult) {
              // console.log("User not found");
              return next(
                customExc.completeCustomException("user_not_found", false)
              );
            } else {
              // console.log(userResult, 'user data');
              req.userResult = userResult;
              next();
            }
          }
        })
        .catch((err) => {
          throw err;
        });
    };
  },

  checkUserActive: function isUserActive(type, options) {
    return function (req, res, next) {
      // console.log(type, options, "type, options");
      if (req[type] && req[type].status === 1) {
        next();
      } else {
        // console.log('deactive user');
        return next(
          customExc.completeCustomException("admin_deactive_usr", false)
        );
      }
    };
  },

  checkUsrRoleSkng: function isRoleSkng(type, options) {
    return function (req, res, next) {
      // console.log(type, options, "type, options in chkRolSkng");
      let query = { user_id: req[type]._id };
      return employeeService
        .findProfileByAny(query, {})
        .then((usrProfile) => {
          if (usrProfile == "db_err") {
            return next(
              customExc.completeCustomException("intrnlSrvrErr", false)
            );
          } else {
            if (!usrProfile) {
              // console.log("User Profile not found");
              return next(
                customExc.completeCustomException("usr_prf_not_found", false)
              );
            } else {
              // console.log(Array.isArray(usrProfile.role_skng))
              // console.log(usrProfile, 'user profile');
              if (
                !usrProfile.role_skng ||
                !Array.isArray(usrProfile.role_skng)
              ) {
                return next(
                  customExc.completeCustomException("invalid_role_skng", false)
                );
              } else {
                if (
                  Array.isArray(usrProfile.role_skng) &&
                  usrProfile.role_skng.length > 0
                ) {
                  req.usrProfile = usrProfile;
                  next();
                } else {
                  return next(
                    customExc.completeCustomException("choose_role_skng", false)
                  );
                }
              }
            }
          }
        })
        .catch((err) => {
          throw err;
        });
    };
  },
};
