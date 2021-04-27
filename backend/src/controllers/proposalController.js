const config = require('../config/config');
const jwt = require('jsonwebtoken');
const proposalManager = require('../services/proposalService');
exports.processCreateProposal = async (req, res, next) => {
    let checkUserResult = null;
    //This method will be called twice if the user is uploading 2 files from the front end UI.
    //This method will be called four times, if the user submits 4 files.
    console.log('proposalController - processCreateProposal running');
    console.log(req.body.originalFileName);
    try {
        checkUserResult = await obtainUserIdIfUserIsUserRole(req.body.token);
        let fileSubmitToCloudinaryResult = await proposalManager.createProposalFileInCloudinary(req.body.file);

        let fileUrl = fileSubmitToCloudinaryResult.content.fileUrl;
        let publicId = fileSubmitToCloudinaryResult.content.publicId;
        let userId = checkUserResult.userId;
        let teamId = req.params.teamId;
        let originalFileName = req.body.originalFileName;

        console.log('Check fileSubmitToCloudinaryResult before calling createFileData ');
        console.log(fileSubmitToCloudinaryResult);

        let createFileDataResult = await proposalManager.createFileData(fileUrl, publicId, teamId, userId, originalFileName);
        if (createFileDataResult.operationStatus == 'success') {
            let message = 'File submission completed.';
            return res.status(200).send({
                code: 200,
                error: false,
                description: message, 
                content: { fileUrl: createFileDataResult.fileUrl }
            });
        }// End of if (createFileDataResult.operationStatus=='success') {     
    } catch (error) {
        console.log(error);
        if (error.authorization == false) {
            let message = 'Not authorized to complete this operation.';
            return res.status(403).send({
                code:200,
                error: true,
                description : message,
                content: []
            });
        }
        if (error.operationStatus == 'fail') {

            return res.status(500).send({
                code: 500,
                error: true,
                description: 'The file submission operation was not completed successfully.',
                content: []
            });
        }
        return res.status(500).send({
            code: 500,
            error: true,
            message: 'The file submission operation was not completed successfully.',
            content : []
        });
    }// End of try/catch block 





};// End of processCreateProposal


exports.processGetProposalsByTeamId = async (req, res, next) => {
    let teamId = req.params.teamId;
    try {
        let results = await proposalManager.getProposalsByTeamId(teamId);

        if (results) {
            const formattedResults = results.map(function (row) {
                // This function defines the "mapping behaviour". 
                // the first_name and last_name are concatenated and mapped to 
                // the corresponding new property, displayName. team_member_id is mapped
                // to the corresponding new property memberId.

                return {
                    fileId: row.file_id,
                    fileName: row.original_filename,
                    teamId: row.team_id,
                    cloudinaryFileId: row.cloudinary_file_id,
                    url: row.cloudinary_url
                }

            })


            var responseData = {
                code:200,
                error:false,
                description: 'An array of proposal file object information.',
                content: formattedResults,
            }
            return res.status(200).send(responseData);
        }
    } catch (error) {
        console.log('The proposalController - processGetProposalsByTeamId has error', error);
        let message = 'Server is unable to process the request.';
        return res.status(500).send({
            code:500,
            error:true,
            description: message,
            content: []
        });
    }

}; //End of processGetProposalsByTeamId

exports.processDeleteOneProposal = async (req, res, next) => {
    let fileId = req.body.fileId;
    //The files stored inside cloudinary has a public id pattern which begins with
    //Proposals/
    let cloudinaryFileId = `${req.body.cloudinaryFileId}`;
    console.log('The proposalController - processDeleteOneProposal is called.');
    console.log('Checking the cloudinaryFileId :', cloudinaryFileId);
    try {
        let deleteFileInCloudinaryResult = await proposalManager.deleteProposalFileInCloudinary(cloudinaryFileId);
        console.log('Inspect results variable after calling deleteProposalFileInCloudinary method', deleteFileInCloudinaryResult);
        if (deleteFileInCloudinaryResult.operationStatus == 'success') {
            const deleteResult = await proposalManager.deleteFileData(fileId);
            if (deleteResult.affectedRows == 1) {
                const responseData = {
                    error:false,
                    code:200,
                    description: 'The file has been permanently deleted.',
                    content: []
                }
                return res.status(200).send(responseData);
            }
        }
    } catch (error) {
        console.log(error);
        const responseData = {
            error:true,
            code:500,
            description: 'Unable to delete the file.',
            content: []
        }
        return res.status(500).send(responseData);
    }

}; // End of processDeleteOneProposal
// Helper function to check and decode security token which is inside the req.body.token
function obtainUserIdIfUserIsUserRole(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWTKey, (err, data) => {
            console.log('The data decoded from token is ', data);
            if (err) {
                //console.log(err);
                resolve({ userId: 0, authorization: false });
            }
            else {
                if (data.role == 'user') {
                    console.log('Decoded userId is ', data.userId);
                    resolve({ userId: data.userId, authorization: true });
                } else {
                    reject({ userId: 0, authorization: false });
                }
            }
        })
    });//End of new Promise ...
} // End of obtainUserIdIfUserIsUserRole


