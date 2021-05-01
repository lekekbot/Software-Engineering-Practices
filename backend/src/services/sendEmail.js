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

module.exports.createFileData = (userEmail) => {
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                let query = `INSERT INTO file ( cloudinary_file_id, cloudinary_url , 
                 original_filename, team_id,created_by_id ) 
                 VALUES (?,?,?,?,?) `;

                connection.query(query, [publicId, fileUrl, originalFileName, teamId, userId], (err, rows) => {
                    if (err) {
                        console.log('Error on query on creating record inside file table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
} //End of createFileData