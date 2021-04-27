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
//----------------------------------------------------------------------------
// File record and Cloudinary related operations
//----------------------------------------------------------------------------
module.exports.createProposalFileInCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        //Use the following console.log to inspect the file variable's content.
        //console.log(file);
        console.log('The proposalService - createProposalFileInCloudinary is running');
        // Upload binary file by calling the uploader.upload
        cloudinary.uploader.upload(file.path, { resource_type: 'raw', upload_preset: 'upload_to_proposals' })
            .then((result) => {
                //Inspect whether I can obtain the file storage id and the url from cloudinary
                //after a successful upload.
                //console.log({imageURL: result.url, publicId: result.public_id});
                let data = { fileUrl: result.url, publicId: result.public_id, operationStatus: 'success' };
                const output = { 
                    operationStatus: 'success', 
                    description: 'Saved the file at Cloudinary' ,
                    content:data};
                resolve(output);

            }).catch((error) => {
                //The error handling code is not production ready. Need to 
                //study how other software engineers best practices.
                //At the meantime, we should be aware the content inside the error variable.
                console.log(error);
                const output = { 
                 operationStatus: 'fail', 
                 description: error ,
                 content:{fileUrl:'',publicId:''}};
                reject(output);
                return;
            });
    });//End of return new Promise
} //End of createProposalFileInCloudinary
module.exports.deleteProposalFileInCloudinary = (cloudinaryFileId) => {
    return new Promise((resolve, reject) => {
        console.log('The proposalService - deleteProposalFileInCloudinary is running');
        // There are two ways to delete resource: I used the uploader API
        // by calling the destroy method and pass in the cloudinary file id
        cloudinary.uploader.destroy(cloudinaryFileId, { invalidate: true, resource_type: 'raw' })
            .then((result) => {
                //I have inspected the result variable's data structure,
                //after calling the destroy method.
                //It is either {result:'not found'} or {result:'ok'}
                console.log(result);
                if (result.result == 'not found') {
                    reject({
                        operationStatus: 'fail',
                        description: 'Unable to find the file to delete',
                        content: []
                    });
                }
                if (result.result == 'ok') {
                    resolve({
                        operationStatus: 'success',
                        description: 'The file has been removed permanently.',
                        content: []
                    });
                }
            }).catch((error) => {
                //Inspect the error variable after calling the destroy
                console.log('The uploader.destroy call has error : ', error);
                const result = {
                    operationStatus: 'fail',
                    description: error,
                    content: []
                }
                reject(result);
                return;
            });
    });//End of return new Promise
} //End of deleteProposalFileInCloudinary


module.exports.createFileData = (fileUrl, publicId, teamId, userId, originalFileName) => {
    console.log('The createFileData method is called.');
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
module.exports.deleteFileData = (fileId) => {
    console.log('The proposalService - deleteFileData method is called.');
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                let query = `DELETE FROM file WHERE file_id =?;`;
                connection.query(query, [fileId], (err, rows) => {
                    if (err) {
                        console.log('Error on query on deleting record inside file table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of deleteFileData

module.exports.getProposalsByTeamId = (teamId) => {
    console.log('The proposalService-getProposalsByTeamId method is called.');
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                const fetchQuery = 'SELECT * FROM file WHERE team_id=?'
                connection.query(fetchQuery, [teamId], (err, results) => {
                    if (err) {
                        console.log('Error on query on reading data from the file table', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
} //End of getProposalsByTeamId


// module.exports.getTotalNumberOfSubmissions = async () => {
//     return new Promise((resolve, reject) => {
//         pool.getConnection(async (err, connection) => {
//             if (err) {
//                 console.log('Database connection error ', err);
//                 resolve(err);
//             } else {
//                 connection.query(`SELECT count(*) total_number_of_submissions FROM file `, [], (err, rows) => {
//                     if (err) {
//                         console.log('Error on retrieving file data from data store', err);
//                         reject(err);
//                     } else {
//                         resolve(rows);
//                     }
//                 });
//             };
//         });
//     }); //End of new Promise object creation

// } //End of getTotalNumberOfSubmissions