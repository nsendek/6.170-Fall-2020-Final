const database = require('../db');

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
  /**
   * Confirm that the (is, password) pair given exists in the database.
   * @param {Number} id
   * @param {string} password 
   * @return {Business | null} - the authenticated Business (minus the password)
   */    
  static async authenticate ( id, password ) {
    let db = await database.getDB();
    let business = await db.get(`
        SELECT id, name 
        FROM businesses 
        WHERE id = ? AND password = ?`, [id, password]);
    return (business) ? business : null;
  }

  /**
   * Confirm that business exists in the database.
   * @param {Number} id 
   */
  static async exists(id) {
    let db = await database.getDB();
    let business = await db.get(`
      SELECT * FROM businesses WHERE id = ?`, 
      [id]);
    return (business) ? true : false;
  }

  /**
   * Return an array of all of the Businesses.
   * @return {Business[]}
   */
  static async getAll() {
    let db = await database.getDB();
    let business = await db.all(`SELECT id,name FROM businesses ORDER BY id DESC`);    
    db.close();
    return business;
  }

  /**
   * return a specific Business
   * @return {Business}
   */
  static async get(id) {
    let db = await database.getDB();
    return await db.get(`SELECT id, name, address FROM businesses WHERE id = ?`,[id]);
  }

  /**
   * Add a business.
   * @param {string} name 
   * @param {string} address
   * @param {string} password 
   * @return {Business | null} - new Business (minus the password)
   */
  static async create(name, address,  password) {
    let db = await database.getDB();
    let res = await db.run(`
        INSERT INTO businesses (name, address, password) 
        VALUES (?, ?, ?)`
        ,[name, address,  password])
      .catch(err => {});

    console.log("RES",res);

    let newBusiness = Boolean(res && res.changes) 
        ? await Businesses.get(res.lastID)
        : null;

    // close db connection once done
    db.close();
    return newBusiness;
  }

  /**
   * Removes an existing business.
   * @param {number} id - business ID
   * @return {Business | null} - deleted Business if business deleted else null
   */
  static async delete( id ) {
    let db = await database.getDB();
    let business = await Businesses.get(id);
    
    let res = await db.run('DELETE FROM businesses WHERE id = ?', [id]);

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
    let db = await database.getDB();
    let business = await Businesses.get(id);

    if (business) {
        let res = await db.run(`UPDATE businesses SET name = ? WHERE id = ?`, [newName, id]); 
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
    let db = await database.getDB();
    let business = await Businesses.get(id);
    if (business) {
        let res = await db.run(`UPDATE businesses SET password = ? WHERE id = ?`, [newPassword, id]); 
        out = Boolean(res.changes) ? business : null;
    }
    db.close();
    return out;
  }
}

module.exports = Businesses;