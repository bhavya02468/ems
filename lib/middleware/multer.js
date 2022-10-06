/**
 * Created by author name @author author name
 */

const multer = require('multer');

path = require('path');
// upload = multer(
//   { dest  : path.resolve('./uploads')} //name is coming from its library

// )

const crypto = require('crypto');
const mimeTypes = require('../mime-types.json');
let videoMime = mimeTypes.video;
let imageMime = mimeTypes.image;

function fileFilter(req, file, cb) {
  let isFound = false;
  if (file.fieldname == "video") {

    for (let k = 0; k < videoMime.length; k++) {
      if (videoMime[k].mimetype == file.mimetype)
        isFound = true;
    }
    if (!isFound)
      return cb('Please upload video with valid mime type', false);
  } else if (file.fieldname == "importfile") {

    let xlsxMime = mimeTypes.xlsx;
    for (let k = 0; k < xlsxMime.length; k++) {
      if (xlsxMime[k].mimetype == file.mimetype)
        isFound = true;
    }
    if (!isFound)
      return cb('Please upload excel with valid mime type', false);
  }
  else if (file.fieldname == "chat_media") {

  } else if (file.fieldname == "msg") {

  } else if (file.fieldname == "rt") {

  } else {
    for (let k = 0; k < imageMime.length; k++) {
      if (imageMime[k].mimetype == file.mimetype)
        isFound = true;
    }
    if (!isFound)
      return cb('Please upload image with valid mime type', false);
  }
  cb(null, true);
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },


  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(err, err ? undefined : "qu" + raw.toString('hex') + Date.now() + path.extname(file.originalname))
    })
    // const newName = uuidV4();
    // const extension = file.mimetype.split('/')[1];
    // cb(null, newName +`.${extension}`);
  }
});

var upload = multer({ storage: storage, fileFilter: fileFilter });


//https://github.com/expressjs/multer

//===================================== Exports ===========================================================

module.exports = {

  single: _singleFile,
  array: _fileArray,
  fields: _randomFiles,
  any: upload.any
}


//===================================== Implementation ===========================================================

function _singleFile(key) {
  return upload.single(key);
}

function _fileArray(key, count) {
  return upload.array(key, count);
}

/**
 *  Upload Multiple Files with different keys
 * @param array :: example : [{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]
 * @returns {*}
 * @private
 */
function _randomFiles(array) {
  return upload.fields(array);
}
