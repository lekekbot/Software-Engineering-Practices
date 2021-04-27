const userManager = require('../services/userService');
const config = require('../config/config');
const mailgun = require("mailgun-js");
// 

exports.processGetAllUserDataForAdmin = async(req, res, next) => {

    try {
        let results = await userManager.getAllUserDataForAdmin();
        console.log('Inspect result variable inside controller\'s processGetUserDataForAdmin code\n', results);
        if (results) {
            var jsonResult = {
                data: results
            }
            return res.status(200).send(jsonResult);
        }
    } catch (error) {
        //When testing this processGetUserDataForAdmin, my client side was able to 
        //see this error details because I response with {message:<error details from userService>}
        /*
        {"message":{"code":"ER_BAD_FIELD_ERROR","errno":1054,
        "sqlMessage":"Unknown column 'fullname' in 'field list'","sqlState":"42S22",
        "index":0,"sql":"SELECT user_id, fullname, email, role.role_name ,
        user.role_id, user.status  \n
        FROM user INNER JOIN role ON user.role_id = role.role_id ;"}}
        */
        let message = 'Server is unable to process your request.';
        /*Must change this json response data in the future to something else so 
        that client side dont get the error details*/
        return res.status(500).send({
            message: error 
        });
    }

}; //End of processGetAllUserDataForAdmin

exports.processGetOneUserData = async(req, res, next) => {
    let recordId = req.params.recordId;

    try {
        let results = await userManager.getOneUserData(recordId);
        console.log('Inspect result variable inside processGetOneUserData code\n', results);
        if (results) {
            var jsonResult = {
                'userdata': results[0],
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetOneUserData


exports.processUpdateOneUser = async(req, res, next) => {
    console.log('processUpdateOneUser running');
    //Collect data from the request body 
    let recordId = req.body.recordId;
    let newRoleId = req.body.roleId;
    try {
        results = await userManager.updateUser(recordId, newRoleId);
        console.log(results);
        return res.status(200).json({ message: 'Completed update' });
    } catch (error) {
        console.log('processUpdateOneUser method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete update operation' });
    }


}; //End of processUpdateOneUser
exports.processUpdateUsersOnRoleAndStatus = async(req, res, next) => {
    console.log('processUpdateUsersOnRoleAndStatus running');
    // Collect data from the request body 
    let data = req.body;
    console.log(data);
    try {
        results = await userManager.updateUsersOnRoleAndStatus(data);
        console.log(results);
        //I copied the code from official MailGun API tutorial website
        const mg = mailgun({ apiKey: config.mailGunApiKey, domain: config.mailGunDomain });
        for(index=0;index<data.length;index++){
        if(data[index].status=='approved'){
        let emailData = {
            from: `competition system admin <admin@samples.mailgun.org>`,
            to: 'billhstan4@gmail.com',
            subject: 'Your user registration has been approved',
            text: `Thank you ${data[index].firstName} ${data[index].lastName} for registering as participant for the competition. Please submit your business plans before the deadline.`
        };
        mg.messages().send(emailData, function (error, body) {
            if(error){
                console.log(`Sending email has failed`,error);
            }else{   
            console.log(`Sent email.`,body);

            }
        });
        }
    }// End of for loop to send emails
        return res.status(200).send({ message: 'Completed update' });
    } catch (error) {
        console.log('processUpdateUsersOnRoleAndStatus method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).send({ message: 'Unable to complete update (users) operation' });
    }


}; //End of processUpdateUsersOnRoleAndStatus
