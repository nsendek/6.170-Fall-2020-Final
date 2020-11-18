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
        let res = await db.all('SELECT * FROM badge_names');
        db.close();
        return res;
    }

    /** 
     * Get all badges associated with a business
     * @param {Number} businessId - the id of the business
     * @return {Badge[]} - a list of badges
     */
    static async getBusinessBadges(businessId) {
        let db = await database.getDB();
        let res = await db.all(`SELECT label FROM badges WHERE businessId = ${businessId}`);
        db.close();
        return res;
    }

    /**
     * Get all businesses associated with a badge
     * @param {Number []} badgeLabel - the name of the badge to filter the businesses by
     * @returns {Business []} - the businesses who have that badge
    */
    static async filterBusinessByBadge(badgeLabel) {
        let db = await database.getDB();
        // console.log("SQL2:", `SELECT id,name,address FROM businesses WHERE id IN ${businessIds}`);
        let businessesWithBadge = await db.all(`SELECT businessId FROM badges WHERE label = '${badgeLabel}'`)
                                .then((businessIds) => {
                                    console.log("Businesses w/ tag!" , businessIds);
                                    let idList = businessIds.map((businessObject) => businessObject.businessId);
                                    return db.all(`SELECT id,name,address FROM businesses WHERE id IN (${idList.join(",")})`);
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
        console.log("B:", businessesWithBadge);
        db.close();
        return (businessesWithBadge === undefined) ? [] : businessesWithBadge;
    }

}

 module.exports = Badges;