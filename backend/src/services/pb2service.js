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
            connection.query(`SELECT t.team_id, t.name, u.first_name, u.email, f.cloudinary_url, 
            f.created_at from user u 
            inner join team_member tm on tm.member_id = u.user_id
            inner join team t on t.team_id = tm.team_id
            inner join file f on f.team_id = t.team_id
            where tm.leader = 1`, [], (err, res) => {
                if(err) {
                    return cb(err,null)
                }
                else {
                    return cb(null,res)
                }
            })
        }
    })
}