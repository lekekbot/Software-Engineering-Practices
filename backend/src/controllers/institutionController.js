const institutionDataManager = require('../services/institutionService');
const config = require('../config/config');
exports.processGetAllInstitutions = async(req, res, next) => {
    console.log('processGetAllInstitutions running.');
  
    try {
        results = await institutionDataManager.getAllInstitutions();
        return res.status(200).send({ message: 'Retrieved institution data.', data: results });
    } catch (error) {
        console.log('processGetAllInstitutions method : catch block section code is running.');
        console.log(error, '=======================================================================');
        return res.status(500).send({ message: 'Unable to complete intitution data retrieval.' });
    }


}; //End of processGetAllInstitutions


