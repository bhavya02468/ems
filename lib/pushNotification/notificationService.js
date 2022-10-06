const notificationManager = require('./notificationManager'),
	Promise = require('bluebird');

function sendNotification(params) {
	return Promise.resolve(notificationManager.sendNotification(params.deviceUsers, params.data, params.notifBody));
}

// ========================== Export Module Start ==========================
module.exports = {
	sendNotification
}
// ========================== Export Module End ============================
