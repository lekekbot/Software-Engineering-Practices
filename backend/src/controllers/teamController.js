const teamDataManager = require('../services/teamService');
const fileDataManager = require('../services/fileService');
const config = require('../config/config');
exports.processAddOneTeam = async(req, res, next) => {
    console.log('processAddOneTeam running');
    // Collect data from the request body 
    let teamName = req.body.name;
    // Collect user id which was created inside the req by the middleware function
    let createdById = req.userId;
    
    
    let leaderId = req.userId; //By default the new team's leader is the person who creates it.
    try {
        results = await teamDataManager.createTeam(teamName,leaderId,createdById);
        return res.status(200).json({ message: 'Team has created.' });
    } catch (error) {
        console.log('processAddOneTeam method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ message: error.userMessage });
    }


}; //End of processAddOneTeam

exports.processGetOneTeamData = async(req, res, next) => {
    console.log('processGetOneTeamData running');


    let teamId = req.params.teamId; 
    console.log(req.params.teamId);
   
    try {
        results = await teamDataManager.getOneTeamData(teamId);
        return res.status(200).json({ message: 'Team information has been retrieved.', 
       data:results });
    } catch (error) {
        console.log('processGetOneTeamData method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ message: error.userMessage });
    }


}; // End of processGetOneTeamData

exports.processGetAllTeamsByMemberId = async(req, res, next) => {
    console.log('processGetAllTeamsByMemberId running');

    // Collect user id which was created inside the req by the middleware function
    let userId = req.userId;
     
    
   
    try {
        results = await teamDataManager.getAllTeamsByMemberId(userId);
        console.log('Inspect results variable after calling getAllTeamsByMemberId')
        console.log(results);
        const formattedResults = results[0].map(function(row) {

            // This function defines the "mapping behaviour". 
            // the first_name and last_name are concatenated and mapped to 
            // the corresponding new property, displayName. team_member_id is mapped
            // to the corresponding new property memberId.
         
            return { 
             id : row.team_id,
             name : row.name,
             memberType : row.leader?'Team leader':'Member',
             numOfMembers : row.numOfMembers
             }
             
         })
        return res.status(200).send({ error:false,
            code:200,
            description: 'Team information has been retrieved.', 
            content:formattedResults });
    } catch (error) {
        console.log('processGetAllTeamsByMemberId method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).send({ error:true,
            code:500,
            description: error.description, 
       content:[] });
    }


}; //End of processGetAllTeamsByMemberId


exports.processGetAllTeams = async(req, res, next) => {
    //One step closer to comply with the Swagger standards.
    console.log('processGetAllTeams running');

    try {
        results = await teamDataManager.getAllTeams();
        //Inspect the results variable
        console.log(results);
        const responseData =  {
            status: '200',
            description: 'Success. An array of team details data.',
            content: results[0].map(function(row) {
                return { 
                id : row.team_id,
                name : row.name,
                numberOfMembers : row.number_of_members,
                numberOfSubmissions : row.number_of_submissions
             }
            })
        };
        return res.status(200).send(responseData);
    } catch (error) {
        console.log('processGetAllTeams method : execution of the catch block section code.');
        console.log(error, '=======================================================================');
        return res.status(500).send({ error: false, code:'500',description: 'Internal error.', content:[]});
    }


}; //End of processGetAllTeams



exports.processUpdateOneTeam = async(req, res, next) => {
    console.log('processUpdateOneTeam running');
    // Collect data from the request body 
    let teamName = req.body.name;
    // Collect user id which was created inside the req by the middleware function
    let teamId = req.body.id;
    
    
    
    try {
        results = await teamDataManager.updateTeam(teamName,teamId);
        return res.status(200).json({ message: 'Team information has been changed.' });
    } catch (error) {
        console.log('processUpdateOneTeam method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete update team operation' });
    }

    
}; //End of processUpdateOneTeam

exports.processDeleteOneTeam = async(req, res, next) => {
    console.log('processDeleteOneTeam running');
    // Collect data from the request body 
    let teamId = req.params.teamId;
    try {
        results = await teamDataManager.deleteTeam(teamId);
        return res.status(200).json({ message: 'Team has been deleted.' });
    } catch (error) {
        console.log('processDeleteOneTeam method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete delete team operation' });
    }
}; // End of processDeleteOneTeam



//------------------------------ Team members related operations ----------------------
exports.processGetAllTeamMembersByTeamId = async(req, res, next) => {
    console.log('processGetAllTeamMembersByTeamId running');
    // Obtain the teamId
    let teamId = req.params.teamId;
    try {
        results = await teamDataManager.getAllTeamMembersByTeamId(teamId);
        const formattedResults = results.map(function(row) {

            // This function defines the "mapping behaviour". 
            // the first_name and last_name are concatenated and mapped to 
            // the corresponding new property, displayName. team_member_id is mapped
            // to the corresponding new property memberId.
            // Note that, I did not include the user id of the user inside this JSON
            return { 
             teamMemberId : row.team_member_id,
             displayName : row.first_name + ' ' + row.last_name,
             teamId : row.team_id,
             teamName : row.name,
             email : row.email,
             type : row.leader?'Team leader':'' }
         })
        return res.status(200).send(
            { error:false,code:200,description: 'Team member information has been retrieved.', 
       content:formattedResults });
    } catch (error) {
        console.log('processGetAllTeamMembersByTeamId method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json( { error:true,code:500,description: 'Team member data retrieval operation has failed.', 
        content:formattedResults });
    }
}; //End of processGetAllTeamMembersByTeamId
exports.processCreateTeamMember = async(req, res, next) => {
    console.log('processCreateTeamMember running');
    // Collect user id from req which is created by our MiddleWare
    let userId = req.userId
    // Collect team id 
    let teamId = req.params.teamId;
    
    
    
    try {
        results = await teamDataManager.createTeamMember(userId,teamId);
        console.log(results);
        return res.status(200).send({ message: 'You have joined the team.' });
    } catch (error) {
        console.log('teamController - processCreateTeamMember method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).send({ message: 'Unable to complete create team member operation' });
    }

    
}; // End of processCreateTeamMember

exports.processDeleteTeamMember = async(req, res, next) => {
    console.log('processDeleteTeamMember running');

    // Collect team member id (This is the unique value associated to each team_member table record)
    let teamMemberId = req.params.teamMemberId;
    
    try {
        results = await teamDataManager.deleteTeamMember(teamMemberId);
        console.log(results);
        return res.status(200).send({ error:false,content:[],description: 'You have removed the team member from the team.' });
    } catch (error) {
        console.log('processDeleteTeamMember method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).send({ error:true,
            code:500,description: 'Unable to complete delete team member operation',
            content:[]
         });
    }

    
}; // End of processDeleteTeamMember


