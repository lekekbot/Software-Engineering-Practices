//import related shit 
const config = require('../config/config');
const pool = require('../config/database');
const mysql = require("../utils/mysql.js");

// create temporary user
module.exports.tempUser = (firstName, lastName, email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database connection error', err);
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

//get temporary user data
module.exports.getTempData = (id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database connection error', err);
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

// update temporary data to reflect changes if accepted
module.exports.alterTempData = (id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database connection error', err);
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

//create admin in user table
module.exports.createAdmin = (firstName, lastName, email, pass) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database connection error', err);
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

//get role for condition: only master admin can add new admin
module.exports.getId = (email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Database connection error', err);
            connection.release()
            return callback(err, null)
        } else {
            connection.query(`SELECT role_name, user.role_id FROM user INNER JOIN role ON user.role_id=role.role_id AND email='${email}'`, (err, result) => {
                if (err) {
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

//get list for pending table
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

// delete temporary row from user_temp table
module.exports.deleteTemp = (id) => {
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

//get users for delete table
module.exports.getusers = (master) => {
    console.log(master)
    let master_adminQuery = `SELECT user_id,first_name,last_name,email,role_name FROM user u INNER JOIN role r ON u.role_id=r.role_id WHERE r.role_name<>'master_admin'`
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

//system to list out if user is part of the team
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
                            pool.getConnection((err, connection) => {
                                if (err) {
                                    console.log('Database connection error ', err);
                                    resolve(err);
                                } else {
                                    connection.query(getuserdata, [id], (err, results) => {
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

// deletes record of user, team and team members
module.exports.deleteLeadTeam = (teamId, userId) => {
    //delete 2 things from table 
    //delete team member table if leader table is 1
    //delete team table with id
    let deleteTeamMembersQuery = 'DELETE FROM team_member where team_id=?'
    let deleteTeamQuery = 'DELETE FROM team where team_id=?'
    let deleteUserQuery = 'DELETE FROM user where user_id=?'

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(deleteTeamMembersQuery, teamId, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    } else {
                        connection.query(deleteTeamQuery, teamId, (err, result) => {
                            if (err) {
                                console.log(err)
                                reject(err)
                            } else {
                                //delete user from user table 
                                connection.query(deleteUserQuery, userId, (err, result) => {
                                    if (err) {
                                        console.log(err)
                                        reject(err)
                                    } else {
                                        resolve(result)
                                    }
                                })
                            }
                        })
                    }
                    connection.release()
                })
            }
        })
    })
}

// deletes record of user and team members
module.exports.deleteTeamMember = (memberId) => {
    //delete only team member db
    let deleteTeamMemberQuery = `delete from team_member where  member_id=?`
    let deleteUserQuery = 'DELETE FROM user where user_id=?'

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(deleteTeamMemberQuery, memberId, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        connection.query(deleteUserQuery, memberId, (err, result) => {
                            if (err) {
                                console.log(err)
                                reject(err)
                            } else {
                                resolve(result)
                            }
                        })
                    }
                    connection.release()
                })
            }
        })
    })
}