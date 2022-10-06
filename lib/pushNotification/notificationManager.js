const ios = require('./ios'),
	android = require('./android'),
	constants = require("../constants");

function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}


function sendNotification(registrationDevices, data, notifBody){
	let promiseResult = [];
	if(registrationDevices && registrationDevices.length>0){
		// console.log(registrationDevices.length, "registrationDevices");
		const registrationIds = getUniqueListBy(registrationDevices, 'dev_tkn')
		// console.log(registrationIds.length);
		for(let i=0; i<registrationIds.length; i++){
			// console.log(registrationIds[i].dev_type, 'registrationIds', constants.DEVICE_TYPE);
			if(registrationIds[i].dev_type == constants.DEVICE_TYPE[1]){
				promiseResult.push(android.pushNotification(registrationIds[i].dev_tkn, data, notifBody));
			}
			else if(registrationIds[i].dev_type == constants.DEVICE_TYPE[0]){
				promiseResult.push(ios.pushNotification(registrationIds[i].dev_tkn, data, notifBody));
			}
		}
	}
	return Promise.all(promiseResult);
}

// ========================== Export Module Start ==========================
module.exports = {
	sendNotification
}
// ========================== Export Module End ============================
