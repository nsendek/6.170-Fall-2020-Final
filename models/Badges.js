const SQL = require('../db/index');
// const Businesses = require('./Businesses');

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
    static async filterBusinessByBadges(labels = [], page) {
        let db = await SQL.getDB();

        // you can combine two sql commands into one with JOIN, so you can query based on info from two tables
        // GROUP BY creates 'groups' of rows with the same businessId 
        // COUNT(label) applies to those groups not the whole table

        let filterQuery = `
          SELECT businesses.id, name, address, businesses.lat, businesses.lng
          FROM businesses 
          INNER JOIN badges ON badges.businessId = businesses.id AND badges.label IN ${SQL.list(labels.length)}
          GROUP BY businesses.id
          HAVING COUNT(label) = ${labels.length}`; 

        let pageLength = 10;
        let numRows = await db.get(`SELECT COUNT(*) FROM ( ${filterQuery} )`, [...labels]);
        numRows = numRows["COUNT(*)"];
        let totalPages = Math.ceil(numRows / pageLength); 
        if(page <= 0){
          page = 1;
        }
        if(page > totalPages){
          page = totalPages; 
        }
        let offset = (page - 1) * pageLength; 

        let business = await db.all(`${filterQuery} limit ${pageLength} offset ${offset}`, [...labels]);
      
        db.close();

        return {"results" : business, "page" : page, "totalPages" : totalPages};
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
    return  res.changes ? badge : undefined;
  }

  /**
   * affirm a specified badge
   * @param {number} userId
   * @param {number} badgeId
   */
  static async affirm(userId, badgeId) {
    // console.log("params:", userId, badgeId);
    let db = await SQL.getDB();
    let res = await db.run(`
      INSERT INTO badge_reacts (userId,badgeId, value) 
      VALUES ($1, $2, 1)`,
      [userId, badgeId]).catch(SQL.parseError);

    await Badges.updateStats(db, badgeId);

    db.close();
    return Boolean(res.changes);
  }

  /**
   * deny a specfied badge
   * @param {number} userId
   * @param {number} badgeId
   * @returns {boolean} 
   */
  static async deny(userId, badgeId) {
    let db = await SQL.getDB();
    let res = await db.run(`
      INSERT INTO badge_reacts (userId,badgeId, value) 
      VALUES ($1, $2, -1)`,
      [userId, badgeId]).catch(SQL.parseError);

    db.close();
    await Badges.updateStats(badgeId);
    return Boolean(res.changes);
  }

/**
 * called after badge has been updated, recalculates, the total affirms, denies of a specified badge
 * @param {number} badgeId 
 */
  static async updateStats(badgeId) {
    let db = await SQL.getDB();
    await db.run(`
    INSERT OR REPLACE INTO badge_stats (badgeId, affirms, denies) SELECT ${Number(badgeId)}, affirms, denies
      FROM (SELECT COUNT(*) as affirms from badge_reacts WHERE badgeId = $1 AND value = 1) 
      JOIN (SELECT COUNT(*) as denies from badge_reacts WHERE badgeId = $2 AND value = -1)
    `,[badgeId, badgeId]);
    console.log('done: ', badgeId)
    await db.close();
  }

  /**
   * return the total nimber of affirms and denies of a badge, as well as the calculated ratio
   * @param {number} badgeId 
   */
  static async getStats(badgeID) {
    let db = await SQL.getDB();
    
    let ad = await db.get(`
      SELECT affirms, denies, ROUND(CAST(affirms as REAL) / CAST(affirms + denies as REAL) * 100.0) as ratio
      FROM badge_stats WHERE badgeId = $1`, 
      [badgeID]).catch(SQL.parseError); 
    db.close();
    
    return ad ? ad : {affirms : 0, denies : 0 , ratio : null };
  }

  static async updateAllStats() {
    let db = await SQL.getDB();
    let badges = await db.all('SELECT id FROM badges');
    db.close();

    console.log("starting");
    await badges.reduce((p, badge) => p.then(async () => await Badges.updateStats(badge.id)), Promise.resolve())
    console.log("finished");
  }

  // /**
  //  * Get the number of affirms of a badge
  //  * @param {number} badgeID
  //  * @returns {number} - the percentage
  //  */
  // static async getAffirms(badgeID) {
  //   let db = await SQL.getDB();
  //   let affirms = await db.get(`SELECT SUM(value) AS a_num FROM badge_reacts WHERE badgeId= $1 AND value= 1`,[badgeID]); 
  //   // return affirms
  //   if (affirms["a_num"] === null) return 0;
  //   return affirms["a_num"];
  // }


  // /**
  //  * Get the number of denies of a badge
  //  * @param {number} badgeID
  //  * @returns {number} - the percentage
  //  */
  // static async getDenies(badgeID) {
  //   let db = await SQL.getDB();
  //   let denies = await db.get(`SELECT SUM(value) AS d_num FROM badge_reacts WHERE badgeId= $1 AND value = -1`, [badgeID]);
  //   if (denies["d_num"] === null) return 0;
  //   return denies["d_num"] * -1;
  // }
}

// DON'T uncomment below if running with npm
// Badges.updateAllStats();

 module.exports = Object.freeze(Badges);