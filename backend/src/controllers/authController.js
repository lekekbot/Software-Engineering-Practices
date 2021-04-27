const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
// I used this to simulate a delay so that I can test the client-side laoding spinner.
const sleep = require('sleep-promise');
exports.processAdminLogin = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    try {
        auth.authenticateAdmin(email, function(error, results) {
            if (error) {
                
                return res.status(401).send({ code:401, 
                    error:true, 
                    description:'Login failed.',
                    content:[] });


            } else {
                if (results.length == 1) {
                    if ((password == null) || (results[0] == null)) {
                        return res.status(401).send({ code:401, 
                            error:true, 
                            description:'Login failed.',
                            content:[] });
                    }
                    if (bcrypt.compareSync(password, results[0].user_password) == true) {

                        let data = {
                            displayName: results[0].first_name + ' ' + results[0].last_name ,
                            email: results[0].email,
                            token: jwt.sign({ userId: results[0].user_id, role:results[0].role_name , email:results[0].email}, config.JWTKey, {
                                expiresIn: 86400 //Expires in 24 hrs
                            })
                        }; //End of data variable setup

                        return res.status(200).send(data);
                    } else {
                        return res.status(401).send({ code:401, 
                            error:true, 
                            description:'Login failed.',
                            content:[] });
                        
                    } // End of password comparison with the retrieved decoded password.
                } // End of checking if there are returned SQL results

            }

        })

    } catch (error) {
        return res.status(500).send({ code:500, 
            error:true, 
            description:'Internal error',
            content:[] });
    } //end of try



};// End of processAdminLogin

//  /api/u/users/signin
exports.processUserLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        auth.authenticateUser(email, function(error, results) {
            if (error) {
                const message = 'Internal technical error.';
                return res.status(500).send({ 
                    code:500,
                    error:true,
                    description: message,
                    content:[] });
            } else {
                if (results.length == 1) {
                    if ((password == null) || (results[0] == null)) {
                        return res.status(401).send({ 
                            code:401,
                            error:true,
                            description: 'Credentials are not valid.',
                            content:[] });
                    }
                    if (bcrypt.compareSync(password, results[0].user_password) == true) {

                        const responseBody = {
                            //user_id: results[0].user_id,
                            //role_name: results[0].role_name,
                            displayName: results[0].first_name + ' ' + results[0].last_name ,
                            status: results[0].status,
                            email: results[0].email,
                            token: jwt.sign({ userId: results[0].user_id, 
                                role:results[0].role_name  , 
                                email:results[0].email}, 
                                config.JWTKey, {
                                expiresIn: 86400 //Expires in 24 hrs
                            })
                        }; //End of data variable setup

                        return res.status(200).send(responseBody);
                    } else {
                       
                        return res.status(401).send({ error:true,code:401,description:'Login fail.',content:[]});
                    } //End of password comparison with the retrieved decoded password.
                } //End of checking if there are returned SQL results

            }

        })

    } catch (error) {
        return res.status(500).send({ code:500, 
            error:true, 
            description:'Internal error',
            content:[] });
    } //end of try



};

// /api/users/register
exports.processRegister = (req, res, next) => {
    console.log('The processRegister running');
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;
    let institutionId = req.body.institution.value;
  

    bcrypt.hash(password, 10, async(err, hash) => {
        if (err) {
            console.log('Error on hashing password');
            return res.status(500).json({ message: 'Unable to complete registration' });
        } else {
            try {
                results = await user.createUser(firstName, lastName, email, institutionId,hash);
                console.log(results);
                return res.status(200).json({ code:200,
                     error:false,
                     description: 'Completed registration',
                     content:[] });
            } catch (error) {
                console.log('The processRegister method : catch block section code is running');
                console.log(error, '=======================================================================');
                return res.status(500).send({code:500, error:true, content:[],
                    description: 'Unable to complete registration' });
            }
        }
    });


}; // End of processRegister

exports.processGetOneUserStatusData = async(req, res, next) => {
    console.log('The processGetOneUserStatusData running');

    const userEmail = req.params.userEmail;
     
    
   
    try {
        await sleep(7000);
        let oneResult = await auth.getOneUserStatusData(userEmail);
        return res.status(200).send({ error:false, code:200, description: 'One user object', 
       content:oneResult});
    } catch (error) {
        console.log('The processGetOneUserStatusData method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).send({ error:true,code:500,description: 'Internal technical problem has occurred.' , content:[]});
    }


}; // End of processGetOneUserStatusData