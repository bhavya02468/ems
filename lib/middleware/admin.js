/**
 * Created by vikas kohli  @author VIKAS KOHLI
 */

const customExc = require("../customExceptions");
const adminService = require("../modules/admin/adminService");

module.exports = {

  checkAdminExists: function isAdminExists(options) {
    return function (req, res, next) {
      let query = { "_id": req.user._id };
      let projection = {};
      return adminService.findByAny(query, projection)
        .then(adminResult => {
          if (adminResult == 'db_err') {
            return next(customExc.completeCustomException("intrnlSrvrErr", false));
          } else {
            if (!adminResult || adminResult.length <= 0) {
              return next(customExc.completeCustomException("admin_not_found", false));
            } else {
              req.adminResult = adminResult;
              return next();
            }
          }
        })
        .catch(err => {
          throw err;
        })
    }
  }
}
