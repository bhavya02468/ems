const Promise = require("bluebird");
const redis = require("redis");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
var client;
const config = require("../config").cfg;
const logger = require("../logger");

var init = function () {
  // console.log(config.redis, 'redis client');
  client = redis.createClient({ ...config.redis });

  // let token = ''
  // client.get(token, function(err, reply){
  //   console.log(reply, 'reply');
  // });

  client.keys("*", function (err, keys) {
    if (err) return console.log(err);
    for (var i = 0, len = keys.length; i < len; i++) {
      // console.log((keys[i]));
      //   // console.log(  client.get(keys[i], function (err, reply) {
      //   //      if(!err)
      //   //        console.log(reply, 'reply');
      //   //    }) );
      //   // console.log("(keys[i])");
      //   //  client.del((keys[i]));
    }
  });

  return client.onAsync("error").then(function (err) {
    // logger.info({error: err});
  });
};

exports.setValue = function (key, value) {
  return client
    .setAsync(key, value, "EX", 30 * 60 * 60 * 24)
    .then(function (resp) {
      if (resp) {
        // logger.info({"value": resp}, "_redisSetValue");
        return resp;
      }
    })
    .catch(function (err) {
      console.log(err)
      return err;
    });
};

exports.getValue = function (key) {
  return client
    .getAsync(key)
    .then(function (res) {
      return res;
    })
    .catch(function (err) {
      console.log(err)
      return err;
    });
};

exports.expire = function (key, expiryTime) {
  return client
    .expireAsync(key, expiryTime)
    .then(function (resp) {
      // logger.info({expire : resp}, "_expireToken");
      return resp;
    })
    .catch(function (err) {
      // logger.error({"error" : err}, "_expireToken");
    });
};

exports.delToken = function (key) {
  return client.del(key);
};

init();
