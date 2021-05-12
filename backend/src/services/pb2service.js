const config = require('../config/config');
const pool = require('../config/database');
const mysql = require("../utils/mysql.js");


module.exports.getTeamInfo = (cb) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database connection error', err);
            connection.release()
            return callback(err, null)
        } else {
            connection.query(`SELECT t.team_id, t.name, u.first_name, u.last_name, u.email, f.cloudinary_file_id, f.original_filename,  f.cloudinary_url, 
            f.created_at from user u 
            inner join team_member tm on tm.member_id = u.user_id
            inner join team t on t.team_id = tm.team_id
            inner join file f on f.team_id = t.team_id
            where tm.leader = 1`, [], (err, res) => {
                if (err) {
                    return cb(err, null)
                }
                else {
                    return cb(null, res)
                }
            })
        }
    })
}

//get pending
module.exports.getPendingProposals = () => {
    let getPending = `SELECT SUM(pending_proposals) FROM team `

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(getPending, [], (err, results) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        console.log(results + " results");
                        resolve(results)
                    }
                    connection.release()
                })
            }
        })
    })
}

//set pending
module.exports.setDeadline = (timestamp, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                let query = `UPDATE competiton_system_4_db.deadline SET deadline_timestamp = ? WHERE deadline_id=1`;
                connection.query(query, [timestamp], (err, results) => {
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
}

//get pending
module.exports.getDeadline = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                let query = `SELECT * FROM competiton_system_4_db.deadline;`;
                connection.query(query, [], (err, results) => {
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
}

module.exports.updateLastLogin = (currentTime, email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            connection.query(`UPDATE user SET last_login='${currentTime}' where email = '${email}'`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows)
                }
                connection.release();
            });

        }
    }); // End of getConnection
} // End of updateLastLogin


module.exports.getNumberofNotifications = async (currentTime, lastLogin) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                //The SQL has to query by email.
                //The SQL must not retrieve administrator data 
                connection.query(`select * from file where date_created < '${currentTime}' and date_created > '${lastLogin}'`, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log('Retrieved data : ');
                        console.log(rows);
                        resolve(rows);
                    }
                });
            };
        });
    }); //End of new Promise object creation
} // End of getNumberofNotifications

module.exports.updateLastLogout = async (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                //The SQL has to query by email.
                //The SQL must not retrieve administrator data 
                connection.query(`UPDATE user SET last_logout = CURRENT_TIMESTAMP where user_id = ?`, [user_id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log('Retrieved data : ');
                        console.log(rows);
                        resolve(rows);
                    }
                });
            };
        });
    }); //End of new Promise object creation
} // End of getNumberofNotifications
