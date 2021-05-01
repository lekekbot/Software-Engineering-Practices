const config = require('../config/config');
const emailValidation = require('../services/EmailValidation');
const mailgun = require("mailgun-js");

const sleep = require('sleep-promise');

//Task 04 - Extracts the user params via the params. Afterwards, uses mailguns as well as sendgrid to send a email to the user
//Success Response
//Code: 204 No Content
//METHOD : POST -> http://localhost:8081/u/users/resetpassword/:userEmail
exports.processUserEmailOTP = async (req, res, next) => {
    const userEmail = req.body.email;
    const mg = mailgun({ apiKey: config.mailGunApiKey, domain: config.mailGunDomain });

    //before we send the email... lets run through our database if the user does exist
    //afterall, we don't want a user to send to other random users as spam!
    emailValidation.validateEmail(userEmail, async function (error, results) {
        await sleep(3500);
        if (error) {
            return res.status(401).send({
                code: 401,
                error: true,
                description: 'Email Validation has failed.',
                content: []
            });
        } else {
            // Yes! We have validated that the email does exist and has registered with the system.
            //lets generate a code and store it in the user database
            let { user_id } = results[0]
            let password = Math.random() * (1000000 - 10000) + 10000;
            password = Math.ceil(password)

            //afterwards lets store the code inside a database

            // Now, lets send an email to them to user that they have requested for the change
            try {
                // TO DO LIST
                // increase upon success
                let emailData = {
                    from: `Competition System Admin <support@sp.competitionmanagementsystem.org>`,
                    to: `${userEmail}`,
                    subject: `Competition System Verification Code`,
                    text: `
                        \nYour OTP is ${password}. It will expire in 5 minutes. Please use this to verify your submission.
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
        }
    })
}; // End of processGetOneUserStatusData