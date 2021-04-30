//send invite link to person
const config = require('../config/config');
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


//import stuff i actually don't use 
const create_temp = require('../services/createTempAdmin');
const {
    EMAIL_SECRET
} = require('../config/config');

let transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS,
    }
})


exports.addNewAdmin = (req, res) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email

    try {
        //add to SQL
        create_temp.tempUser(first_name, last_name, email, (error, result) => {
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
                if (result) {
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

        create_temp.getTempData(id.user, (err, result) => {
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

exports.createAdmin = (req, res) => {

    let { user_id, first_name, last_name, email, password } = req.body

    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.log('Error on hashing password')
            return res.status(500).json({
                message: 'Unable to complete registration'
            })
        } else {
            create_temp.alterTempData(user_id, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500)
                }
            })
            try {
                results = await create_temp.createAdmin(first_name, last_name, email, hash)
                console.log(results)
                return res.status(200).json({
                    code: 200,
                    error: false,
                    description: 'Invitation Accepted',
                    content: []
                })
            }catch(err) {
                console.log(err);
                return res.status(500).send({code:500, error:true, content:[],
                    description: 'Unable to complete registration' });
            }

        }
    })
}

exports.verifyMasterAdmin = (req,res) => {
    let email = req.params.email

    create_temp.getId(email, (err,result) => {
        if(err) {
            return res.status(500)
        }else {
            return res.status(200).send(result)
        }
    })
}