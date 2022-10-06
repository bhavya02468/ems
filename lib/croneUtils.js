const cron = require("cron");


// this will execute on the server time at 00:01:00 each day by server time

function getCronForMidNight(callback) {

  return cron.job("00 01 00 * * *", callback);

}


// this will execute on the server after half an hour

function getCronForHalfHour(callback){

    return cron.job("00 */30 * * * *", callback);

}

// this will execute on the server after 5 mins

function getCronFor5mins(callback){

    return cron.job("00 */5 * * * *", callback);

}

module.exports = {
	getCronForMidNight : getCronForMidNight,
	getCronForHalfHour : getCronForHalfHour,
  getCronFor5mins: getCronFor5mins,
}
