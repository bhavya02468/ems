/**
 * Created by author name   @author author name
 */

//Email Utility
const emailUtility = require('../emailUtility');
const config = require('../config').cfg;
const ejs = require('ejs');

var regEmailFunc = {

  signup: function signup_jobseeker(user_data) {
    let user_name = user_data.name || "Welcome";
    let emailSubject = "Registration success";
    let filename = "lib/ejs-html/signup_success.ejs";
    let rootUrl = config.url.basePath;
    ejs.renderFile(filename,
      { rootUrl, user_name, user_data },
      function (err, htmlData) {
        if (err) {
          console.log(err);
        } else {
          emailUtility.sendEmail(htmlData, "", emailSubject, "", "", user_data.email, "ABc Team", "");
        }
      });
  }

};

module.exports = regEmailFunc;
