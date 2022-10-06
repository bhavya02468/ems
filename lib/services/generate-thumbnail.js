/**
 * @author author name
 */

//Load dependecies
const ThumbnailGenerator = require('video-thumbnail-generator').default;
// const Promise = require("bluebird");

function genVideoThumbnail(file, callback) {
  const tg = new ThumbnailGenerator({
    sourcePath: file.path,
    thumbnailPath: 'uploads',
  });

  // return new Promise( function (resolve, reject){
  // tg.generateOneByPercentCb(90, {size: '640x480'}, function(err, data){
  tg.generateOneByPercentCb(90, { size: '480x640' }, function (err, data) {//width x height
    // console.log("err data", err, data, "dat")
    if (err)
      callback(false);
    else
      callback(data);
  })
  // .then(function(data){
  //   console.log('data', data);
  //   // resolve(data);
  //   return data;
  // })
  // .catch( function(err){
  //   console.log('data', err);
  //   return err;
  //   // reject(err);
  // });
  // })
}

// genVideoThumbnail();

module.exports = {
  genVideoThumbnail
}
