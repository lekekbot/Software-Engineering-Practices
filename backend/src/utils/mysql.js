//Reference:https://medium.com/wenchin-rolls-around/example-of-using-transactions-with-async-await-via-mysql-connection-pool-9a37092f226f
//I did not use this technique in all the data service files.
const mysql = require("mysql");
require("dotenv").config();
let dbConfig = {
  connectionLimit: 10, // default 10
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME
};
const pool = mysql.createPool(dbConfig);
const connection = () => {
  return new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) reject(err);
    console.log("MySQL pool connected: threadId " + connection.threadId);
    const query = (sql, binding) => {
      return new Promise((resolve, reject) => {
         connection.query(sql, binding, (err, result) => {
           if (err) reject(err);
           resolve(result);
           });
         });
       };
       const release = () => {
         return new Promise((resolve, reject) => {
           if (err) reject(err);
           console.log("MySQL pool released: threadId " + connection.threadId);
           resolve(connection.release());
         });
       };
       resolve({ query, release });
     });
   });
 };
const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
module.exports = { pool, connection, query };