const config = require('../config/config');
const mailgun = require("mailgun-js");

//Task 04 - Extracts the user params via the params. Afterwards, uses mailguns as well as sendgrid to send a email to the user
//Success Response
//Code: 204 No Content
//METHOD : POST -> http://localhost:8081/u/users/resetpassword/:userEmail
exports.processUserEmailOTP = async (req, res, next) => {
    const userEmail = req.params.userEmail;
    const mg = mailgun({ apiKey: config.mailGunApiKey, domain: config.mailGunDomain });

    try {
        await sleep(7000);
        let emailData = {
            from: `competition system admin <admin@samples.mailgun.org>`,
            to: `{${userEmail}}}`,
            subject: `Your one time password is ... ${123456}`,
            text: `Thank you ${data[index].firstName} ${data[index].lastName} for registering as participant for the competition. Please submit your business plans before the deadline.`
        };

        mg.messages().send(emailData, function (error, body) {
            if (error) {
                console.log(`Sending email has failed`, error);
            } else {
                console.log(`Sent email.`, body);
            }
        });
    } catch (error) {
        console.log('processUserEmailOTP method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).send({ message: 'Unable to complete update (users) operation' });
    }

}; // End of processGetOneUserStatusData