const crypto = require('crypto');

module.exports = {

  generate_token: function token_genrate() {
    try {
      const buf = crypto.randomBytes(32).toString('hex');
      return buf;
    } catch (ex) {
      return "";
    }
  }

}
