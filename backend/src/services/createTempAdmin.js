//import related shit 
const config = require('../config/config');
const pool = require('../config/database');
const mysql = require("../utils/mysql.js");

module.exports.tempUser = (firstName, lastName, email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database conenction error', err);
            return callback(err, null)
        } else {
            connection.query(`INSERT INTO user_temp (first_name, last_name, email) VALUES (?,?,?)`,
                [firstName, lastName, email], (err, rows) => {
                    if (err) {
                        return callback(err, null)
                    } else {
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
            return callback(err, null)
        } else {
            connection.query(`SELECT * FROM user_temp WHERE user_id = ?`, id, (err, result) => {
                if (err) {
                    console.log(err);
                    return callback(err, null)
                } else {
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
            return callback(err, null)
        } else {
            connection.query(`UPDATE user_temp set accepted = 1 WHERE user_id = ?`, id, (err, result) => {
                if (err) {
                    console.log(err);
                    return callback(err, null)
                } else {
                    return callback(null, result)
                }
            })
        }
    })
}