const SQL = require('../db');
const axios = require('axios');

/**
 * @typedef Business
 * @prop {number} id - the generated id for the business
 * @prop {string} name - the name of the business
 * @prop {string} address - the address of the business
 */


 /**
 * @class Businesses
 * Stores all Businesses in SQL database.
 * businesses table (id, name, address)
 */

class Businesses {

  static toString() {return "business";}

  /**
   * Confirm that the (accountName, password) pair given exists in the database.
   * @param {string} accountName
   * @param {string} password 
   * @return {Business | undefined} - the authenticated Business (minus the password)
   */    
  static async authenticate ( accountName, password ) {
    let db = await SQL.getDB();
    let business = await db.get(`
        SELECT id, name 
        FROM businesses 
        WHERE accountName = $1 AND password = $2`, [accountName, password]);
    db.close();
    return business;
  }

  /**
   * Confirm that business exists in the database.
   * @param {string | number} identifier - accountName or ID
   * @returns {boolean} whether the business exists or not
   */
  static async exists(identifier) {
    if (isNaN(identifier)) { // using accountName instead of ID
      let db = await SQL.getDB();
      let out = await db.get(`SELECT * FROM businesses WHERE accountName = $1`,[identifier]);
      db.close();
      return Boolean(out);
    }

    // identifer is ID
    return Boolean(await Businesses.get(identifier));
  }

  /**
   * Return an array of all of the Businesses.
   * @return {Business[]}
   */
  static async getAll() {
    let db = await SQL.getDB();
    let business = await db.all(`SELECT id,name,address,lat,lng FROM businesses ORDER BY id DESC`);
    db.close();
    return business;
  }

  /**
   * return a specific Business
   * @return {Business | undefined}
   */
  static async get(id) {
    let db = await SQL.getDB();
    let out = await db.get(`SELECT id,name,address,lat,lng FROM businesses WHERE id = $1`,[id]);
    db.close();
    return out;
  }

  /**
   * create a business account
   * @param {string} name - front facing name of business
   * @param {string} accountName - backend identifier of businiess  (because names can't be unique) 
   * @param {string} password - password of business account 
   * @return {Business | undefined} - new Business (minus the password)
   */
  static async create(name, accountName, password) {
    let db = await SQL.getDB();

    // insert into business into database.
    let res = await db.run(`
        INSERT INTO businesses (name, accountName, password) 
        VALUES ($1, $2, $3)`
        ,[name, accountName, password])
      .catch(SQL.parseError);

    db.close();

    if (!res.error) return Businesses.get(res.lastID);
  }

  /**
   * Removes an existing business.
   * @param {number} id - business ID
   * @return {Business | null} - deleted Business if business deleted else null
   */
  static async delete( id ) {
    let db = await SQL.getDB();
    let business = await Businesses.get(id);
    
    let res = await db.run('DELETE FROM businesses WHERE id = $1', [id]);

    db.close();
    return res.changes ? business : undefined;
  }

  /**
   * 
   * @param {*} id 
   * @param {*} newAccountName - new account Name 
   * @return {User | null} the altered User (minus password)
   */
  static async updateAccountName(id, newAccountName) {
    let out = null;
    let db = await SQL.getDB();
    let business = await Businesses.get(id);

    if (business) {
        let res = await db.run(`UPDATE businesses SET accountName = $1 WHERE id = $2`, [newAccountName, id]); 
        out =  res.changes ? business : null;
        if (out) out.name = newAccountName;
    }
    db.close();
    return out;
  }

  /**
   * change name
   * @param {number} id - business ID
   * @param {string} newName - new name
   * @return {User | null} the altered User (minus password)
   */
  static async updateName(id, newName) {
    let out = null;
    let db = await SQL.getDB();
    let business = await Businesses.get(id);

    if (business) {
        let res = await db.run(`UPDATE businesses SET name = $1 WHERE id = $2`, [newName, id]); 
        out =  res.changes ? business : null;
        if (out) out.name = newName;
    }
    db.close();
    return out;
  }

  /**
   * change password
   * @param {string} id - id of business
   * @param {string} newPassword - new password
   * @return {Business | null} the altered User (minus password)
   */
  static async updatePassword(id, newPassword) {
    let out = null;
    let db = await SQL.getDB();
    let business = await Businesses.get(id);
    if (business) {
        let res = await db.run(`UPDATE businesses SET password = $1 WHERE id = $2`, [newPassword, id]); 
        out = res.changes ? business : null;
    }
    db.close();
    return out;
  }

  /**
   * change/add address
   * @param {string} id - id of business
   * @param {string} address 
   */
  static async updateAddress(id, address) {
    let db = await SQL.getDB();
    let out = {address, lat : 0, lng : 0}

    // do geocoding of address to lat long
    let data = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", { 
      params : { 
          address : address,
          key : "AIzaSyDKOlyw5FKzfofKtyQ5jfKFuleqelf1nhQ"
        }
    })
      .then(data => data.data)
      .catch(err => err.response ? err.response : err);

    if (!data.results || !data.results[0]) return undefined;
    
    out.address = data.results[0].formatted_address;
    out.lat = data.results[0].geometry.location.lat;
    out.lng = data.results[0].geometry.location.lng;

    let res = await db.run(`UPDATE businesses 
      SET address = $1, lat = $2, lng = $3 
      WHERE id = $4`, [out.address, out.lat, out.lng, id])
      .catch(SQL.parseError);

    db.close();

    if (!res.error) return Businesses.get(id);
  }
}

module.exports = Object.freeze(Businesses);