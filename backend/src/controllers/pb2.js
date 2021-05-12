const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer')
const config = require('../config/config');
const pb2_service = require('../services/pb2service');

const moment = require("moment-timezone");


exports.getTeamInfo = async (req, res) => {
    try {
        pb2_service.getTeamInfo((err, result) => {
            if (err) {
                console.log(err)
                //wow this is very cool
                //from - pz
                return res.status(500).send('HELP')
            } else {
                const formattedResults = result.map(function (row) {
                    // This function defines the "mapping behaviour". 
                    // the first_name and last_name are concatenated and mapped to 
                    // the corresponding new property, displayName. team_member_id is mapped
                    // to the corresponding new property memberId.
                    return {
                        teamName: row.name,
                        fileId: row.cloudinary_file_id,
                        fileName: row.original_filename,
                        teamId: row.team_id,
                        cloudinaryFileId: row.cloudinary_file_id,
                        url: row.cloudinary_url,
                        firstName: row.first_name,
                        lastName: row.last_name,
                        email: row.email,
                        date_created: row.created_at
                    }
                })
                var responseData = {
                    code: 200,
                    error: false,
                    description: 'An array of proposal file object information.',
                    content: formattedResults,
                }
                console.log(responseData)
                return res.status(200).send(responseData);
            }
        })
    } catch (err) {
        console.log(err)
    }
}

//SETS THE DEADLINE(ADMIN SIDE)
exports.setDeadline = async (req, res) => {
    let timestamp = (req.body.setDate)
    try {
        pb2_service.setDeadline(moment(timestamp).tz("Asia/Singapore").format("YYYY-MM-DD hh:mm:ss"), function (err, result) {
            if (err) {
                console.log(err)
                return res.status(500).send('HELP')
            } else {
                console.log("Success")
                return res.status(200).send(result)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

// get deadline
exports.getDeadline = async (req, res, next) => {
    try {
        pb2_service.getDeadline(async function (error, result) {
            if (error) {
                return res.status(401).send({ code: 401, error: true, description: "Haha, getting the deadline has failed", content: [] });
            } else {
                return res.status(200).send(result[0].deadline_timestamp)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

//get pending list 
exports.getPending = async (req, res) => {
    let results = await pb2_service.getPendingProposals()
    //sending back a number
    return res.status(200).send(Object.values(results[0]))
}

//update last logout
exports.updateLastLogout = async (req, res) => {
    const user_id = req.body.userId;
    try {
        let results = await pb2_service.updateLastLogout(user_id);
        return res.status(200).send("Last logout successful")
    } catch (err) {
        console.log(err)
        return res.status(500).send("Fail to update last logout")
    }
}