// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/testUserController');
const teamController = require('./controllers/teamController');
const commonController = require('./controllers/commonController');
const institutionController = require('./controllers/institutionController');
const checkUserFn = require('./middlewares/checkUserFn');
const teamInviteListController = require('./controllers/teamInviteListController');
const proposalController = require('./controllers/proposalController');
// Match URL's with controllers

//problem 5 controllers
const pb4 = require('./controllers/pb4')
const pb5 = require('./controllers/pb5')

exports.appRoute = router => {
    // Called by the client normal user role app to logon to the system
    router.post('/api/u/users/signin', authController.processUserLogin);
    // Called by the client normal user role app to register to the system
    router.post('/api/users/register', authController.processRegister);
    // Called to process verification
    router.post('/api/users/confirmation/:token', authController.processConfirmation);
    // Called by the client normal user role app at the user status page.
    router.get('/api/u/users/status/:userEmail', authController.processGetOneUserStatusData);
    // Called by the client admin role app to update approve status for registered users.
    router.put('/api/users/', userController.processUpdateOneUser);

    router.get('/api/users/:recordId', userController.processGetOneUserData);


    router.post('/api/u/teams', checkUserFn.checkForValidUserRoleUser, teamController.processAddOneTeam);
    router.put('/api/u/teams', checkUserFn.checkForValidUserRoleUser, teamController.processUpdateOneTeam);

    router.get('/api/dashboard', checkUserFn.checkForValidUserRoleUser, commonController.processGetDashBoardData);
    router.get('/api/institutions', institutionController.processGetAllInstitutions);
    router.get('/api/a/users', userController.processGetAllUserDataForAdmin);
    router.post('/api/a/users/adminsignin', authController.processAdminLogin);
    router.put('/api/a/users', userController.processUpdateUsersOnRoleAndStatus);

    //This REST API obtains all the team records by the team member Id information
    //The team member Id information is obtained from the decoded token.
    router.get('/api/u/teams', checkUserFn.checkForValidUserRoleUser, teamController.processGetAllTeamsByMemberId);

    router.get('/api/u/teams/:teamId', checkUserFn.checkForValidUserRoleUser, teamController.processGetOneTeamData);
    router.delete('/api/u/team/delete/:teamId', checkUserFn.checkForValidUserRoleUser, teamController.processDeleteOneTeam);

    router.get('/api/u/teaminvitelist/', checkUserFn.checkForValidUserRoleUser, teamInviteListController.processSearchTeamInviteList);
    router.delete('/api/u/teaminvitelist/:teamInviteListId', checkUserFn.checkForValidUserRoleUser, teamInviteListController.processDeleteTeamInviteList);
    router.post('/api/u/teaminvitelist/', checkUserFn.checkForValidUserRoleUser, teamInviteListController.processCreateTeamInviteList);

    //Naming convention of REST API is debateable for parent-child resource.
    //Key principle is whatever decision made, it must be consistent.
    router.get('/api/u/teams/:teamId/teammembers/', checkUserFn.checkForValidUserRoleUser, teamController.processGetAllTeamMembersByTeamId);
    router.post('/api/u/teams/:teamId/teammembers/', checkUserFn.checkForValidUserRoleUser, teamController.processCreateTeamMember);
    router.delete('/api/u/teams/:teamId/teammembers/:teamMemberId', checkUserFn.checkForValidUserRoleUser, teamController.processDeleteTeamMember);

    router.post('/api/u/teams/:teamId/proposals/', proposalController.processCreateProposal);
    router.get('/api/u/teams/:teamId/proposals/', proposalController.processGetProposalsByTeamId);
    //The delete REST API needs an object which is passed through the body.
    //The object contains the db table's fileId and the cloudinary file id.
    router.delete('/api/u/proposals/', proposalController.processDeleteOneProposal);

    router.get('/api/a/teams/summary', teamController.processGetAllTeams);

    //PROBLEM 4 - CHAI PIN ZHENG
    //Sends an email to the user using mailgun in order to send them a OTP
    router.post('/api/u/users/resetpassword/:userEmail', pb4.sendEmail);
    //Verifies what the user otp + their corresponding emails
    router.get('/api/u/users/validate_2fa/', pb4.verifyUserOTP);

    //Problem 5 routes - Bryan
    //add new admin to temp table
    router.post('/api/a/addadmin', pb5.addNewAdmin)
    //confirmation when user clicks invite in email
    router.get('/api/a/confirmation/:token', pb5.verifyAdmin)
    //create admin row to user table
    router.post('/api/a/admin/createAdmin', pb5.createAdmin)
    //get masteradmin/admin role 
    router.get('/api/a/admin/adminid/:email', pb5.verifyMasterAdmin)
    //get pending list from temp table
    router.get('/api/a/admin/list', pb5.getPendingList)
    //get email from temp data, then send invitation to email
    router.post('/api/a/admin/resend', pb5.resendEmail)
    //delete temp user
    router.delete('/api/a/admin/removetemp/:id', pb5.checkvalid, pb5.removetemp)
};