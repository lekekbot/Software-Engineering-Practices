//Task 04 - Extracts the user params via the params. Afterwards, uses mailguns as well as sendgrid to send a email to the user
//Success Response
//Code: 204 No Content
//METHOD : POST -> http://localhost:8081/u/users/resetpassword/:userEmail
exports.processUserEmailOTP = async (req, res, next) => {
    console.log('The processUserEmailOTP running');

    const userEmail = req.params.userEmail;

    try {
        await sleep(7000);
        let oneResult = await auth.getOneUserStatusData(userEmail);
        return res.status(200).send({
            error: false, code: 200, description: 'One user object',
            content: oneResult
        });
    } catch (error) {
        console.log('The processGetOneUserStatusData method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).send({ error: true, code: 500, description: 'Internal technical problem has occurred.', content: [] });
    }

}; // End of processGetOneUserStatusData