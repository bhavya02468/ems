// var apn = require('apn');
const FCM = require('fcm-node');
const Promise = require('bluebird');
const config = require('../config');

var fcmServerKey = config.cfg.firebase.fcm.serverKey; //put your server key here
var fcm = new FCM(fcmServerKey);
/*options = {
	key: config.cfg.pemFile,
	cert: config.cfg.pemFile,
	// passphrase: '',
	gateway: "gateway.push.apple.com",
	production: false,
	enhanced: true,
	cacheLength: 5,
	debug: true
}*/

function pushNotification(deviceIds, data, notifBody) {
	data.timestamp = Date.now();
	notifBody.sound = 'default';
	var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
		to: deviceIds,
		data: data,
		notification: {
			title: notifBody.title,
			body: notifBody.body
		},
	};
	return new Promise(function (resolve, reject) {
		fcm.send(message, function (error, response) {
			if (error) {
				// console.log(error, "error");
				resolve(true);
			}
			else {
				// console.log(response, "success");
				resolve(response);
			}
		});
	});
}

/*function iosNotification(deviceToken, message){
	var notification = new apn.Notification();
	notification.payload = {'description': message};
	notification.badge = 1;
	notification.sound = "dong.aiff";
	notification.alert = message.message;

	return new Promise(function(resolve, reject){
		apnProvider.send(notification, deviceToken).then((result) => {
			resolve(result);
		});
	});
}*/

// ========================== Export Module Start ==========================
module.exports = {
	pushNotification,
	// iosNotification
}
// ========================== Export Module End ============================
