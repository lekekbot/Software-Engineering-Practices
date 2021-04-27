const teamDataManager = require('../services/teamService');
const config = require('../config/config');
exports.processGetDashBoardData = async(req, res, next) => {
    
        return res.status(200).json({ data:'Dashboard data',message: 'Dashboard message' });
   

}; //End of processGetDashBoardData