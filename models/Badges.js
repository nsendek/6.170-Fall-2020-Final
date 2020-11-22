const SQL = require('../db/index');


/**
 * create a blank array of input values for purposes of SQLite and postgres
 * 
 * SQList(1) => ($1)
 * SQList(3) => ($1, $2, $3)
 * SQList(n) => ($1, $2, $3 .... $n)
 * 
 * @param {number} size - expected size of SQL List
 */
function SQList(size) {
  let out = "(";
  for (x = 1 ; x <= size ; x++) {
    out += x != size ? `$${x}, ` : `$${x}`
  }
  out += ")";
  return out;
}


/**
 * @typedef Badges
 * @prop {string} label - the name of the badge
 * @prop {string} businessID - the business with the badge
 */

/**
 * @class Badges
 * Stores all Badge -> Business mappings in SQL database.
 * badges table (label, businessid)
 */
 class Badges {

    /**
     * functions for dataExists in validators.js, 
     * comfirms that badge template exists before seaarching based on a badge template
     */
    static toString() {return "badge";}
    static async exists(label) {
      let db = await SQL.getDB();
      let out =  await db.get(`SELECT label, description FROM badge_templates WHERE label = $1`,[label]);
      db.close();
      return Boolean(out);
    }

    /**
     * 
     * @param {number} businessId - id of the business
     * @param {number} id - id of the badge
     * 
     * @returns {boolean} true if business is associated with the ID; false otherwise
     */
    static async authenticate(businessId,id) {
      let db = await SQL.getDB();
      let badge = await db.get(`SELECT * FROM badges WHERE businessId = $1 AND id = $2`, [businessId, id]);
      return Boolean(badge);
    }

    /**
     * get a specific badge 
     * @param {string} label - label of badge template 
     * @returns {Badge | undefined}
     */
    static async get(id) {
      let db = await SQL.getDB();
      let out =  await db.get(`SELECT id,label,businessId FROM badges WHERE id = $1`,[id]);
      db.close();
      return out;
    }

    /**
     * Get all badges types stored in DB
     */
    static async getAll() {
        let db = await SQL.getDB()
        let res = await db.all('SELECT * FROM badge_templates');
        db.close();
        return res;
    }

    /** 
     * Get all badges associated with a business
     * @param {Number} businessId - the id of the business
     * @return {Badge[]} - a list of badges
     */
    static async getBusinessBadges(businessId) {
        let db = await SQL.getDB();
        let res = await db.all(`SELECT id, label FROM badges WHERE businessId = ${businessId}`);
        db.close();
        return res;
    }

    /**
     * Get all businesses associated with a badge
     * @param {String[]} labels - list of badge labels
     * @returns {Business []} - the businesses who have all the specified badges
    */
    static async filterBusinessByBadges(labels = []) {
        let db = await SQL.getDB();

        // you can combine two sql commands into one with JOIN, so you can query based on info from two tables
        let out = await db.all(`
            SELECT businesses.id, name, address
            FROM businesses 
            INNER JOIN badges ON badges.businessId = businesses.id AND badges.label IN ${SQList(labels.length)}
            GROUP BY businesses.id
            HAVING COUNT(label) = ${labels.length}`,
            [...labels])
        .catch(SQL.parseError);
      
        db.close();
        return out;
    }

  /**
   * creates an instance of the given badge and
   * @param {number} businessId - id of business adding badge
   * @param {string} label - the label of the specified badge type
   * @param {Badge | undefined} label 
   */
  static async add(businessId, label) {
    let db = await SQL.getDB();
    let res = await db.run(`
        INSERT INTO badges(businessId, label) 
        VALUES ($1, $2)`,
        [businessId, label])
      .catch(SQL.parseError);

    db.close();
    if (res.error) return undefined; 
    else return Badges.get(res.lastID);
  }

  /**
   * 
   * @param {number} badgeId - id of badge
   */
  static async remove(badgeId) {
    let db = await SQL.getDB();
    let badge = await Badges.get(badgeId);
    let res = await db.run('DELETE FROM badges WHERE id = $1', [badgeId]);
    db.close();
    return  Boolean(res.changes) ? badge : undefined;
  }

  /**
   * affirm a specified badge
   * @param {number} userId
   * @param {number} badgeId
   */
  static async affirm(userId, badgeId) {
    let db = await SQL.getDB();
    let res = await db.run(`
      INSERT INTO badge_reacts (userId,badgeId, value) 
      VALUES ($1, $2, 1)`,
      [userId, badgeId]).catch(SQL.parseError);
    db.close();
    return Boolean(res.changes);
  }

  /**
   * deny a specfied badge
   * @param {number} userId
   * @param {number} badgeId
   */
  static async deny(userId, badgeId) {
    let db = await SQL.getDB();
    let res = await db.run(`
      INSERT INTO badge_reacts (userId,badgeId, value) 
      VALUES ($1, $2, -1)`,
      [userId, badgeId]).catch(SQL.parseError);
    db.close();
    return Boolean(res.changes);
  }
}

 module.exports = Badges;