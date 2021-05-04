//send invite link to person
const config = require('../config/config');
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const pb5_service = require('../services/pb5Service');
const {
    EMAIL_SECRET
} = require('../config/config');

//nodeMailer thing
let transporter = nodeMailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: true,
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS,
    }
})

// send data to temp table 
exports.addNewAdmin = (req, res) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email

    try {
        //add to SQL
        pb5_service.tempUser(first_name, last_name, email, (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    code: 500,
                    error: true,
                    description: 'cannot add shit dude...',
                    content: []
                })
            } else {
                //send invite email
                if (result.affectedRows == 0) {
                    return res.status(204).send(result)
                } else if (result) {
                    jwt.sign({
                            user: result.insertId
                        },
                        config.EMAIL_SECRET, {
                            expiresIn: '1d'
                        },
                        (err, token) => {
                            const url = `http://localhost:3004/admin/confirmation/${token}`

                            transporter.sendMail({
                                to: email,
                                subject: 'Invitation for Admin Privileges',
                                html: `Hi, here is your invitation to becoming an admin. Click <a href="${url}">Here</a> to accept the invite.`
                            })
                        }
                    )
                    res.status(201).send({success: 'success'})

                }
            }
        })
    } catch (err) {
        console.log(err);
    }
}

//verify user, token and shit 
exports.verifyAdmin = (req, res) => {
    let token = req.params.token
    try {
        const id = jwt.verify(token, EMAIL_SECRET)

        pb5_service.getTempData(id.user, (err, result) => {
            if (err) {
                return res.status(500)
            } else {
                if (result.length == 1) {
                    return res.status(200).send(result)
                }
            }
        })
    } catch (err) {
        console.log(err);
        return res.send(500)
    }
}

//push user to user table 
exports.createAdmin = (req, res) => {
    let {
        user_id,
        first_name,
        last_name,
        email,
        password
    } = req.body

    //password hashing
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.log('Error on hashing password')
            return res.status(500).json({
                message: 'Unable to complete registration'
            })
        } else {
            //change accepted to 1 
            pb5_service.alterTempData(user_id, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500)
                }
            })
            //add admin to user table 
            try {
                results = await pb5_service.createAdmin(first_name, last_name, email, hash)
                console.log(results)
                return res.status(200).json({
                    code: 200,
                    error: false,
                    description: 'Invitation Accepted',
                    content: []
                })
            } catch (err) {
                console.log(err);
                return res.status(500).send({
                    code: 500,
                    error: true,
                    content: [],
                    description: 'Unable to complete registration'
                });
            }

        }
    })
}

//for login, cos only master admin can invite 
exports.verifyMasterAdmin = (req, res) => {
    let email = req.params.email

    pb5_service.getId(email, (err, result) => {
        if (err) {
            return res.status(500)
        } else {
            return res.status(200).send(result)
        }
    })
}

//for pending table 
exports.getPendingList = async (req, res) => {
    try {
        let results = await pb5_service.getList()
        return res.status(200).send(results)

    } catch (err) {
        console.log(err)
        return res.status(500)

    }
}

exports.resendEmail = (req, res) => {
    let id = req.body.id
    pb5_service.getTempData(id, (err, result) => {
        if (err) {
            return res.status(500)
        } else {
            const data = result[0]
            jwt.sign({
                    user: data.user_id
                },
                config.EMAIL_SECRET, {
                    expiresIn: '1d'
                },
                (err, token) => {
                    const url = `http://localhost:3004/admin/confirmation/${token}`

                    transporter.sendMail({
                        to: data.email,
                        subject: 'Invitation for Admin Privileges',
                        html: `Hi, here is your invitation to becoming an admin. Click <a href="${url}">Here</a> to accept the invite.`
                    })
                }
            )
            return res.status(200).send(data)
        }
    })
}

exports.checkvalid = (req, res, next) => {
    next()
}

exports.removetemp = async (req, res) => {
    let id = req.params.id
    try {
        let results = await pb5_service.deleteTemp(id)
        console.log(results)
        return res.status(200).send(results)
    } catch (err) {
        return res.status(500)
    }
}

exports.getUserList = async (req, res) => {
    let master_admin = req.params.master
    console.log(master_admin)
    if (master_admin === 'true') {
        try {
            let results = await pb5_service.getusers(true)
            return res.status(200).send(results)
        } catch (err) {
            console.log(err)
            return res.status(500)
        }
    } else {
        try {
            let results = await pb5_service.getusers(false)
            return res.status(200).send(results)
        } catch (err) {
            console.log(err)
            return res.status(500)
        }
    }
}

exports.getdeleteList = async (req, res) => {
    let id = req.params.id
    try {
        let results = await pb5_service.getuserlist(id)
        return res.status(200).send(results)
    } catch (err) {
        console.log(err)
        return res.status(500)
    }
}

exports.deleteUser = async (req, res) => {
    let id = req.params.id
    let data = req.body.data
    for (i = 0; i < data.length; i++) {
        if (data[i].leader == 1) {
            //delete anything related to leader
            let results = await pb5_service.deleteLeadTeam(data[i].team_id, data[i].user_id)
            return res.status(200).send(results)
        } else {
            //delete member role in team member
            let results = await pb5_service.deleteTeamMember(data[i].user_id)
            return res.status(200).send(results)
        }
    }
}

//get pending list 
exports.getPending = async (req, res) => {
    let results = await pb5_service.getPending()
    return res.status(200).send(results)
}