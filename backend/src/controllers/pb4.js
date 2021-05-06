const jwt = require("jsonwebtoken");
const config = require("../config/config");
const emailValidation = require("../services/EmailValidation");
const userService = require("../services/userService");
const mailgun = require("mailgun-js");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");

const sleep = require("sleep-promise");

//Task 04 - Extracts the user params via the params. Afterwards, uses mailguns as well as sendgrid to send a email to the user
//Success Response
//Code: 204 No Content
//METHOD : POST -> http://localhost:8081/u/users/resetpassword/:userEmail
exports.sendEmail = async (req, res, next) => {
    const userEmail = req.body.email;
    const mg = mailgun({ apiKey: config.mailGunApiKey, domain: config.mailGunDomain });

    //Before we send the email... lets run through our database if the user does exist
    //Afterall, we don't want a user to send to other random users as spam!
    emailValidation.validateEmailDoesExist(userEmail, async function (error, results) {
        if (error) {
            await sleep(3500);
            return res.status(401).send({
                code: 401,
                error: true,
                description: "Email Validation has failed.",
                content: [],
            });
        } else {
            //Yes! We have validated that the email does exist and has registered with the system.
            //lets generate a code and store it in the user database
            let { user_id } = results[0];
            let OTP = Math.random() * (1000000 - 10000) + 10000;
            OTP = Math.ceil(OTP);

            //afterwards lets store the code inside a database
            emailValidation.insertOTP(OTP, user_id, async function (error, result) {
                if (error) {
                    return res.status(401).send({ code: 401, error: true, description: "Insertion of OTP has failed", content: [] });
                } else {
                    try {
                        // Now, lets send an email to them to user that they have requested for the change
                        let emailData = {
                            from: `Competition System Admin <support@sp.competitionmanagementsystem.org>`,
                            to: `${userEmail}`,
                            subject: `Competition System Verification Code`,
                            text: `
                                \nYour OTP is ${OTP}. It will expire in 5 minutes. Please use this to verify yourself.
                                \nIf your OTP does not work, please requst for a new OTP.
                                \nIf you did not make this request, you may ignore this email.
                                \n\n-The Competition Management System Support Team`,
                        };

                        mg.messages().send(emailData, function (error, body) {
                            if (error) {
                                console.log(`Sending email has failed`, error);
                            } else {
                                console.log(`Sent email.`, body);
                            }
                        });
                        await sleep(3500);
                        return res.status(200).send({ message: "Email is set to your system" });
                    } catch (error) {
                        console.log("validateEmailDoesExist method : catch block section code is running");
                        console.log(error, "=======================================================================");
                        return res.status(500).send({ message: "Unable to complete update (users) operation" });
                    }
                }
            });
        }
    });
}; // End of processGetOneUserStatusData

//Task 04 - Uses what the OTP sent to the user is and verifies if it matches!
//Success Response
//Code: 204 No Content
exports.verifyUserOTP = async (req, res, next) => {
    try {
        var { email, OTP } = req.params;
        // findemail translates the user email to a user_id as a Point of Reference
        let { user_id } = await emailValidation.findEmail(email);
        //set time out for password so after 5 mins, the OTP won't be usable
        let expireTimer = 5;
        //since a user_id is individually tied to a OTP, retrive all the OTP tied to the user, but then send only the
        //latest version
        await sleep(3500);
        //This function finds the latest OTP that was sent to the user. It thens validates.
        emailValidation.validateOTP(user_id, function (results, error) {
            if (error) {
                return res.status(401).send({ code: 401, error: true, description: "Error!", content: [] });
            } else {
                let actualOTP = results[0].one_time_password;
                //sentTime
                let sentTime = moment(results[0].created_at).format("YYYY-MM-DD hh:mm:ss");
                //currentTime
                let currentTime = moment().tz("Asia/Singapore").format("YYYY-MM-DD hh:mm:ss")
                currentTime = moment(currentTime).subtract(expireTimer, "minutes").format("YYYY-MM-DD hh:mm:ss")
                // let currentTime = new Date(Date.now() - expireTimer);
                //get the number of time the the code was done
                let numberOfAttemps = results[0].number_of_attemps;

                //early guard statement to enable the system to lock it if it happened
                //by the fourth time...its rendered useless
                if (numberOfAttemps == 3) {
                    //status code that it is locked
                    return res.status(404).send({ code: 404, error: true, description: "Too many attemps!", content: [] });
                }

                if (actualOTP == OTP) {
                    if (sentTime > currentTime) {
                        console.log("Time has not breached");
                        emailValidation.correctOTP(email, function (results, error) {
                            if (error) {
                                console.log(error);
                                return res.status(401).send({ code: 401, error: true, description: "Error!", content: [] });
                            } else {
                                console.log("Here was reached");
                                const responseBody = {
                                    //user_id: results[0].user_id,
                                    //role_name: results[0].role_name,
                                    displayName: results[0].first_name + " " + results[0].last_name,
                                    status: results[0].status,
                                    email: results[0].email,
                                    token: jwt.sign(
                                        {
                                            userId: results[0].user_id,
                                            role: results[0].role_name,
                                            email: results[0].email,
                                        },
                                        config.JWTKey,
                                        {
                                            expiresIn: 86400, //Expires in 24 hrs
                                        }
                                    ),
                                }; //End of data variable setup
                                console.log(responseBody);
                                return res.status(200).send(responseBody);
                            }
                        });
                    } else {
                        console.log("Error time was breeched");
                        return res.status(402).send({ code: 402, error: true, description: "Time has expired!", content: [] });
                    }
                } else {
                    //update db that the current attempt is wrong
                    numberOfAttemps++
                    emailValidation.passwordAttemptUpdater(numberOfAttemps, actualOTP, user_id, function (error, results) {
                        if (error) {
                            console.log("ERROR WAS FOUIND")
                            return res.status(402).send({ message: `Failure` });
                        } else {
                            return res.status(401).send({ message: `The OTP you key in was wrong!` });
                        }
                    })
                }
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Error! Unable to verify OTP!" });
    }
}; // End of processGetOneUserStatusData

//Task 04 - Saves the password
//Success Response
//Code: 204 No Content
exports.verifyAndSavePassword = async (req, res, next) => {
    let jwtObject;
    var token = req.body.token;
    try {
        jwtObject = jwt.verify(token, config.JWTKey);
    } catch (e) {
        return callback(e, null);
    }
    var user_id = jwtObject.userId;
    // extracts out the new password
    var userRequestedPassword = req.params.UserPassword;
    let password = await emailValidation.extractPassword(user_id);
    var { user_password, user_password_histories } = password;

    if (!user_password_histories) {
        try {
            //checks if there is a duplicate with only the current password field
            if (await bcrypt.compare(userRequestedPassword, user_password)) {
                return res.status(403).send({ code: 401, error: true, description: "Error!", content: [] });
            } else {
                // now, lets hash the key
                // hash the current -> pushes the current into a repository
                // shift the user current password to the user_password_history
                emailValidation.storePassword(user_id, user_password + "«", function (error, results) {
                    if (error) {
                        return res.status(401).send({ code: 401, error: true, description: "Error!", content: [] });
                    }
                });

                //hash the requested -> pushes the current into a current
                bcrypt.hash(userRequestedPassword, 10, async (err, password) => {
                    // shift the user current password to the user_password_history
                    emailValidation.storeAsCurrent(user_id, password, function (error, results) {
                        if (error) {
                            return res.status(401).send({ code: 401, error: true, description: "Error!", content: [] });
                        }
                    });
                });

                return res.status(200).send("Success");
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        var increment = 0;
        //2 for history, 1 for current
        var condition = [false, false, false];

        user_password_histories.split("«").map(async (item) => {
            //Guard statement
            if (item == null) return;
            //compare and store into a boolean array
            condition[increment] = await bcrypt.compare(userRequestedPassword, item);
            increment++;
        });
        //compare with current if there's a clash
        condition[2] = await bcrypt.compare(userRequestedPassword, user_password);

        if (condition.some((item) => item === true)) {
            //if a duplicate is found, just alert the user that there is an error and the code status is 402
            return res.status(403).send({ code: 403, error: true, description: "A duplicate is found!", content: [] });
        } else {
            //A
            let everyHistoryCombined = user_password + "«";

            //B,C
            let userPasswordHistoryArray = user_password_histories.split("«");
            everyHistoryCombined += userPasswordHistoryArray[0] + "«";

            // hash current + old history into the user_password_history column
            // shift the user current password to the user_password_history
            emailValidation.storePasswordAdvanced(user_id, everyHistoryCombined, function (error, results) {
                if (error) {
                    return res.status(401).send({ code: 401, error: true, description: "Error!", content: [] });
                }
            });

            //hash the requested -> pushes the current into a current
            bcrypt.hash(userRequestedPassword, 10, async (err, password) => {
                // shift the user current password to the user_password_history
                emailValidation.storeAsCurrent(user_id, password, function (error, results) {
                    if (error) {
                        return res.status(401).send({ code: 401, error: true, description: "Error!", content: [] });
                    }
                });
            });

            emailValidation.resetAndUnlockAccount(user_id)
            return res.status(200).send("Success");
        }
    }
}; // End of processGetOneUserStatusData

exports.sendTimeStampEmail = async (req, res, next) => {
    let jwtObject;
    var token = req.body.token;
    try {
        jwtObject = jwt.verify(token, config.JWTKey);
    } catch (e) {
        return callback(e, null);
    }
    let userEmail = jwtObject.email
    const mg = mailgun({ apiKey: config.mailGunApiKey, domain: config.mailGunDomain });

    //let's inform the user what has happened to is passwored
    emailValidation.passwordChangeTimestamp(userEmail, async function (error, result) {
        if (error) {
            return res.status(401).send({ code: 401, error: true, description: "didn't send an email", content: [] });
        } else {
            try {
                // Now, lets send an email to them to user that they have requested for the change
                let emailData = {
                    from: `Competition System Admin <support@sp.competitionmanagementsystem.org>`,
                    to: `${userEmail}`,
                    subject: `Password change update`,
                    text: `
                            \nYou password has been changed.
                            \nThe time your password was changes was at ${result[0].user_password_timestamp}
                            \nIf you did not make this request, please contact +65 9647 2290
                            \n\n- The Competition Management System Support Team
                            `,
                };

                mg.messages().send(emailData, function (error, body) {
                    if (error) {
                        console.log(`Sending email has failed`, error);
                        return res.status(500).send({ message: "Unable to complete update (users) operation" });
                    } else {
                        console.log(`Sent email.`, body);
                        return res.status(200).send({ message: "Email is set to your system" });
                    }
                });
            } catch (error) {
                console.log("validateEmailDoesExist method : catch block section code is running");
                console.log(error, "=======================================================================");
                return res.status(500).send({ message: "Unable to complete update (users) operation" });
            }
        }
    });
}; // End of processGetOneUserStatusData

//Task 04 - Checks if the OTP falls within the range of 5 minutes, else rej
//Success Response
//Code: 204 No Content
exports.timingOfOTP = async (req, res, next) => {
    try {
        var { email } = req.params;
        // findemail translates the user email to a user_id as a Point of Reference
        let { user_id } = await emailValidation.findEmail(email);
        //set time out for password so after 5 mins, the OTP won't be usable
        let expireTimer = 1 * 60 * 1000;
        //since a user_id is individually tied to a OTP, retrive all the OTP tied to the user, but then send only the
        //latest version
        emailValidation.validateOTP(user_id, function (results, error) {
            if (error) {
                return res.status(401).send({ code: 401, error: true, description: "Error!", content: [] });
            } else {
                //sentTime
                let sentTime = results[0].created_at;
                //currentTime
                var currentTime = new Date(Date.now() - expireTimer);

                //if the time sent is lesser than 1 min, make it possible to resend. Else just inform them to slow down!
                if (sentTime > currentTime) {
                    return res.status(402).send({ code: 402, error: true, description: "Slow down!", content: [Math.ceil(sentTime - currentTime)] });
                } else {
                    return res.status(201).send({ message: "Ok! The 1 min interval is over! Lets allow u to send" });
                }
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Error! Unable to verify OTP!" });
    }
}; // End of processGetOneUserStatusData
