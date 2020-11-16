const SQL = require('../db');

/**
 * @typedef BadgeTemplate
 * @prop {string} label - brief title for the badge type
 * @prop {string} description - brief description of what this badge means
 */

/**
 * @typedef Badge
 * @prop {number} id - the generated id for the freet
 * @prop {string} type - label of a specific BadgeTemplate
 * @prop {number} businessId - id of business with this bag
 * @prop {number} score - how many users confirm this bag?
 */

/**
 * @class Badges
 * Stores all Badges in SQL SQL.
 * badges table (id, type, businessId, score)
 */
class Badges {
  /**
   * get a specific badge 
   * @param {string} type 
   * @returns {BadgeTemplate[]}
   */
  static async getTemplates() {
    let db = await SQL.getDB();
    return await db.all(`SELECT * FROM badge_templates`);
  }

  static async addTemplate(label, description) {
    let db = await SQL.getDB();
    let res = await db.run(`
        INSERT INTO badge_templates(label, description) 
        VALUES (?, ?)`,
        [label,description])
      .catch(SQL.parseError);

    return Boolean(res.changes) ? {label, description}: res;
  }

  /**
   * get a specific badge 
   * @param {id} id - id of badgeTemplate 
   * @returns {Badge}
   */
  static async get(id) {
    let db = await SQL.getDB();
    return await db.get(`SELECT * FROM badges WHERE id = ?`,[id]);
  }

  /**
   * get all businesses that have this badge
   * @return {number} IDs of businesses with badge
   */
  static async getBusinessesByBadge(label) {
    let db = await SQL.getDB();
    return await db.all(`SELECT businessId FROM badges WHERE type = ?`,[label]);
  }

  /**
   * 
   * @param {number} businessId 
   * @param {string} label 
   */
  static async create(businessId, label) {
    let db = await SQL.getDB();
    let res = await db.run(`
        INSERT INTO badges(businessId, type) 
        VALUES (?, ?)`,
        [businessId, label])
      .catch(SQL.parseError);

    return Boolean(res.changes) ? Badges.get(res.lastID) : res; 
  }

  // static async delete(businessId, label) {
  static async delete(badgeId) {
    let db = await SQL.getDB();
    let badge = await Badges.get(badgeId);
    
    if (badge) {
      let res = await db.run('DELETE FROM badges WHERE id = ?', [badgeId]);
      if (!Boolean(res.changes)) return null;
    }

    return badge;
  }

  /**
   * affirm a specified badge
   * @param {number} userId
   * @param {number} badgeId
   */
  static async affirmBadge(userId, badgeId) {
    let db = await SQL.getDB();
    await db.run(`
      INSERT INTO badge_reacts (userId,badgeId, value) 
      VALUES (?, ?, 1)`,
      [userId, badgeId]);
  }

  /**
   * deny a specfied badge
   * @param {number} userId 
   * @param {number} badgeId 
   */
  static async denyBadge(userId, badgeId) {
    let db = await SQL.getDB();
    await db.run(`
      INSERT INTO badge_reacts (userId,badgeId, value) 
      VALUES (?, ?, -1)`,
      [userId, badgeId]);
  }
}

module.exports = Badges;