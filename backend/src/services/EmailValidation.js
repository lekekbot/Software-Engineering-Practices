//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require('cloudinary').v2;
const config = require('../config/config');
const pool = require('../config/database')
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    upload_preset: 'upload_to_proposals'
});

//checks with the db whether an account under xxx@gmail.com does exist. Else flag an error using status codes
//only two answer using CallBacks. - either yes, it does exist or no.
//yes - Yes it does exist in our DB!
//no  - Maybe its a server error...?
//no  - Alright... cant find an email...therefore it failed
module.exports.validateEmailDoesExist = (email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                let query = `SELECT * FROM competiton_system_4_db.user WHERE user.email = ?;`;
                connection.query(query, [email], (err, results) => {
                    if (err) {
                        if (err) return callback(err, null);
                    } else {
                        if (results.length == 1) {
                            return callback(null, results);
                        } else {
                            return callback("Can't find the given email!", null);
                        }
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);;
            }
        }
    });
} //End of createFileData

//Uses the token/localstorage from from the front end. Afterwards, it translates the email into a user_id which is a foreign key
//tied to the db, one_time_password. 
//Success Response - ?
module.exports.findEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                //The SQL has to query by email.
                //The SQL must not retrieve administrator data 
                connection.query(`SELECT user_id FROM competiton_system_4_db.user where email = ?`, [email],
                    (err, result) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            console.log('Retrieved data : ');
                            resolve(result[0]);
                        }
                    });
            };
        });
    }); //End of new Promise object creation
} // End of getOneUserStatusData

//Afterwards, the user_id is used to find all the OTP associated to the user_id. We sort by desc using time and 
//use the first result
//Success Response - ?
module.exports.validateOTP = (user_id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                let query = `SELECT password.one_time_password FROM competiton_system_4_db.one_time_password password, competiton_system_4_db.user user where user_id=user_id_fk2 and user_id = ? ORDER BY password.created_at DESC;`;
                connection.query(query, [user_id], (err, results) => {
                    if (err) {
                        if (err) return callback(err, null);
                    } else {
                        return callback(results, null);
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);;
            }
        }
    });
} //End of createFileData