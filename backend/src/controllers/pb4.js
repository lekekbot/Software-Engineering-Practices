const jwt = require('jsonwebtoken');
const config = require('../config/config');
const emailValidation = require('../services/EmailValidation');
const userService = require('../services/userService')
const mailgun = require("mailgun-js");
const bcrypt = require('bcryptjs');

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
    try {
        var { email, OTP } = req.params
        // findemail translates the user email to a user_id as a Point of Reference
        let { user_id } = await emailValidation.findEmail(email)
        //set time out for password so after 5 mins, the OTP won't be usable
        let expireTimer = 5 * 60 * 1000
        //since a user_id is individually tied to a OTP, retrive all the OTP tied to the user, but then send only the 
        //latest version
        await sleep(3500);
        //This function finds the latest OTP that was sent to the user. It thens validates.
        emailValidation.validateOTP(user_id, function (results, error) {
            if (error) {
                return res.status(401).send({ code: 401, error: true, description: 'Error!', content: [] });
            } else {
                let actualOTP = results[0].one_time_password
                //sentTime
                let sentTime = results[0].created_at
                //currentTime
                var currentTime = new Date(Date.now() - expireTimer);

                if (actualOTP == OTP) {
                    if (sentTime > currentTime) {
                        console.log("Time has not breached")
                        emailValidation.correctOTP(email, function (results, error) {
                            if (error) {
                                console.log(error)
                                return res.status(401).send({ code: 401, error: true, description: 'Error!', content: [] });
                            } else {
                                console.log("Here was reached")
                                const responseBody = {
                                    //user_id: results[0].user_id,
                                    //role_name: results[0].role_name,
                                    displayName: results[0].first_name + ' ' + results[0].last_name,
                                    status: results[0].status,
                                    email: results[0].email,
                                    token: jwt.sign({
                                        userId: results[0].user_id,
                                        role: results[0].role_name,
                                        email: results[0].email
                                    },
                                        config.JWTKey, {
                                        expiresIn: 86400 //Expires in 24 hrs
                                    })
                                }; //End of data variable setup
                                console.log(responseBody)
                                return res.status(200).send(responseBody);
                            }
                        })
                    } else {
                        console.log("Error time was breeched")
                        return res.status(402).send({ code: 402, error: true, description: 'Time has expired!', content: [] });
                    }
                } else {
                    return res.status(401).send({ message: `The OTP you key in was wrong!` });
                }
            }
        })
    } catch (error) {
        return res.status(500).send({ message: 'Error! Unable to verify OTP!' });
    }

}; // End of processGetOneUserStatusData

//Task 04 - Saves the password
//Success Response
//Code: 204 No Content
exports.verifyPassword = async (req, res, next) => {
    console.log("Here was reached")
    try {
        // extracts out the new password
        var { UserPassword } = req.params
        var userRequestedPassword = UserPassword
        let password = await emailValidation.extractPassword(132)
        var { user_password, user_password_histories } = password

        if (user_password_histories == null) {
            //now, lets hash the key
            bcrypt.hash(user_password, 10, async (err, result) => {
                // shift the user current password to the user_password_history
                userService
                emailValidation.storePassword(result)
            })
        } else {
            //find if the userRequestPassword matches any password in the database
            user_password_histories.split("«").map(user_password_history => {
                if (user_password_history == userRequestedPassword) return res.status(401).send("Sorry! You cannot reuse your password");
            })

            console.log(BCrypt.Verify("my password", user_password))

            //Ok! Since there are no matches, lets proceed to store the password into the database
            //Lets shift the current in-used password to the right, while, limiting to 3 slots


        }

        return res.status(200).send("YES");
    } catch (error) {
        return res.status(500).send({ message: 'Error! Unable to verify OTP!' });
    }
}; // End of processGetOneUserStatusData