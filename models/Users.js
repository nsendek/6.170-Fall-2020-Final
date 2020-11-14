const database = require('../db');

/**
 * @typedef User
 * @prop {number} id - the generated id for the user
 * @prop {string} username - username
 * @prop {string} password - password
 */

/**
 * @typedef Network
 * @prop {User[]} followers - list of followers
 * @prop {User[]} following - list of following
 */

/**
 * @class Users
 * Stores all Users in SQL database
 * users table (id, username, password)
 */
class Users {
    /**
     * Confirm that the (username, password) pair given exists in the database.
     * @param {string} username
     * @param {string} password 
     * @return {User | null} - the authenticated User (minus the password)
     */    
    static async authenticate ( username, password ) {
        let db = await database.getDB();
        let user = await db.get(`
            SELECT username, id 
            FROM users 
            WHERE username = ? AND password = ?`, [username, password]);
        return (user) ? user : null;
    }

    /**
     * @param {String | Number} identifier - username or password
     */
    static async exists(identifier) {
        let db = await database.getDB();
        let user = await db.get(`
          SELECT * FROM users WHERE id = ? OR username = ?`, 
          [identifier, identifier]);
        return (user) ? true : false;
    }

    /**
     * Return an array of all of the Users.
     * @return {User[]}
     */
    static async getAll() {
        let db = await database.getDB();
        let users = await db.all(`SELECT username, id FROM users ORDER BY id DESC`);    
        db.close();
        return users;
    }

    /**
     * return a specific User
     * @return {User}
     */
    static async get(id) {
        let db = await database.getDB();
        return await db.get(`SELECT username, id, timestamp FROM users WHERE id = ?`,[id]);
    }

    /**
     * Add a user.
     * @param {string} username - username
     * @param {string} password - passowrd
     * @return {User | null} - new User (minus the password)
     */
    static async create( username,  password) {
        let db = await database.getDB();
        let res = await db.run(`
            INSERT INTO users (username, password, timestamp) 
            VALUES (?, ?, strftime("%s", "now"))`
            ,[ username, password])
          .catch(err => {});

        let newUser = Boolean(res && res.changes) 
            ? await db.get(`SELECT username, id FROM users WHERE username = ?`, [username]) 
            : null;
        // close db connection once done
        db.close();
        return newUser;
    }

    /**
     * Removes an existing user.
     * @param {number} id - user ID
     * @return {User | null} - deleted User if user deleted else null
     */
    static async delete( id ) {
        let db = await database.getDB();
        let user = await Users.get(id);

        let res = await db.run('DELETE FROM users WHERE id = ?', [id]);
    
        db.close();
        return Boolean(res.changes) ? user : null; 
    }

    /**
     * change username
     * @param {string} oldName - old username
     * @param {string} newName - new username
     * @return {User | null} the altered User (minus password)
     */
    static async changeName(id, newName) {
        let out = null;
        let db = await database.getDB();
        let user = await Users.get(id);

        if (user) {
            let otherUser = await db.get(`SELECT id, username FROM users WHERE username = ?`, [newName]);
            if (otherUser) out = null;
            else {
                let res = await db.run(`UPDATE users SET username = ? WHERE id = ?`, [newName, id]); 
                out =  Boolean(res.changes) ? user : null;
                if (out) out.username = newName;
            }
        }
        db.close();
        return out;
    }

    /**
     * change password
     * @param {string} username - username of user
     * @param {string} newPassword - new password
     * @return {User | null} the altered User (minus password)
     */
    static async changePassword(id, newPassword) {
        let out = null;
        let db = await database.getDB();
        let user = await Users.get(id);
        if (user) {
            let res = await db.run(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, id]); 
            out = Boolean(res.changes) ? user : null;
        }
        db.close();
        return out;
    }

    /**
     * searches User database by username
     * @param {string} query - search query
     * @return {User[]} all users whose username matches query.
     */
    static async search(query) {
      let db = await database.getDB();
      return await db.all(`
        SELECT username, id
        FROM users 
        WHERE username LIKE '%${query}%'
        ORDER BY id DESC`);
    }
}

module.exports = Users;