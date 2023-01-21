/**
 * @author author name
 */

//Load dependecies
const Client = require('authy-client').Client;
const config = require(".././config").cfg;
const authy = new Client({ key: config.twilio.AUTHY_API_KEY });

const enums = require('authy-client').enums;
const Promise = require('bluebird');
const customExceptions = require('../customExceptions');
const status_codes = require("../status_codes.json");

//Send otp to user
function __sendOtp(phoneInfo) {
  return authy.startPhoneVerification({ countryCode: phoneInfo.country_code, phone: phoneInfo.phonenumber, locale: "en", via: enums.verificationVia.SMS })
    .then(function (result) {
      return result;
    })
    .catch(function (err) {
      console.log('err----> Unable to send OTP to user', err);
      throw customExceptions.completeCustomException(status_codes.err_sending_otp.status_code, status_codes.err_sending_otp.message, false);
    })
}


//Verify Otp from user
function __verifyOtp(phoneInfo, otp) {
  return authy.verifyPhone({ countryCode: phoneInfo.country_code, phone: phoneInfo.phonenumber, token: otp })
    .then(function (result) {
      return result;
    })
    .catch(function (err) {
      console.log('err----> Unable to verify OTP to user', err);
      if (err && err.body && err.body.error_code == '60022') //Verification code is incorrect
        throw customExceptions.completeCustomException(parseInt(err.body.error_code), err.body.errors.message, false);
      else if (err && err.body && err.body.error_code == '60023') //'No pending verifications for +91 907-027-8999 found.'
        throw customExceptions.completeCustomException(parseInt(err.body.error_code), err.body.errors.message, false);
      else
        throw customExceptions.completeCustomException(status_codes.err_matching_otp.status_code, status_codes.err_matching_otp.message, false);

    })
}



module.exports = {
  __sendOtp,
  __verifyOtp
}
