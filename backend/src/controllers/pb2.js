const config = require('../config/config');
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const pb2_service = require('../services/pb2service');



exports.getTeamInfo = async (req, res) => {
    try {
        pb2_service.getTeamInfo((err, result) => {
            if (err) {
                console.log(err)
                //wow this is very cool
                //from - pz
                return res.status(500).send('HELP')
            } else {
                return res.status(200).send(result)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

//SETS THE DEADLINE(ADMIN SIDE)
exports.setDeadline = async (req, res) => {
    //smt smt smt 
    var time = "PLEASE PARSE YOUR REQ.PARAM/REQ.BODY TO DATE TIME"
    try {
        pb2_service.setDeadline(time, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).send('HELP')
            } else {
                return res.status(200).send(result)
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