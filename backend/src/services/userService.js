const config = require('../config/config');
const nodeMailer = require('nodemailer')
const pool = require('../config/database');
const mysql = require("../utils/mysql.js");
const jwt = require('jsonwebtoken');

let transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS,
    }
})

module.exports.createUser = async (firstName, lastName, email, instituionId, password,callback) => {
    console.log(firstName, lastName, email, password);
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                // The SQL will create a pending status user record.
                connection.query(`INSERT INTO user ( first_name, last_name, email, user_password, 
                        institution_id,role_id,status ) VALUES (?,?,?,?,?,2, 'pending') `,
                    [firstName, lastName, email, password, instituionId], (err, rows) => {
                        if (err) {
                            return callback(err, null)
                        } else {
                            //By inspecting the rows variable, you will notice that
                            //the rows is an object {} of information after a record
                            //has been inserted.
                            //console.log(rows);
                            return callback(null, rows)
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation
} //End of createUser
module.exports.createUserConfirmation = async (uid) => {
    console.log(firstName, lastName, email, password);
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                // The SQL will create a pending status user record.
                connection.query(`INSERT INTO user ( first_name, last_name, email, user_password, 
                        institution_id,role_id,status ) VALUES (?,?,?,?,?,2, 'pending') `,
                    [firstName, lastName, email, password, instituionId], (err, rows) => {
                        if (err) {
                            return callback(err, null)
                        } else {
                            //By inspecting the rows variable, you will notice that
                            //the rows is an object {} of information after a record
                            //has been inserted.
                            //console.log(rows);
                            return callback(null, rows)
                        }
                        connection.release();
                    });
            }
        });
    }); //End of new Promise object creation
} //End of createUser
module.exports.updateUser = (recordId, newRoleId) => {
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`UPDATE user SET role_id =${newRoleId} WHERE user_id=${recordId}`, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
} //End of updateUser

module.exports.updateUsersOnRoleAndStatus = async (users) => {
    const connection = await mysql.connection();
    let index = 0;
    try {
        await connection.query("START TRANSACTION");
        for (index = 0; index < users.length; index++) {
            let userData = [users[index].roleId, users[index].status, users[index].id];
            await connection.query('UPDATE user SET role_id=? , status=?  WHERE user_id=?', userData);
        }// End of for 
        await connection.query("COMMIT");
    } catch (err) {
        await connection.query('ROLLBACK');
        console.log('ROLLBACK at saving user(s) role and status changes', err);
        throw err;
    } finally {
        await connection.release();
    }// End of try..catch..finally block


} // End of updateUsersOnRoleAndStatus


module.exports.getAllUserDataForAdmin = () => {
    //getAllUserDataForAdmin name is used so that any developer can recognize that
    //this method (function) is not supposed to be called by any other programming logic
    //which supports non-admin user REST API requests.
    //Objective: To retrieve all user records (both user,admin fole)
    console.log('userService\'s getAllUserDataForAdmin method is called.');

    let userDataQuery = `SELECT 
                            user_id id, 
                            first_name firstName, 
                            last_name lastName, 
                            email, 
                            user.role_id 
                            roleId, 
                            user.status,
                            created_at,
                            updated_at  
                        FROM 
                            user INNER JOIN role 
                        ON 
                            user.role_id = role.role_id ;`;
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(userDataQuery, [], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getAllUserDataForAdmin

module.exports.getOneUserData = function (recordId) {
    console.log('getOneUserData method is called.');
    console.log('Prepare query to fetch one user record');
    userDataQuery = `SELECT 
                        user_id,
                        email, 
                        user.role_id, 
                        role_name,
                        last_logout FROM 
                        user 
                    INNER JOIN 
                        role 
                    ON 
                        user.role_id = role.role_id 
                    WHERE 
                        user_id=?`;

    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(userDataQuery,[recordId], (err, results) => {
                    if (err) {
                        console.log(err)
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getOneUserData

module.exports.getOneDesignData = function (recordId) {
    console.log('getOneDesignData method is called.');
    console.log('Prepare query to fetch one design record');
    userDataQuery = `SELECT file_id,cloudinary_file_id,cloudinary_url,design_title,design_description 
        FROM file WHERE file_id=` + recordId;

    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(userDataQuery, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getOneDesignData

module.exports.updateDesign = (recordId, title, description) => {

    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`UPDATE file SET design_title ='${title}' , design_description='${description}' WHERE file_id=${recordId}`, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of updateDesign

module.exports.verifyUserEmail = async (token, callback) => {
    let user_id
    try {
        token = token.substring(1);
        let jwtObject = jwt.verify(token, config.EMAIL_SECRET);
        user_id = jwtObject.user_id;
    } catch (e) {
        return callback(e, null)
    }
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database connection error ', err);
        } else {
            connection.query(`UPDATE competiton_system_4_db.user SET is_verified="true" WHERE user_id=${user_id} ;`,
                (err, rows) => {
                    if (err) {
                        connection.release();
                        return callback(err, null)
                    } else {
                        connection.release();
                        return callback(null, user_id)
                    }
                });
        }
    });
} //End of updateDesign

