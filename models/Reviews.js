const database = require('../db');

/**
 * @typedef Review
 * @prop {number} id - the generated id for the review
 * @prop {string} content - some string of characters
 * @prop {number} rating - in the domain of 1-5
 * @prop {User} author - author of review 
 * @prop {number} businessID -  business
 */

/**
 * 
 * @param {Object} row
 * @returns {Review} 
 */
function mapReview(row) {
    try {
      let review = {
        id : row.id, 
        businessId : row.businessId,
        rating : row.rating,
        content :row.content,
        timestamp : row.timestamp
      };
      //map entire row to Review object with nested User object under 'creator' key
      review.author = { id : row.userId, username: row.username };
      return review;
    } catch (err) {
      return null;
    }
}
/**
 * @class Reviews
 * Stores all Reviews in SQL database.
 * review table (id, content, userId, parentId)
 */
class Reviews {
    /**
     * confirms that userId is the owner of the reviewId.
     * @param {number} userId 
     * @param {number} id - id of Review 
     */
    static async authenticate ( userId, id ) {
        let db = await database.getDB();
        let review = await db.get(`SELECT * FROM reviews WHERE userId = ? AND id = ?`, [userId, id]);
        return Boolean(review);
    }

    static async exists(id) {
        let db = await database.getDB();
        let review = await db.get(`SELECT * FROM reviews WHERE id = ?`, [id]);
        return (review) ? true : false;
    }

    /**
     * Return an array of all of the Reviews.
     * @param {number} is - id of Reviews
     * @return {Review[]} - found Reviews
     */
    static async getAll() {
      
        let db = await database.getDB();
        let data = await db.all(`
            SELECT reviews.id, users.username, userId, businessId, rating, content, reviews.timestamp
            FROM reviews
            JOIN users ON users.id=userId 
            ORDER BY reviews.timestamp DESC`).catch(err => console.log(err));
        return data.map(mapReview);
    }

    /**
     * Return an array of all of the Reviews.
     * @return {Review}
     */
    static async get(id) {
        let db = await database.getDB();
        let data = await db.get(`
            SELECT reviews.id, users.username, userId, businessId, rating, content, reviews.timestamp
            FROM reviews
            JOIN users ON users.id=userId
            WHERE reviews.id = ?`,[id]);
        return mapReview(data);
    }

     /**
     * Get a Reviewd by userId.
     * @param {number} userId - id of creator of Reviews
     * @return {Review[]]} - found Reviews
     */
    static async getByUser(userId) {
      let db = await database.getDB();
      let data =  await db.all(`
          SELECT reviews.id, users.username, userId, businessId, rating, content, reviews.timestamp
          FROM reviews 
          JOIN users ON users.id=userId
          WHERE userId = ? 
          ORDER BY reviews.timestamp DESC`,[userId]);
      return data.map(mapReview);
    }

    /**
     * Add a Review if it contains <= 140 characters
     * @param {number} userId - id of Review creator
     * @param {number} businessId - id of business reviewed
     * @param {string} content - content of the Review
     * @param {number} parentId - id of parent freet. If !null, freet is a refreet. 
     * @return {Review | null} - created Review if it contains <= 140 characters
     *                               or Refreet if not already refreeted
     */
    static async create(userId , businessId, rating, content) {
      // console.log("GOT HERE");
      const db = await database.getDB();
      const res = await db.run(`
          INSERT INTO reviews (rating, content, userId, businessId, timestamp) 
          VALUES (?, ?, ?, ?, strftime("%s", "now"))`, [rating, content, userId, businessId])
          .catch(err => console.log(err));

      db.close();
      return (res && res.changes) ? (await Reviews.get(res.lastID)) : null;
    }

    /**
     * delete the specified Review.
     * @param {number} id - id of Review to find
     * @return {Review | null} true if delete occured, false otherwise
     */
    static async delete(id) {
        let db = await database.getDB();
        let review = await Reviews.get(id);
        // console.log("REVIEW", review)
        let res = await db.run('DELETE FROM reviews WHERE id = ?', [id]);
        db.close();
        return res.changes ? review : null;
    }

    /**
     * update the content of the specified Review.
     * @param {number} id - id of Review to find
     * @param {string} content - new version of content
     * @return {Review} returns the updated Review
     */
    static async update(id, rating, content) {
        let db = await database.getDB();
        let review = await Reviews.get(id);

        console.log("GOT HERE");

        if (review) {
            let res = await db.run(`
              UPDATE reviews 
              SET rating = ?, content = ? 
              WHERE id = ?`,
              [rating, content, id]
            );
            if (Boolean(res)) {
              review.rating = rating;
              review.content = content;
            }
        }
        db.close();
        return review;
    }

// RATING TABLES FOR REVIEWS HAVEN'T BEEN IMPLEMENTED YET
// -----------------------------------------------------------

    static async getLikes(id) {
        // let db = await database.getDB();
        // return await db.all(`
        //     SELECT userId AS id, users.username 
        //     FROM likes 
        //     JOIN users ON users.id=userId
        //     WHERE freetId = ?
        //     ORDER BY id DESC`, [id]);
    }

    static async like(userId, id) {
        // let db = await database.getDB();
        // let res = await db.run(`INSERT INTO likes (freetId,  userId) VALUES (?, ?)`, [id, userId])
        //             .catch(() => null);
        // db.close();
        // return Boolean(res);
    }

    static async unlike(userId, id) {
        // let db = await database.getDB();
        // let res = await db.run(`DELETE FROM likes WHERE freetId = ? AND userId = ?`, [id, userId]);
        // db.close();
        // return Boolean(res.changes);
    }

// -----------------------------------------------------------


    /**
     * searches Review database by a query
     * @param {string} query - search query
     * @return {Review[]} all users whose username matches query.
     */
    static async search(query) {
      let db = await database.getDB();
      let data = await db.all(`
          SELECT reviews.id, users.username, userId, businessId, rating, content, reviews.timestamp 
          FROM reviews 
          JOIN users ON users.id=userId
          WHERE content LIKE '%${query}%'
          OR users.username LIKE '%${query}%'
          ORDER BY reviews.timestamp DESC`);
      return data.map(mapReview);
    }
}

module.exports = Reviews;