const FCM = require('fcm-node');
const Promise = require('bluebird');
const config = require('../config').cfg;
const fcmServerKey = config.firebase.fcm.serverKey; //put your server key here
const fcm = new FCM(fcmServerKey);


// let dev_tkn = "er4LX4DVwoE:APA91bGzVgOYRYXfETODlMqu43o9zPt2LU6quETdJBJ-wlhehZIytRFLhAOhhS5a1iFpnd_lvyJjtQ6Cue-n-GPYSpnkwI1XdzEEArXbGt4rT5fZsDU7Gbhk0H2dziYlT5Kf62b0aZWo"
// pushNotification(dev_tkn, {}, {title: "sd", body: "body"})

function pushNotification(deviceIds, data, notifBody) {
    //   console.log(deviceIds, data, notifBody, "deviceIds, data, notifBody");
    data.timestamp = Date.now();
    data.title = notifBody.title;
    data.body = notifBody.body;
    let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: deviceIds,
        data: data
        // notification: {
        //     title: notifBody.title,
        //     body: notifBody.body
        // },
    };

    return new Promise(function (resolve, reject) {
        fcm.send(message, function (error, response) {
            if (error) {
                // console.log(error, "error");
                // reject(error);

                resolve(true);
            }
            else {
                // console.log(response, "success");
                resolve(response);
            }
        });
    });
}
// pushNotification("", "");
// ========================== Export Module Start ==========================
module.exports = {
    pushNotification
}
// ========================== Export Module End ============================
