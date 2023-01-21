/**
 * @author author name
 */

//Load dependecies
const config = require(".././config").cfg;
//const client = require('twilio')(config.twilio.ACCOUNT_SID, config.twilio.AUTH_TOKEN);

// __sendSms("+919070278999", "You've successfully signup with us. Please enter 0000 to verify the otp")
//Send sms to user
// function __sendSms(phoneInfo, data) {
//   return client.messages
//     .create({
//       body: data,
//       from: config.twilio.TWILIO_NUMBER,
//       to: "+" + phoneInfo
//     })
//     .then(message => {
//       return { status: "done", message };
//     })
//     .catch(err => {
//       // console.log('err----> Unable to send OTP to user', err);
//       return { status: "fail", err };
//       // throw (customExc.completeCustomException("err_sending_otp", false));
//     })
// }

module.exports = {
  //__sendSms
};
