const database = require('../db/index');
const Businesses = require('./Businesses');

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
     * Get all badges stored in the database
     */
    static async getAllBadges() {
        let db = await database.getDB()
        let res = await db.all('SELECT name FROM badge_names');
        db.close();
        return res;
    }

    /** 
     * Get all the badges for a business
     * @param {Number} businessId - the id of the business
     */
    static async getBusinessBadges(businessId) {
        let db = await database.getDB();
        console.log(`SELECT label FROM badges WHERE businessId = ${businessId}`)
        let res = await db.all(`SELECT label FROM badges WHERE businessId = ${businessId}`);
        db.close()
        return res;

    }
 }


 module.exports = Badges;