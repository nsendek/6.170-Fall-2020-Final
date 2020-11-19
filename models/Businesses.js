const SQL = require('../db');

/**
 * @typedef Business
 * @prop {number} id - the generated id for the freet
 * @prop {string} name - some string of character shorter than 140
 * @prop {string} address - some string of character shorter than 140
 */


 /**
 * @class Businesses
 * Stores all Businesses in SQL database.
 * businesses table (id, name, address)
 */

class Businesses {

  static toString() {return "business";}

  /**
   * Confirm that the (is, password) pair given exists in the database.
   * @param {Number} id
   * @param {string} password 
   * @return {Business | undefined} - the authenticated Business (minus the password)
   */    
  static async authenticate ( id, password ) {
    let db = await SQL.getDB();
    let business = await db.get(`
        SELECT id, name 
        FROM businesses 
        WHERE id = $1 AND password = $2`, [id, password]);
    db.close();
    return business;
  }

  /**
   * Confirm that business exists in the database.
   * @param {number} id 
   * @returns {boolean} whether the business exists or not
   */
  static async exists(id) {
    return Boolean(await Businesses.get(id));
  }

  /**
   * Return an array of all of the Businesses.
   * @return {Business[]}
   */
  static async getAll() {
    let db = await SQL.getDB();
    let business = await db.all(`SELECT id,name FROM businesses ORDER BY id DESC`);    
    db.close();
    return business;
  }

  /**
   * return a specific Business
   * @return {Business | undefined}
   */
  static async get(id) {
    let db = await SQL.getDB();
    let out = await db.get(`SELECT id, name, address FROM businesses WHERE id = $1`,[id]);
    db.close();
    return out;
  }

  /**
   * Add a business.
   * @param {string} name 
   * @param {string} address
   * @param {string} password 
   * @return {Business | undefined} - new Business (minus the password)
   */
  static async create(name, address,  password) {
    let db = await SQL.getDB();
    let res = await db.run(`
        INSERT INTO businesses (name, address, password) 
        VALUES ($1, $2, $3)`
        ,[name, address,  password])
      .catch(SQL.parseError);
    db.close();

    if (res.error) return undefined;
    else return Businesses.get(res.lastID)
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
    return Boolean(res.changes) ? business : null; 
  }

    /**
   * change name
   * @param {string} oldName - old name
   * @param {string} newName - new name
   * @return {User | null} the altered User (minus password)
   */
  static async changeName(id, newName) {
    let out = null;
    let db = await SQL.getDB();
    let business = await Businesses.get(id);

    if (business) {
        let res = await db.run(`UPDATE businesses SET name = $1 WHERE id = $2`, [newName, id]); 
        out =  Boolean(res.changes) ? business : null;
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
  static async changePassword(id, newPassword) {
    let out = null;
    let db = await SQL.getDB();
    let business = await Businesses.get(id);
    if (business) {
        let res = await db.run(`UPDATE businesses SET password = $1 WHERE id = $2`, [newPassword, id]); 
        out = Boolean(res.changes) ? business : null;
    }
    db.close();
    return out;
  }

}

module.exports = Businesses;