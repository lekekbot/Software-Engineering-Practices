const config = require('../config/config');
const emailValidation = require('../services/EmailValidation');
const mailgun = require("mailgun-js");

const sleep = require('sleep-promise');

//Task 04 - Extracts the user params via the params. Afterwards, uses mailguns as well as sendgrid to send a email to the user
//Success Response
//Code: 204 No Content
//METHOD : POST -> http://localhost:8081/u/users/resetpassword/:userEmail
exports.sendEmail = async (req, res, next) => {
    const userEmail = req.body.email;
    const mg = mailgun({ apiKey: config.mailGunApiKey, domain: config.mailGunDomain });

    //before we send the email... lets run through our database if the user does exist
    //afterall, we don't want a user to send to other random users as spam!
    emailValidation.validateEmailDoesExist(userEmail, async function (error, results) {
        //await sleep(3500);
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
            let OTP = Math.random() * (1000000 - 10000) + 10000;
            OTP = Math.ceil(OTP)

            //afterwards lets store the code inside a database
            emailValidation.insertOTP(OTP, user_id, async function (error, result) {
                console.log(result)
                if (error) {
                    return res.status(401).send({ code: 401, error: true, description: 'Insertion of OTP has failed', content: [] });
                } else {
                    try {
                        // Now, lets send an email to them to user that they have requested for the change
                        let emailData = {
                            from: `Competition System Admin <support@sp.competitionmanagementsystem.org>`,
                            to: `${userEmail}`,
                            subject: `Competition System Verification Code`,
                            text: `
                                \nYour OTP is ${OTP}. It will expire in 5 minutes. Please use this to verify your submission.
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
                        console.log('validateEmailDoesExist method : catch block section code is running');
                        console.log(error, '=======================================================================');
                        return res.status(500).send({ message: 'Unable to complete update (users) operation' });
                    }
                }
            })
        }
    })
}; // End of processGetOneUserStatusData

//Task 04 - Uses what the OTP sent to the user is and verifies if it matches!
//Success Response
//Code: 204 No Content
exports.verifyUserOTP = async (req, res, next) => {
    // to change
    const userEmail = "chaipinzheng@gmail.com";
    //const mg = mailgun({ apiKey: config.mailGunApiKey, domain: config.mailGunDomain });
    try {
        // findemail translates the user email to a user_id as a Point of Reference
        let result = await emailValidation.findEmail(userEmail)
        let { user_id } = result
        //since a user_id is individually tied to a OTP, retrive all the OTP tied to the user, but then send only the 
        //latest version
        emailValidation.validateOTP(user_id, function (results, error) {
            if (error) {
                return res.status(401).send({
                    code: 401,
                    error: true,
                    description: 'Error!',
                    content: []
                });
            } else {
                console.log(results[0])
                return res.status(200).send({ OTP: `${results[0].one_time_password}` });
            }
        })
    } catch (error) {
        return res.status(500).send({ message: 'Error! Unable to verify OTP!' });
    }

}; // End of processGetOneUserStatusData