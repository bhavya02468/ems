const config = require(".././config").cfg;
const uploadDeleteToS3 = require("./uploadDeleteToS3");

module.exports = {


  deleteOldMedia: function oldMediaDeleted(key, type) {
    if (type === 'user_profile') {
      uploadDeleteToS3.deleteFromS3(config.s3UploadPaths.user.profile + key);
    } else if (type === 'th_user_profile') {
      let fileKey = key.split(".")[0] + ".png"
      uploadDeleteToS3.deleteFromS3(config.s3UploadPaths.user.profile + config.s3UploadPaths.thumbnail + fileKey);
    } else if (type === 'user_job') {
      uploadDeleteToS3.deleteFromS3(config.s3UploadPaths.user.job + key);
    } else if (type === 'th_user_job_media') {
      uploadDeleteToS3.deleteFromS3(config.s3UploadPaths.user.job + config.s3UploadPaths.thumbnail + key);
    } else if (type === 'firebase_media') {
      uploadDeleteToS3.deleteFromS3(config.s3UploadPaths.user.firebase + key);
    }

  }

}
