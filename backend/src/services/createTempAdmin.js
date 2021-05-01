//import related shit 
const config = require('../config/config');
const pool = require('../config/database');
const mysql = require("../utils/mysql.js");

module.exports.tempUser = (firstName, lastName, email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database conenction error', err);
            connection.release()
            return callback(err, null)
        } else {
            connection.query(`INSERT INTO user_temp (first_name, last_name, email) VALUES (?,?,?)`,
                [firstName, lastName, email], (err, rows) => {
                    if (err) {
                        connection.release()
                        return callback(err, null)
                    } else {
                        connection.release()
                        return callback(null, rows)
                    }
                })
        }
    })
}

module.exports.getTempData = (id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database conenction error', err);
            connection.release()
            return callback(err, null)
        } else {
            connection.query(`SELECT * FROM user_temp WHERE user_id = ?`, id, (err, result) => {
                if (err) {
                    console.log(err);
                    connection.release()
                    return callback(err, null)
                } else {
                    connection.release()
                    return callback(null, result)
                }
            })
        }
    })
}


module.exports.alterTempData = (id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database conenction error', err);
            connection.release()
            return callback(err, null)
        } else {
            connection.query(`UPDATE user_temp set accepted = 1 WHERE user_id = ?`, id, (err, result) => {
                if (err) {
                    console.log(err);
                    connection.release()
                    return callback(err, null)
                } else {
                    connection.release()
                    return callback(null, result)
                }
            })
        }
    })
}

module.exports.createAdmin = (firstName, lastName, email, pass) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database conenction error', err);
            connection.release()

            return callback(err, null)
        } else {
            connection.query(`INSERT into user (first_name,last_name,email,user_password, role_id, institution_id, status) VALUES(?,?,?,?,?,?, 'approved')`,
                [firstName, lastName, email, pass, 1, 0], (err, result) => {
                    if (err) {
                        connection.release()

                        return err
                    } else {
                        connection.release()

                        return result
                    }
                })
        }
    })
}

module.exports.getId = (email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database conenction error', err);
            connection.release()
            return callback(err, null)
        } else {
            connection.query(`SELECT role_name, user.role_id FROM user INNER JOIN role ON user.role_id=role.role_id AND email='${email}'`, (err, result) => {
                if (err) {
                    connection.release()
                    return callback(err, null)
                } else {
                    console.log(result)
                    connection.release()
                    return callback(null, result)
                }
            })
        }
    })
}

module.exports.getList = () => {
    let TempDataQuery = `SELECT * FROM user_temp`

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(TempDataQuery, [], (err, results) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(results)
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports.deleteTemp = (id, callback) => {
    let deleteTempData = `DELETE FROM user_Temp WHERE user_id = ${id}`

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(deleteTempData, [], (err, results) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(results)
                    }
                    connection.release()
                })
            }
        })
    })
}