config = require('../config/config');
const pool = require('../config/database')
module.exports.authenticateUser = (email, callback) => {

        pool.getConnection((err, connection) => {
            if (err) {
                if (err) throw err;

            } else {
                try {
                    connection.query(`SELECT user.user_id, first_name, last_name, status, email, user_password, role_name, user.role_id  
                   FROM user INNER JOIN role ON user.role_id=role.role_id AND email='${email}'`, {}, (err, rows) => {
                        if (err) {
                            if (err) return callback(err, null);

                        } else {
                            if (rows.length == 1) {
                                console.log(rows);
                                return callback(null, rows);

                            } else {

                                return callback('Login has failed', null);
                            }
                        }
                        connection.release();

                    });
                } catch (error) {
                    return callback(error, null);;
                }
            }
        }); // End of getConnection

    } // End of authenticate
    module.exports.getOneUserStatusData = async (userEmail) => {
        
        return new Promise((resolve, reject) => {
            pool.getConnection(async (err, connection) => {
                if (err) {
                    console.log('Database connection error ', err);
                    resolve(err);
                } else {
                    //The SQL has to query by email.
                    //The SQL must not retrieve administrator data 
                    connection.query(`SELECT user.user_id, first_name, last_name, email, status, user.role_id  
                   FROM user WHERE user.role_id=2 AND email=?`, [userEmail],(err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log('Retrieved data : ');
                        console.log(rows);
                        resolve(rows[0]);
                    }
                    
                });
            };
        });
    
    
    }); //End of new Promise object creation

    } // End of getOneUserStatusData
    module.exports.authenticateAdmin = (email, callback) => {

        pool.getConnection((err, connection) => {
            if (err) {
                if (err) throw err;

            } else {
                try {
                    connection.query(`SELECT user.user_id, first_name, last_name, email, user_password, role_name, user.role_id  
                   FROM user INNER JOIN role ON user.role_id=role.role_id AND role_name='admin' AND email=?`, [email], (err, rows) => {
                        if (err) {
                            if (err) return callback(err, null);

                        } else {
                            if (rows.length == 1) {
                                console.log(rows);
                                return callback(null, rows);

                            } else {

                                return callback('Login has failed', null);
                            }
                        }
                        connection.release();

                    });
                } catch (error) {
                    return callback(error, null);;
                }
            }
        }); // End of getConnection

    } // End of authenticateAdmin