// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const teamController = require('./controllers/teamController');
const commonController = require('./controllers/commonController');
const institutionController = require('./controllers/institutionController');
const checkUserFn = require('./middlewares/checkUserFn');
const teamInviteListController=require('./controllers/teamInviteListController');
const proposalController=require('./controllers/proposalController');
// Match URL's with controllers
exports.appRoute = router => {
    // Called by the client normal user role app to logon to the system
    router.post('/api/u/users/signin', authController.processUserLogin);
    // Called by the client normal user role app to register to the system
    router.post('/api/users/register', authController.processRegister);
    // Called by the client normal user role app at the user status page.
    router.get('/api/u/users/status/:userEmail', authController.processGetOneUserStatusData);


    // Called by the client admin role app to update approve status for registered users.
    router.put('/api/users/', userController.processUpdateOneUser);
  

    
    router.get('/api/users/:recordId', userController.processGetOneUserData);


    router.post('/api/u/teams', checkUserFn.checkForValidUserRoleUser, teamController.processAddOneTeam);
    router.put('/api/u/teams', checkUserFn.checkForValidUserRoleUser, teamController.processUpdateOneTeam);

    router.get('/api/dashboard', checkUserFn.checkForValidUserRoleUser,commonController.processGetDashBoardData);
    router.get('/api/institutions',institutionController.processGetAllInstitutions);
    router.get('/api/a/users',userController.processGetAllUserDataForAdmin);
    router.post('/api/a/users/adminsignin', authController.processAdminLogin);
    router.put('/api/a/users', userController.processUpdateUsersOnRoleAndStatus);

    //This REST API obtains all the team records by the team member Id information
    //The team member Id information is obtained from the decoded token.
    router.get('/api/u/teams', checkUserFn.checkForValidUserRoleUser,teamController.processGetAllTeamsByMemberId);
    
    router.get('/api/u/teams/:teamId', checkUserFn.checkForValidUserRoleUser,teamController.processGetOneTeamData);
    router.delete('/api/u/team/delete/:teamId', checkUserFn.checkForValidUserRoleUser,teamController.processDeleteOneTeam);

    router.get('/api/u/teaminvitelist/', checkUserFn.checkForValidUserRoleUser,teamInviteListController.processSearchTeamInviteList);
    router.delete('/api/u/teaminvitelist/:teamInviteListId', checkUserFn.checkForValidUserRoleUser,teamInviteListController.processDeleteTeamInviteList);
    router.post('/api/u/teaminvitelist/', checkUserFn.checkForValidUserRoleUser,teamInviteListController.processCreateTeamInviteList);

    //Naming convention of REST API is debateable for parent-child resource.
    //Key principle is whatever decision made, it must be consistent.
    router.get('/api/u/teams/:teamId/teammembers/', checkUserFn.checkForValidUserRoleUser,teamController.processGetAllTeamMembersByTeamId);
    router.post('/api/u/teams/:teamId/teammembers/', checkUserFn.checkForValidUserRoleUser,teamController.processCreateTeamMember);
    router.delete('/api/u/teams/:teamId/teammembers/:teamMemberId', checkUserFn.checkForValidUserRoleUser,teamController.processDeleteTeamMember);
    
    router.post('/api/u/teams/:teamId/proposals/', proposalController.processCreateProposal);
    router.get('/api/u/teams/:teamId/proposals/', proposalController.processGetProposalsByTeamId);
    //The delete REST API needs an object which is passed through the body.
    //The object contains the db table's fileId and the cloudinary file id.
    router.delete('/api/u/proposals/', proposalController.processDeleteOneProposal);

    router.get('/api/a/teams/summary', teamController.processGetAllTeams);
   

};