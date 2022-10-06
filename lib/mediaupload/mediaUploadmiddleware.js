/**
 * Created by author name
 */


const Promise = require("bluebird");
path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    unlink = Promise.promisify(fs.unlink, fs),
    logger = require('../logger/index').logger;
const config = require(".././config").cfg;

const customExc = require("../customExceptions");

const uploadDeleteToS3 = require('../services/uploadDeleteToS3');
const genThumbnail = require('../services/generate-thumbnail');

function getfileKey(chk, name) {
    let fileKey;
    switch (chk) {
        case 'user_profile': fileKey = config.s3UploadPaths.user.profile; break;
        default: fileKey = config.s3UploadPaths.user.profile; break;
    }
    return fileKey + name;
}

module.exports = {

    uploadSingleMediaToS3: function s3SingleFileUpload(chk) {
        return function (req, res, next) {
            let file = (req.files || req.file);
            if (!file) {
                return next();
            }
            let fileKey = getfileKey(chk, file.filename);
            return new Promise(function (resolve, reject) {
                return uploadDeleteToS3.uploadFile(file, fileKey)
                    .then(function (url) {
                        return next();
                    })
                    .catch(function (err) {
                        console.log("Error :", err);
                        return next(customExc.completeCustomException("intrnlSrvrErr", false));
                        // throw err;
                    })
            })
        }
    },

    uploadMultipleMediaToS3: function s3MultipleFileUpload(chk) {
        return function (req, res, next) {
            let files = req.body.filesArray;
            if (!files) {
                return next();
            }
            Promise.mapSeries(files, function (file) {
                let fileKey = getfileKey(chk, file.filename)
                return uploadDeleteToS3.uploadFile(file, fileKey);
            })
                .then(function (urls) {
                    return next();
                })
                .catch(function (err) {
                    // console.log(err);
                    return next(customExc.completeCustomException("intrnlSrvrErr", false));
                })
        }
    },

    genVideoThumbnail: function genVideoThumbnail(chk) {
        return function (req, res, next) {
            let file = req.file;
            if ((chk === 'th_user_profile' || chk === 'th_org_profile')
                && req.body.filesArray.length > 0 && req.body.filesArray[0].fieldname == 'video') {
                file = req.body.filesArray[0];
            }
            // console.log(chk, "genVideoThumbnail and upload to s3", file);
            if (!file) {
                return next();
            }
            if (file.fieldname == 'video' || (file.fieldname == 'chat_media' && req.body.isVideo == "1")) {
                let fileKey = getfileKey(chk, file.filename);
                fileKey = fileKey.split(".")[0] + ".png"
                // console.log("thumbnailky",fileKey )
                genThumbnail.genVideoThumbnail(file, function (result) {
                    if (result) {
                        let thumbnailData = {
                            filename: result,
                            fieldname: 'profVideoThumb',
                            path: 'uploads/' + result
                        };
                        req.th = fileKey;
                        uploadDeleteToS3.uploadFile(thumbnailData, fileKey);
                        return next();
                    } else {
                        return next();
                    }
                })
            } else {
                // console.log("no thumbnail need");
                return next();
            }
        }
    }

}

function _fetchFilesFromReq(req) {

    if (req.file) {
        return [req.file];
    } else if (req.files) {
        return req.files;
    } else {
        //No Data
        return [];
    }
}

function _fetchMultipleFilesFromReq(req, keys) {

    if (req.file) {
        return [req.file];
    } else if (req.files) {
        var filesArr = [];
        keys.forEach(function (key) {
            if (req.files[key]) {
                filesArr.push(req.files[key][0]);
            }
        })
        return filesArr;
    } else {
        //No Data
    }
}

function __deleteFiles(filePathList) {
    var promiseArray = [];

    _.each(_.uniq(filePathList), function (path) {
        promiseArray.push(unlink(path))
    })

    Promise.all(promiseArray)
        .then(() => logger.info(TAG, "All Files Deleted Successfully"))
        .catch(err => logger.error(err))
}
