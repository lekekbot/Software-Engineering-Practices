//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require('cloudinary').v2;
const config = require('../config/config');
const pool = require('../config/database')
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    upload_preset: 'upload_to_team_submission'
});

module.exports.uploadFile = async(file,callback) => {
    try{
        cloudinary.uploader.upload(file.path,{upload_preset:'upload_to_team_submission'})
        .then((result) => {
            let data = {fileURL: result.url, publicId: result.public_id, fileName: result.original_filename, status: 'success'}
            callback(null,data);
            return;
        })
    }catch(err){
        callback(err, null);
        return;
    }
}

module.exports.createFileData = (fileURL, publicId, fileName, teamId,createdId ) =>{
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
            if(err){
                resolve(err);
            } else {
                let query =`call sp_createTeamSubmission('${fileURL}', '${publicId}','${fileName}','${teamId}','${createdId}')`;
                connection.query(query, [], (err,rows)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                })
            }
        })
    })
}

