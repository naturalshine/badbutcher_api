
require('dotenv').config();

const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_SERVER,
  database: process.env.PG_DB,
  password: process.env.PG_PW,
  port: process.env.PG_PORT,
});


/*

export const createMerchant = async(contract, tokenid, imageurl, royaltyowner, royaltypercentage, image ) => {
    console.log("PG!!!! ", process.env.REACT_APP_PG_USER);
    try{
        const results = pool.query('INSERT INTO ' + process.env.REACT_APP_PG_TABLE + ' (contract, tokenid, imageurl, royaltyowner, royaltypercentage, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [contract, tokenid, imageurl, royaltyowner, royaltypercentage, image]);
        console.log(results.rows[0]);
        return results.rows[0];
    } catch (error){
        return error;
    }
}

*/
const getMerchants = () => {
    return new Promise(function(resolve, reject) {
      pool.query('SELECT * FROM ' + process.env.PG_TABLE + ' ORDER BY id ASC', (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
  const createMerchant = (body) => {
    return new Promise(function(resolve, reject) {
      const { name, email } = body
      pool.query('INSERT INTO ' + process.env.PG_TABLE + ' (contract, tokenid, imageurl, royaltyowner, royaltypercentage, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [contract, tokenid, imageurl, royaltyowner, royaltypercentage, image], (error, results) => {
      if (error) {
          reject(error)
        }
        resolve(`A new merchant has been added added: ${results.rows[0]}`)
      })
    })
  }
  const deleteMerchant = () => {
    return new Promise(function(resolve, reject) {
      const id = parseInt(request.params.id)
      pool.query('DELETE FROM ' + process.env.PG_TABLE + ' WHERE id = $1', [id], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Merchant deleted with ID: ${id}`)
      })
    })
  }
  
  module.exports = {
    getMerchants,
    createMerchant,
    deleteMerchant,
  }
  
