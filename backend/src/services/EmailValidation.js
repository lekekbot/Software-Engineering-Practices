//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require("cloudinary").v2;
const config = require("../config/config");
const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const moment = require("moment");

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
                return callback(error, null);
            }
        }
    });
};

//Uses the token/localstorage from from the front end. Afterwards, it translates the email into a user_id which is a foreign key
//tied to the db, one_time_password.
//Success Response - ?
module.exports.findEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log("Database connection error ", err);
                resolve(err);
            } else {
                //The SQL has to query by email.
                //The SQL must not retrieve administrator data
                connection.query(`SELECT user_id FROM competiton_system_4_db.user where email = ?`, [email], (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                    connection.release();
                });
            }
        });
    });
};

//Afterwards, the user_id is used to insert the OTP associated to the user_id
//Success Response - ?
module.exports.insertOTP = (OTP, user_id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                let query = "INSERT INTO competiton_system_4_db.one_time_password(one_time_password, user_id_fk2) VALUES(?,?)";
                connection.query(query, [OTP, user_id], (error, result) => {
                    if (error) {
                        if (error) return callback(error, null);
                    } else {
                        return callback(null, result);
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);
            }
        }
    });
};

//Afterwards, the user_id is used to find all the OTP associated to the user_id. We sort by desc using time and
//use the first result
//Success Response - ?
module.exports.validateOTP = (user_id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                let query = `SELECT password.one_time_password, password.created_at, password.number_of_attemps FROM competiton_system_4_db.one_time_password password, competiton_system_4_db.user user where user_id=user_id_fk2 and user_id = ? ORDER BY password.created_at DESC;`;
                connection.query(query, [user_id], (err, results) => {
                    if (err) {
                        if (err) return callback(err, null);
                    } else {
                        return callback(results, null);
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);
            }
        }
    });
};

module.exports.correctOTP = (email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                let query = `SELECT user.user_id, first_name, last_name, status, email, user_password, role_name, user.role_id  
                FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`;
                connection.query(query, [email], (err, rows) => {
                    if (err) {
                        if (err) return callback(null, err);
                    } else {
                        if (rows.length == 1) {
                            return callback(rows, null);
                        } else {
                            return callback(null, "Login has failed");
                        }
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(null, error);
            }
        }
    });
};

module.exports.extractPassword = async (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log("Database connection error ", err);
                resolve(err);
            } else {
                //The SQL has to query by email.
                //The SQL must not retrieve administrator data
                let query = `SELECT user_password, user_password_histories FROM competiton_system_4_db.user WHERE user_id = ?;`;
                connection.query(query, [user_id], (err, results) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(results[0]);
                    }
                    connection.release();
                });
            }
        });
    });
};

module.exports.storePassword = (user_id, password, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                //stores current into repository of history
                let query = `UPDATE competiton_system_4_db.user SET user_password_histories = ? WHERE user_id = ?`;
                connection.query(query, [password, user_id], (err, results) => {
                    if (err) {
                        if (err) return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);
            }
        }
    });
};

module.exports.storePasswordAdvanced = (user_id, password, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                //stores current into repository of history
                let query = `UPDATE competiton_system_4_db.user SET user_password_histories = ? WHERE user_id = ?`;
                connection.query(query, [password, user_id], (err, results) => {
                    if (err) {
                        if (err) return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);
            }
        }
    });
};

module.exports.storeAsCurrent = (user_id, newCurrentPassword, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                //stores current into repository of history
                let query = `UPDATE competiton_system_4_db.user SET user_password = ?, user_password_timestamp = ? WHERE user_id = ?`;
                connection.query(query, [newCurrentPassword, moment().format("YYYY-MM-DD HH:mm:ss"), user_id], (err, results) => {
                    if (err) {
                        if (err) return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);
            }
        }
    });
};

//extract the time from the database of the change it was made!
module.exports.passwordChangeTimestamp = (email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                //retrives the timing of the change was made and then email/userid to the user
                let query = `SELECT user_password_timestamp FROM competiton_system_4_db.user where email = ?`;
                connection.query(query, [email], (err, results) => {
                    if (err) {
                        if (err) return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);
            }
        }
    });
};

//update the amount of attempts
module.exports.passwordAttemptUpdater = (numberOfAttempts, OTP, user_id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                let query = `UPDATE competiton_system_4_db.one_time_password SET number_of_attemps = ? WHERE one_time_password = ? AND user_id_fk2 = ? `;
                connection.query(query, [numberOfAttempts, OTP, user_id], (err, results) => {
                    if (err) {
                        if (err) return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);
            }
        }
    });
};