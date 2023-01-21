// ------------------------------------------------------------------------------------------
// General apiDoc documentation blocks and old history blocks.
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Success.
// ------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------
// Current Errors.
// ------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------
// Current Permissions.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine UnauthorizedError
 * @apiVersion 2.0.0
 *
 * @apiError Unauthorized Only authenticated users can access the endpoint.
 *
 * @apiErrorExample  Unauthorized response:
 *     HTTP 401 Unauthorized
 *     {
 *       "message": "Invalid credentials"
 *     }
 */

// ------------------------------------------------------------------------------------------
// History.
// ------------------------------------------------------------------------------------------

/**
 * @api {post} v2/admin/login Login to admin
 * @apiVersion 2.0.0
 * @apiName AdminLogin
 * @apiGroup Admin
 *
 * @apiParam (Request body) {String} identity Email
 * @apiParam (Request body) {Sting} key Password
 * @apiParam (Request body) {String} device_token Device Token, it can be any thing
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 {
  "status": 1,
  "res": {
    "msg": "You have logged in successfully.",
    "acsT": "",
    "admin": {
      "_id": "admin",
      "name": " Admin",
      "email": "admin email"
    }
  }
}
 *
 */

 /**
  * @api {put} v2/admin/change/password Change admin's password
  * @apiVersion 2.0.0
  * @apiName Change Password
  * @apiGroup Admin
  *
  * @apiParam (Request header) {String} accessToken Admin's accessToken
  * @apiParam (Request body) {Sting} old_pass Old Password
  * @apiParam (Request body) {String} new_pass New Password
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  {
   "status": 1,
   "res": {
     "msg": "Password successfully changed."
   }
 }
  *
  */

 /**
  * @api {post} v2/admin/forgot/password Forgot password request
  * @apiVersion 2.0.0
  * @apiName Forgot Password
  * @apiGroup Admin
  *
  * @apiParam (Request body) {String} email Admin's email
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  {
    "status": 1,
    "res": {
      "msg": "Forgot Password Link has been sent successfully."
    }
  }
  *
  */

 /**
  * @api {post} v2/admin/matchCode/resetPassword Reset password using Link
  * @apiVersion 2.0.0
  * @apiName Reset Password using Link
  * @apiGroup Admin
  *
  * @apiParam (Request body) {String} reset_token Token that received in link
  * @apiParam (Request body) {String} password New Password he/she wants to set
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  {
    "status": 1,
    "res": {
      "msg": "Password reset successfully."
    }
  }
  *
  */
