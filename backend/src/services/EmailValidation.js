//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require('cloudinary').v2;
const config = require('../config/config');
const pool = require('../config/database')
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    upload_preset: 'upload_to_proposals'
});

module.exports.validateEmail = (userEmail, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err) throw err;
        } else {
            try {
                let query = `SELECT * FROM competiton_system_4_db.user WHERE user.email = ?;`;
                connection.query(query, [userEmail], (err, results) => {
                    if (err) {
                        if (err) return callback(err, null);
                    } else {
                        if (results.length == 1) {
                            return callback(null, results);
                        } else {
                            return callback('Email Validation has failed', null);
                        }
                    }
                    connection.release();
                });
            } catch (error) {
                return callback(error, null);;
            }
        }
    });
} //End of createFileData