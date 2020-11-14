const database = require('../db');

/**
 * @typedef Freet
 * @prop {number} id - the generated id for the freet
 * @prop {string} content - some string of character shorter than 140
 * @prop {User} creator - user 
 * @prop {number} parentId - if refreet, id of parent freet, null otherwise
 */

/**
 * 
 * @param {Object} row
 * @returns {Freet} 
 */
function mapFreet(row) {
    try {
      let freet = {
        id : row.id, 
        parentId :row.parentId, 
        content :row.content,
        timestamp : row.timestamp
    };
    //map entire row to Freet object with nested User object under 'creator' key
    freet.creator = { id : row.userId, username: row.username };
    return freet;
    } catch (err) {
      return null;
    }
}
/**
 * @class Freets
 * Stores all Freets in SQL database.
 * users table (id, content, userId, parentId)
 */
class Freets {
    /**
     * confirms that userId is the owner of the freetId.
     * @param {number} userId 
     * @param {number} freetId 
     */
    static async authenticate ( userId, freetId ) {
        let db = await database.getDB();
        let freet = await db.get(`SELECT * FROM freets WHERE userId = ? AND id = ?`, [userId, freetId]);
        return Boolean(freet);
    }

    static async exists(id) {
        let db = await database.getDB();
        let freet = await db.get(`SELECT * FROM freets WHERE id = ?`, [id]);
        return (freet) ? true : false;
    } 

    /**
     * Return an array of all of the Freets.
     * @param {number} is - id of Freets
     * @return {Freet[]} - found Freets
     */
    static async getAll() {
        let db = await database.getDB();
        let data = await db.all(`
            SELECT content, freets.id, parentId, freets.timestamp, users.username, userId
            FROM freets
            JOIN users ON users.id=userId 
            ORDER BY freets.timestamp DESC`);
        return data.map(mapFreet);
    }

    /**
     * Return an array of all of the Freets.
     * @return {Freet}
     */
    static async get(id) {
        let db = await database.getDB();
        let data = await db.get(`
            SELECT content, freets.id, parentId, freets.timestamp, users.username, userId
            FROM freets
            JOIN users ON users.id=userId  
            WHERE freets.id = ?`,[id]);
        return mapFreet(data);
    }

    /**
     * Get a Freetd by parentId.
     * @param {number} is - id of Freets
     * @return {Freet[]]} - found Freets
     */
    static async getByParent(id) { 
      let db = await database.getDB();
      let data =  await db.all(`
          SELECT content, freets.id, parentId, freets.timestamp, users.username, userId
          FROM freets 
          JOIN users ON users.id=userId 
          WHERE parentId = ? 
          ORDER BY freets.timestamp DESC`,[id]);
      return data.map(mapFreet);
    }

     /**
     * Get a Freetd by userId.
     * @param {number} userId - id of creator of Freets
     * @return {Freet[]]} - found Freets
     */
    static async getByUser(userId) { 
      let db = await database.getDB();
      let data =  await db.all(`
          SELECT content, freets.id, parentId, freets.timestamp, users.username, userId
          FROM freets 
          JOIN users ON users.id=userId
          WHERE userId = ? 
          ORDER BY freets.timestamp DESC`,[userId]);
      return data.map(mapFreet);
    }

    /**
     * Add a Freet if it contains <= 140 characters
     * @param {number} userId - userId of Freet creator
     * @param {string} content - content of the Freet
     * @param {number} parentId - id of parent freet. If !null, freet is a refreet. 
     * @return {Freet | undefined} - created Freet if it contains <= 140 characters
     *                               or Refreet if not already refreeted
     */
    static async create(userId , content, parentId = null) {
        if ((parentId || content.length) && content.length <= 140) {
            const db = await database.getDB();

            const res = await db.run(`
                INSERT INTO freets (content, userId, parentId, timestamp) 
                VALUES (?, ?, ?, strftime("%s", "now"))`, [content, userId, parentId])
                .catch(() => null);;
   
            db.close();
            return (res && res.changes) ? (this.get(res.lastID)) : null;
        }
    }

    /**
     * delete the specified Freet.
     * @param {number} id - id of Freet to find
     * @return {Freet | null} true if delete occured, false otherwise
     */
    static async delete(id) {
        let db = await database.getDB();
        let freet = await db.get(`SELECT * FROM freets WHERE id = ?`, [id]);
        let res = await db.run('DELETE FROM freets WHERE id = ?', [id]);
        db.close();
        return res.changes ? freet : null;
    }

    /**
     * update the content of the specified Freet.
     * @param {number} id - id of Freet to find
     * @param {string} content - new version of content
     * @return {boolean} true if update occured, false otherwise
     */
    static async update(id, content) {
        let out = null;
        let db = await database.getDB();
        let freet = await db.get(`SELECT * FROM freets WHERE id = ?`, [id]);

        if (freet) {
            let res = await db.run(`UPDATE freets SET content = ? WHERE id = ?`, [content, id]);
            if (Boolean(res)) {
                out =  await db.get(`SELECT content, id, userId, parentId FROM freets WHERE id = ?`, [id]);
            }
        }
        db.close();
        return out;
    }

    static async getLikes(id) {
        let db = await database.getDB();
        return await db.all(`
            SELECT userId AS id, users.username 
            FROM likes 
            JOIN users ON users.id=userId
            WHERE freetId = ?
            ORDER BY id DESC`, [id]);
    }

    static async like(userId, id) {
        let db = await database.getDB();
        let res = await db.run(`INSERT INTO likes (freetId,  userId) VALUES (?, ?)`, [id, userId])
                    .catch(() => null);
        db.close();
        return Boolean(res);
    }

    static async unlike(userId, id) {
        let db = await database.getDB();
        let res = await db.run(`DELETE FROM likes WHERE freetId = ? AND userId = ?`, [id, userId]);
        db.close();
        return Boolean(res.changes);
    }

    /**
     * searches Freet database by a query
     * @param {string} query - search query
     * @return {Freet[]} all users whose username matches query.
     */
    static async search(query) {
      let db = await database.getDB();
      let data = await db.all(`
          SELECT content, freets.id, parentId, freets.timestamp, users.username, userId 
          FROM freets 
          JOIN users ON users.id=userId
          WHERE content LIKE '%${query}%'
          OR users.username LIKE '%${query}%'
          ORDER BY freets.timestamp DESC`);
      return data.map(mapFreet);
    }
}

module.exports = Freets;