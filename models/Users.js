const SQL = require('../db');

/**
 * @typedef User
 * @prop {number} id - the generated id for the user
 * @prop {string} username - username
 * @prop {string} password - password
 */

/**
 * @class Users
 * Stores all Users in SQL database
 * users table (id, username, password)
 */
class Users {

  static toString() {return "user";}

  /**
   * Confirm that the (username, password) pair given exists in the database.
   * @param {string} username
   * @param {string} password 
   * @return {User | undefined} - the authenticated User (minus the password)
   */    
  static async authenticate ( username, password ) {
      let db = await SQL.getDB();
      let user = await db.get(`
          SELECT username, id
          FROM users 
          WHERE username = $1 AND password = $2`, [username, password]);
      db.close();
      return user;
  }

  /**
   * @param {number} id - id of user
   */
  static async exists(id) {
      return (Boolean(await Users.get(id)));
  }

  /**
   * Return an array of all of the Users.
   * @return {User[]}
   */
  static async getAll() {
      let db = await SQL.getDB();
      let users = await db.all(`SELECT username, id FROM users ORDER BY id DESC`);    
      db.close();
      return users;
  }

  /**
   * return a specific User
   * @return {User | undefined}
   */
  static async get(id) {
      let db = await SQL.getDB();
      let user = await db.get(`SELECT username, id FROM users WHERE id = $1`,[id]);
      db.close();
      return user;
  }

  /**
   * Add a user.
   * @param {string} username - username
   * @param {string} password - passowrd
   * @return {User | undefined} - new User (minus the password)
   */
  static async create( username,  password) {
      let db = await SQL.getDB();
      let res = await db.run(`
          INSERT INTO users (username, password) 
          VALUES ($1, $2)`
          ,[username, password])
        .catch(SQL.parseError);

      db.close();
      if (!res.error) return Users.get(res.lastID);
  }

  /**
   * Removes an existing user.
   * @param {number} id - user ID
   * @return {User | undefined} - deleted User if user deleted else undefined
   */
  static async delete( id ) {
      let db = await SQL.getDB();
      let user = await Users.get(id); // get before deleting
      let res = await db.run('DELETE FROM users WHERE id = $1', [id]);
      db.close();
      return res.changes ? user : undefined;
  }

  /**
   * change username
   * @param {string} oldName - old username
   * @param {string} newName - new username
   * @return {User | undefined} the altered User (minus password)
   */
  static async changeName(id, newName) {
      let db = await SQL.getDB();

      let res = await db.run(`
        UPDATE users 
        SET username = $1 
        WHERE id = $2`, 
        [newName, id])
        .catch(SQL.parseError); 

      db.close();

      if (!res.error) return Users.get(id);
  }

  /**
   * change password
   * @param {string} id - id of user
   * @param {string} newPassword - new password
   * @return {User | undefined} the altered User (minus password)
   */
  static async changePassword(id, newPassword) {
      let db = await SQL.getDB();

      let res = await db.run(`
          UPDATE users SET password = $1 WHERE id = $2`, 
          [newPassword, id]); 

      db.close();

      if (!res.error) return Users.get(id);
  }

  /**
   * get rankings of badges belonging to specified user
   * @param {number} id - id of user
   * @param {string} newPassword - new password
   * @return {string[]} the rankings
   */
  static async getRanks(id) {
    let db = await SQL.getDB();
    let res = await db.all(`SELECT * FROM user_ranks WHERE userId = $1`,[id]);
    db.close();
    return res;
  }

  /**
   * change persosnal rankings of badges
   * @param {number} id - id of user
   * @param {string[]} badges - badges (ordered is desc priority)
   * @return {string[] | undefined} the altered rankings
   */
  static async postRanks(id,badges) {

  }
}

module.exports = Object.freeze(Users);