const teamInviteListDataManager = require('../services/teamInviteListService');
const config = require('../config/config');
exports.processFindTeamInviteListByEmail = async(req, res, next) => {
    console.log('teamInviteListController - processFindTeamInviteListByEmail running');
    let email = req.email;
    try {
        results = await teamInviteListDataManager.findTeamInviteListByEmail(email);
        return res.status(200).json({ 
            code:200,
            error:false,
            description: 'Team invite list information has been retrieved.', 
            content:results });
    } catch (error) {
        console.log('processFindTeamInviteListByEmail method : the catch block section code has executed');
        console.log(error, '=======================================================================');
        return res.status(500).json({ error:true,code:500,description: error.userMessage, content:[] });
    }
}; //End of processFindTeamInviteListByEmail
   //----------------------------------------------------------------------------------
exports.processSearchTeamInviteList = async(req, res, next) => {
    console.log('teamInviteListController - processSearchTeamInviteList running');
    //This method is used by several REST API call scenarios.
    let teamId = req.query.teamId;
    let email = req.query.email;
    console.log(email);
    if (teamId!=0){
    try {
        results = await teamInviteListDataManager.getAllTeamInviteListByTeamId(teamId);
        console.log(results);

        return res.status(200).json({error:false,
        code:200,
        description: 'An array of latest team member objects searched by using team id', 
        content: results });
    } catch (error) {
        console.log('teamInviteListController - processSearchTeamInviteList method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ operationStatus: 'fail', message: error.userMessage });
    }
    }// If search by team id
    if(email!=null){
        try {
            results = await teamInviteListDataManager.getTeamInviteListByEmail(email);
            return res.status(200).json({ 
                code:200,
                error:false,
                description: 'Team invite list information has been retrieved.', 
                content:results });
        } catch (error) {
            console.log('teamInviteListController - processSearchTeamInviteList method : the catch block section code has executed');
            console.log(error, '=======================================================================');
            return res.status(500).json({ error:true,code:500,description: error.userMessage, content:[] });
        }
    }// If search by email



}; //End of processSearchTeamInviteList

exports.processCreateTeamInviteList = async(req, res, next) => {
    console.log('teamInviteListController - processCreateTeamInviteList running');
    // Collect data from the request body 
    let email = req.body.email;
    // Collect user id which was created inside the req by the middleware function
    let createdById = req.userId;
    let teamId = req.body.teamId;
    // Checking if data inputs have been received successfully. 
    console.log('email :', email, 'teamId :', teamId, 'createById :', createdById);
    
    try {
        results = await teamInviteListDataManager.
            createTeamInviteList(email,teamId,createdById);
        const responseData ={
            code:200,
            error:false,
            description: 'Created the team invite list data',
            content: results
       }
       return res.status(200).send(responseData);
    } catch (error) {
        console.log('processCreateTeamInviteList method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ code:500,error:true,description: error.userMessage, content:[]});
    }


}; // End of processCreateTeamInviteList

exports.processDeleteTeamInviteList = async(req, res, next) => {
    console.log('teamInviteListController - processDeleteTeamInviteList running');
    // Collect record id value from the request params
    let teamInviteListId = req.params.teamInviteListId;
    let teamId = req.params.teamId;
    // The deleteTeamInviteList method needs the teamInviteListId variable value
    // as an input parameter to form the DELETE SQL for deleting the record inside
    // the team_invite_list table
 
    try {
        results = await teamInviteListDataManager.deleteTeamInviteList(teamInviteListId);
        console.log(results);
        return res.status(200).json({ error:false,code:200,
           description: 'Deleted team invite list data' , 
           content:results[0]});
    } catch (error) {
        console.log('processDeleteTeamInviteList method : catch block section code has executed');
        console.log(error, '=======================================================================');
        return res.status(500).json({code:500,error:true,description: error.userMessage,content:[] });
    }
}; // End of processDeleteTeamInviteList