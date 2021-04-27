const config = require('../config/config');
const pool = require('../config/database')
module.exports.getAllInstitutions = () => {
       
        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log('Database connection error ', err);
                    resolve(err);
                } else {
                    connection.query('SELECT institution_id institutionId , name FROM Institution ', [], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of getAllInstitutions

