const config = require('../config/config');
const pool = require('../config/database');

module.exports.checkCanJoinTeam= async (userEmail,teamId) => {
    // This method is called to return one record which matches the input, userEmail.
    // Only those records tied to the team id value are checked.
    // This method is part of the main logic flow to decide whether a user
    // can join a team which was created by another user.
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`SELECT email, team_id  FROM
                    team_invite_list WHERE email=? AND team_id=? `, [userEmail,teamId], (err, rows) => {
                    if (err) {
                        console.log('Error on query on retrieving data from team_invite_list table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            };
        });
}); // End of new Promise object creation
} // End of checkCanJoinTeam

module.exports.getTeamInviteListByEmail= async (userEmail) => {
    console.log('Check the userEmail variable for findTeamInviteListByEmail')
    console.log(userEmail);
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`SELECT * FROM team_invite_list 
                INNER JOIN team ON
                team_invite_list.team_id=team.team_id AND email=?`, [userEmail], (err, rows) => {
                    if (err) {
                        console.log('Error on query on retrieving data from team_invite_list table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            };
        });
}); // End of new Promise object creation
} // End of getTeamInviteListByEmail
  // -------------------------------------------------------------------------------------
module.exports.getAllTeamInviteListByTeamId = async (teamId) => {
    
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                
                connection.query(`SELECT team_invite_list_id id, email, 
                team_id teamId, join_status joinStatus, created_at createdAt FROM
                    team_invite_list WHERE team_id=? `, [teamId], (err, rows) => {
                    if (err) {
                        console.log('Error on query on retrieving data from team_invite_list table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    
                });
            };


        });
    
    
}); //End of new Promise object creation

} //End of getAllTeamInviteListByTeamId

module.exports.createTeamInviteList = async (email, teamId, userId) => {
    
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                try {
                    let createTeamInviteListResult = await createTeamInviteListData(email, teamId, userId, connection);
                    console.log(createTeamInviteListResult);
                    let teamInviteListData = await getAllTeamInviteListDataByTeamId(
                             teamId, connection);
                    console.log('Checking teamInviteListData content structure');
                    // I have inspected the teamInviteListData
                    // As a result, I have to use teamInviteListData[0] in the resolve.
                    console.log(teamInviteListData);
                    resolve(teamInviteListData[0]);                       
                } catch (error) {
                    reject(error);
                } finally {
                    connection.release();
              
                };// End try..catch..finally
            };


        });
    
    
}); // End of new Promise object creation

} // End of createTeamInviteList
module.exports.deleteTeamInviteList = (teamInviteListId) => {
    console.log('teamInviteListId variable value : ' ,teamInviteListId);
   
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`CALL sp_deleteTeamInviteListAndGetNewTeamInviteList(?)  `, 
                [teamInviteListId], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(rows);
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); // End of new Promise object creation

} // End of deleteTeamInviteList
//------------------------------- helper methods --------------------------------------
function createTeamInviteListData (email, teamId, createdById, connection){
        console.log(email, teamId, createdById);
        return new Promise((resolve, reject) => {

            
                    connection.query(`CALL sp_createTeamInviteList(?,?,?)  `, [email,teamId,createdById], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(rows);
                            resolve(rows);
                        }
                 
                    });
         });// End of new Promise object creation
} // End of createTeamInviteListData

function getAllTeamInviteListDataByTeamId ( teamId, connection){
   
        return new Promise((resolve, reject) => {

  
                    connection.query(`CALL sp_getTeamInviteListByTeamId(?)  `, [teamId], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(rows);
                            resolve(rows);
                        }
              
                    });
           
        
        }); // End of new Promise object creation

    } // End of getAllTeamInviteListDataByTeamId
