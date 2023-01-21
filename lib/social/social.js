const Promise = require("bluebird")
const appUtil = require('../appUtils');
const exceptions = require("../customExceptions");
const FB_PROFILE_FETCH_URL = "https://graph.facebook.com/me?fields=email,first_name,id,last_name,name,gender,birthday,picture{url}&access_token=";
const options = require("../config");

module.exports = {
    /**
     * [getFBProfile description]
     * @param  {[type]}   token    [description]
     * @param  {Function} callback(fbUser) - fbUser is jsonObject with fields
     * first_name, last_name, id, email, gender;
     * @return {[type]}            [description]
     */
    getFBProfile: function (token) {
        return appUtil.appHttpClient.getSecure(FB_PROFILE_FETCH_URL + token)
            .then(function (resp) {
                var retVal = JSON.parse(resp);
                if (retVal.error) {
                    var exception = exceptions.getIncorrectFbTokenException();
                    exception.error = retVal;
                    throw exception;
                }
                if (!retVal.email) {
                    throw exceptions.getEmailPermissionException();
                }
                return retVal;
            })
    }

};
