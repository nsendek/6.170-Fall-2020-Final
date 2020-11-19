const SQL = require('../db');

/**
 * @typedef BadgeTemplate
 * @prop {string} label - brief title for the badge
 * @prop {string} description - brief description of what this badge means
 */

/**
 * @typedef Badge
 * @prop {number} id - the generated id for the freet
 * @prop {string} label - label of a specific BadgeTemplate
 * @prop {number} businessId - id of business with this bag
 */


/**
 * @class BadgeTemplates
 * Stores all templates of badges
 * ALL BADGES MUST BE AN 'INSTANCE' OF A TEMPLATE
 * badges_templates table (id, label, businessId, score)
 */
 class BadgeTemplates {

  static toString() {return "template";}
 /**
   * get a specific badge template 
   * @param {id} label - label of badgeTemplate 
   * @returns {BadgeTemplate}
   */
  static async get(label) {
    let db = await SQL.getDB();
    let temp =  await db.get(`SELECT * FROM badge_templates WHERE label = $1`,[label]);
    db.close();
    return temp;
  
  }

  /**
   * get a all badge templates
   * @returns {BadgeTemplate[]}
   */
  static async getAll() {
    let db = await SQL.getDB();
    let temps =  await db.all(`SELECT * FROM badge_templates`);
    db.close();
    return temps;
  }

  static async add(label, description) {
    let db = await SQL.getDB();
    let res = await db.run(`
        INSERT INTO badge_templates(label, description) 
        VALUES ($1, $2)`,
        [label,description])
      .catch(SQL.parseError);
      
    db.close();
    return Boolean(res.changes) ? {label, description}: res;
  }

  static async exists(label) {
    return Boolean(await BadgeTemplates.get(label));
  }
 }


/**
 * @class Badges
 * Stores all Badges in SQL SQL.
 * badges table (id, label, businessId, score)
 */
class Badges {
  /**
   * get a specific badge 
   * @param {id} id - id of badgeTemplate 
   * @returns {Badge}
   */
  static async get(id) {
    let db = await SQL.getDB();
    let out =  await db.get(`SELECT * FROM badges WHERE id = $1`,[id]);
    db.close();
    return out;
  }

  /**
   * get all businesses that have this badge
   * @return {Business[]} IDs of businesses with badge
   */
  static async getBusinessesByBadge(label) {
    let db = await SQL.getDB();
    let out = await db.all(`
        SELECT businessId as id, businesses.name, businesses.address
        FROM badges 
        JOIN businesses ON businesses.id=businessId
        WHERE label = $1`,
        [label]).catch(SQL.parseError);
    db.close();
    return out;
  }

  /**
   * get all badges that a business has
   * @return {Badge[]} list of Badges
   */
  static async getBadgesByBusiness(businessId) {
    let db = await SQL.getDB();
    let out = await db.all(`SELECT id, label FROM badges WHERE businessId = $1`,[businessId]);
    db.close();
    return out;
  }

  /**
   * 
   * @param {number} businessId 
   * @param {Badge | undefined} label 
   */
  static async create(businessId, template) {
    let db = await SQL.getDB();
    let res = await db.run(`
        INSERT INTO badges(businessId, label) 
        VALUES ($1, $2)`,
        [businessId, template])
      .catch(SQL.parseError);

    db.close();
    if (res.error) return undefined; 
    else return Badges.get(res.lastID);
  }

  // static async delete(businessId, label) {
  static async delete(badgeId) {
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


module.exports = {
  Badges,
  BadgeTemplates
}