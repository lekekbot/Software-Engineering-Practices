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

module.exports.getusers = (master) => {
    let master_adminQuery = `SELECT user_id,first_name,last_name,email,role_name FROM user u INNER JOIN role r ON u.role_id=r.role_id WHERE r.role_name<>'master_admin`
    let adminQuery = `SELECT user_id,first_name,last_name,email,role_name FROM user u INNER JOIN role r ON u.role_id=r.role_id WHERE r.role_name<>'master_admin' AND r.role_name<>'admin'`
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                if (master) {
                    connection.query(master_adminQuery, [], (err, results) => {
                        if (err) {
                            console.log(err)
                            reject(err)
                        } else {
                            resolve(results)
                        }
                        connection.release()
                    })
                } else {
                    connection.query(adminQuery, [], (err, results) => {
                        if (err) {
                            console.log(err)
                            reject(err)
                        } else {
                            resolve(results)
                        }
                        connection.release()
                    })
                }
            }
        })
    })
}

module.exports.getuserlist = (id) => {
    let getdataquery = `SELECT user_id,first_name,last_name,t.team_id, t.name,tm.leader,tm.team_member_id FROM USER u
    jOIN team_member tm on tm.member_id=u.user_id
    JOIN team t on t.team_id=tm.team_id WHERE user_id=?`
    let getuserdata = `SELECT user_id,first_name,last_name FROM user WHERE user_id=?`
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(getdataquery, [id], (err, results) => {
                    if (err) {
                        reject(err)
                    } else {
                        if (results.length != 0) {
                            resolve(results)
                        } else {
                            pool.getConnection((err, conenction) => {
                                if (err) {
                                    console.log('Database connection error ', err);
                                    resolve(err);
                                } else {
                                    conenction.query(getuserdata, [id], (err, results) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve(results)
                                        }
                                    })
                                }
                            })
                        }
                    }
                    connection.release()
                })
            }
        })
    })
}