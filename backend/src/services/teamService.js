const config = require('../config/config');
const pool = require('../config/database');
const promisify = require('util.promisify');
function createTeamData(teamName, userId, connection) {

    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
                connection.query('INSERT INTO team ( name , created_by_id, created_at) VALUES (?,?,now()) ', [teamName,userId], (err, rows) => {
                    if (err) {
                        //Inspect the SQL error code.
                        //To build a user understandable response message.
                        if (err.code==='ER_DUP_ENTRY'){
                            err.userMessage='The team name has been used.'
                        }
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    
                });
           

    }); //End of new Promise object creation
} //End of createTeamData

function createTeamMemberData(user_id, teamId, isLeader, userId, connection) {
    return new Promise((resolve, reject) => {
 console.log(connection);
                connection.query(`INSERT INTO team_member ( member_id, team_id, leader, created_by_id,
                    created_at) VALUES (?,?,?,?,now()) `, [userId,teamId,isLeader,userId], (err, rows) => {
                    if (err) {
                        console.log('Error on query on creating record inside team_member table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    
                });
      
    }); //End of new Promise object creation

} //End of createTeamMemberData

module.exports.createTeam = async (teamName, userId) => {
    
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                try {
                    let createTeamResult = await createTeamData(teamName, userId, connection);
                    //The create team SQL inside the createTeamData function
                    //returns an object . Not returning an [] array.
                    //Don't use createTeamResult[0].insertId
                    console.log(createTeamResult);
                   
                    let createTeamMemberResultRows =
                        await createTeamMemberData(userId,
                            createTeamResult.insertId, true, userId, connection);
                } catch (error) {
                    reject(error);
                } finally {
                    connection.release();
                    resolve({
                        operationStatus: 'success',
                        message: 'Done - Create team and team member data',
                        data: []
                    });
                };// End try..catch..finally
            };


        });
    
    
}); //End of new Promise object creation

} //End of createTeam
module.exports.getOneTeamData = async (teamId) => {
    
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`SELECT team_id id, name  FROM
                    team WHERE team_id=? `, [teamId], (err, rows) => {
                    if (err) {
                        console.log('Error on query on retrieving team data from team table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    
                });
            };


        });
    
    
}); // End of new Promise object creation

} // End of getOneTeamData


module.exports.getAllTeamsByMemberId = async (userId) => {
    
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`call sp_getTeamsByTeamMemberId(?) `, [userId], (err, rows) => {
                    if (err) {
                        console.log('Error on query on retrieving team data from team table', err);
                        reject({operationStatus:'fail',
                        description:'Unable to retrieve team information',
                        content:err});
                    } else {
                        resolve(rows);
                    }
                    
                });
            };


        });
    
    
}); //End of new Promise object creation

} //End of getAllTeamsByMemberId


module.exports.getAllTeams = async () => {
    
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`call sp_getAllTeams `, [], (err, rows) => {
                    if (err) {
                        console.log('Error on retrieving the team data from the data store', err);
                        reject('Error on retrieving the team data from the data store');
                        //Note, I did not return the actual SQL database error to the calling program.
                    } else {
                        resolve(rows);
                    }
                    
                });
            };


        });
    
    
}); //End of new Promise object creation

} //End of getAllTeams
    module.exports.updateTeam = (teamName, teamId) => {
        console.log(teamName, teamId);
        return new Promise((resolve, reject) => {

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log('Database connection error ', err);
                    resolve(err);
                } else {
                    connection.query(`UPDATE team SET name=? WHERE
                     team_id=?  `, [teamName,teamId], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        }); // End of new Promise object creation

    } // End of updateTeam

    module.exports.deleteTeam = ( teamId) => {
        console.log(teamId);
        return new Promise((resolve, reject) => {

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log('Database connection error ', err);
                    resolve(err);
                } else {
                    connection.query(`DELETE FROM team WHERE
                     team_id=?  `, [teamId], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        }); // End of new Promise object creation

    } // End of deleteTeam


    //----------------------------------------------------------------------------
    // Team member records related operations
    //----------------------------------------------------------------------------
    module.exports.getAllTeamMembersByTeamId = async (teamId) => {
        return new Promise((resolve, reject) => {
            pool.getConnection(async (err, connection) => {
                if (err) {
                    console.log('Database connection error ', err);
                    resolve(err);
                } else {
                    connection.query(`SELECT team_member_id , team_member.team_id, leader, first_name, last_name, email  FROM
                        team_member INNER JOIN user ON user.user_id=team_member.member_id WHERE team_member.team_id=? `, [teamId], (err, rows) => {
                        if (err) {
                            console.log('Error on query on retrieving team member data from team_member table', err);
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                };
            });
    }); //End of new Promise object creation
    
    } //End of getAllTeamMembersByTeamId
    module.exports.createTeamMember = (userId, teamId) => {
        
        return new Promise((resolve, reject) => {

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log('Database connection error ', err);
                    resolve(err);
                } else {
                    connection.query(`CALL sp_createTeamMember(?,?) ; `, [userId,teamId], 
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        }); // End of new Promise object creation

    } // End of createTeamMember

    module.exports.deleteTeamMember = (teamMemberId) => {
        
        return new Promise((resolve, reject) => {

            pool.getConnection((err, connection) => {
                if (err) {
                    console.log('Database connection error ', err);
                    resolve(err);
                } else {
                    connection.query(`DELETE FROM team_member WHERE team_member_id=?; `, [teamMemberId], 
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        }); // End of new Promise object creation

    } // End of deleteTeamMember