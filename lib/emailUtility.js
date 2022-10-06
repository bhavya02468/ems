"use strict"

const nodemailer = require('nodemailer');
const config = require("./config").cfg;

// Not the movie transporter!
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.emailId, // Your email id
        pass: config.email.password // Your password
    }
});

module.exports =
{
    sendEmail: function sendMail(varhtml, vartext, varsubject, varfrom, varfrom_name, varto, varto_name, reply_to_email) {

        //setup e-mail data with unicode symbols
        let mailOptions = {
            from: 'ABC ' + config.email.emailId,
            to: [varto], // list of receivers
            subject: varsubject, // Subject line
            text: vartext, // plaintext body
            html: varhtml // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // console.log("error", error);
            } else {
                return console.log(info);
            }
        });

    }

}
