const config = require('../config/config');
const mailgun = require("mailgun-js");

const sleep = require('sleep-promise');

//Task 04 - Extracts the user params via the params. Afterwards, uses mailguns as well as sendgrid to send a email to the user
//Success Response
//Code: 204 No Content
//METHOD : POST -> http://localhost:8081/u/users/resetpassword/:userEmail
exports.processUserEmailOTP = async (req, res, next) => {
    const userEmail = req.body.email;
    const mg = mailgun({ apiKey: config.mailGunApiKey, domain: config.mailGunDomain });

    console.log(userEmail)
    code = "OBQEZE"
    try {
        // TO DO LIST
        // increase upon success
        await sleep(3500);
        let emailData = {
            from: `Competition System Admin <support@sp.competitionmanagementsystem.org>`,
            to: `${userEmail}`,
            subject: `Competition System Verification Code`,
            text: `
            \nYour OTP is ${code}. It will expire in 5 minutes. Please use this to verify your submission.
            \nIf your OTP does not work, please request for a new OTP.
            \nIf you did not make this request, you may ignore this email.
            \n\n-The Competition Management System Support Team`
        };

        mg.messages().send(emailData, function (error, body) {
            if (error) {
                console.log(`Sending email has failed`, error);
            } else {
                console.log(`Sent email.`, body);
            }
        });
        return res.status(200).send({ message: 'Email is set to your system' });
    } catch (error) {
        console.log('processUserEmailOTP method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).send({ message: 'Unable to complete update (users) operation' });
    }

}; // End of processGetOneUserStatusData