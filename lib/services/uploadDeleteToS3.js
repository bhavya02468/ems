"use strict";

//========================== Load Modules Start =======================
//========================== Load External modules ====================

const Promise = require("bluebird");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const Exception = require("../model/Exception");

//========================== Load internal modules ====================
const config = require("../config").cfg;
// var SightengineClient = require ('sightengine');
// var Sightengine = new SightengineClient(config.sightenEngine.user, config.sightenEngine.secret);
const status_codes = require("../status_codes.json");

// AWS.config = {
//     accessKeyId: config.awsIamUser.accessKeyId,
//     secretAccessKey: config.awsIamUser.secretAccessKey,
//     region: config.s3.region,
//     bucketName: config.s3.bucketName,
//     // signatureVersion: config.s3.signatureVersion
// };

// var Bucket = config.s3.bucketName;
// var photoBucket = new AWS.S3({ credentials: AWS.config, params: { Bucket: Bucket } });

//========================== Load Modules End ==============================================
function __deleteTempFile(filePath) {
  fs.stat(filePath, function (err, stats) {
    //here we got all information of file in stats variable

    if (err) {
      // console.error(err);
    }

    fs.unlink(filePath, function (err) {
      if (err) {
        console.log(err);
      }
      // console.log('file deleted successfully');
    });
  });
}

function __uploadToS3(file, buffer, fileKey) {
  return new Promise(function (resolve, reject) {
    photoBucket.upload(
      {
        // Key: file.filename,
        Key: fileKey,
        ContentType: file.mimetype || "image/png",
        Body: buffer,
        ACL: "public-read",
      },
      function (err, data) {
        if (err) {
          //Also delete file if error occurs
          __deleteTempFile(file.path);
          reject(err);
        } else {
          //Adding file name in data, so save only filename
          data.filename = file.filename;
          data.fieldname = file.fieldname;
          resolve(data);
        }
      }
    );
  });
}

function _getNudityValue(value) {
  var temp = value.toString();
  return parseInt(temp[2]);
}

function checkNudity(file, buffer, fileKey) {
  return Sightengine.check(["nudity"])
    .set_file(file.path)
    .then(function (result) {
      if (result.status == "failure") {
        __deleteTempFile(file.path);
        throw new Exception(status_codes.nude_api_error);
      } else {
        if (_getNudityValue(result.nudity.safe) > 5) {
          return __uploadToS3(file, buffer, fileKey).then(function (data) {
            __deleteTempFile(file.path);
            return data;
          });
        } else {
          __deleteTempFile(file.path);
          throw new Exception(status_codes.nude_pics);
        }
      }
    })
    .catch(function (err) {
      __deleteTempFile(file.path);
      throw err;
    });
}

function uploadFile(file, fileKey) {
  let buffer = fs.createReadStream(file.path);
  // if(file.fieldname!='profile_video'){
  //   return checkNudity(file, buffer, fileKey);
  // }else{
  return __uploadToS3(file, buffer, fileKey)
    .then(function (data) {
      __deleteTempFile(file.path);
      return data;
    })
    .catch(function (err) {
      __deleteTempFile(file.path);
      throw err;
    });
  // }
}

function uploadImageThumb(file) {
  let size = 128;
  let dest = path.join(file.path, "../");
  let resizeName = size + "x" + size + file.filename;
  dest += resizeName;
  return new Promise(function (resolve, reject) {
    gm(file.path)
      .resize(size, size)
      .autoOrient()
      .write(dest, function (err) {
        if (err) {
          reject(err);
        }
        let buffer = fs.createReadStream(dest);
        let resizeImage = file;
        resizeImage.filename = resizeName;
        // resizeImage.path = dest;
        // resizeImage;
        return __uploadToS3(resizeImage, buffer)
          .then(function (data) {
            __deleteTempFile(dest);
            resolve(data);
          })
          .catch(function (err) {
            throw err;
          });
      });
  });
}

// function deleteFromS3(fileKey, file){
//     console.log("fileDelting", fileKey, file.filename);

function deleteFromS3(fileKey) {
  photoBucket.deleteObject(
    {
      Key: fileKey,
    },
    function (err, data) {
      if (err) {
        // console.log("delete fail: ", err, fileKey);
        return false;
      } else {
        // console.log("delete success: ", data, fileKey);
        return true;
      }
    }
  );
  return true;
}

// copyFromS3("https://abc app.s3.amazonaws.com/abc app_local/org/profile/qu019975ea5f563c43468277ad765d95ff1559907043491.jpg", "abc app_local/test/qu019975ea5f563c43468277ad765d95ff1559907043491.jpg")
function copyFromS3(params) {
  return new Promise(function (resolve, reject) {
    var s3params = {
      CopySource: params.oldKey,
      Key: params.newKey,
      ACL: "public-read",
    };
    photoBucket.copyObject(s3params, function (copyErr, copyData) {
      if (copyErr) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

//========================== Export Module Start ==============================

module.exports = {
  uploadFile,
  uploadImageThumb,
  __deleteTempFile,
  deleteFromS3,
  copyFromS3,
};

//========================== Export Module End ===============================
