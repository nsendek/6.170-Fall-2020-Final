const SQL = require('../db');

/**
 * @typedef Review
 * @prop {number} id - the generated id for the review
 * @prop {string} content - some string of characters
 * @prop {number} rating - in the domain of 1-5
 * @prop {User} author - author of review 
 * @prop {Business} business - business thats being reviewed 
 * @prop {number} businessID -  business
 */

/**
 * 
 * @param {Object} row containing all selected column values from SQL query
 * @returns {Review} 
 */
function mapReview(row) {
  try {
    let review = {
      id : row.id, 
      rating : row.rating,
      content :row.content,
      timestamp : row.timestamp
    };
    //map entire row to Review object with nested User object under 'creator' key
    review.business = { id : row.businessId , name : row.businessName }
    review.author = { id : row.userId, username: row.username };
    return review;
  } catch (err) {
    return row;
  }
}
/**
 * @class Reviews
 * Stores all Reviews in SQL database.
 * review table (id, content, userId, parentId)
 */
class Reviews {
  static toString() {return "review";}

  /**
   * confirms that userId is the owner of the reviewId.
   * @param {number} userId 
   * @param {number} id - id of Review 
   */
  static async authenticate ( userId, id ) {
      let db = await SQL.getDB();
      let review = await db.get(`SELECT * FROM reviews WHERE userId = $1 AND id = $2`, [userId, id]);
      return Boolean(review);
  }

  static async exists(id) {
      return Boolean(await Reviews.get(id))
  }

  /**
   * Return an array of all of the Reviews.
   * @param {number} is - id of Reviews
   * @return {Review[]} - found Reviews
   */
  static async getAll() {
      let db = await SQL.getDB();
      let data = await db.all(`
          SELECT reviews.id, users.username, userId, businessId, 
          businesses.name AS businessName, rating, content, reviews.timestamp
          FROM reviews
          JOIN users ON users.id=userId 
          JOIN businesses ON businesses.id=businessId 
          ORDER BY reviews.timestamp DESC`);
      return data.map(mapReview);
  }

  /**
   * Return an array of all of the Reviews.
   * @return {Review}
   */
  static async get(id) {
      let db = await SQL.getDB();
      let data = await db.get(`
          SELECT reviews.id, users.username, userId, businessId, 
          businesses.name AS businessName, rating, content, reviews.timestamp
          FROM reviews
          JOIN users ON users.id=userId 
          JOIN businesses ON businesses.id=businessId 
          WHERE reviews.id = $1`,[id]);
      return mapReview(data);
  }

  /**
   * Get a Reviews by userId.
   * @param {number} userId - id of creator of Reviews
   * @return {Review[]]} - found Reviews
   */
  static async getByUser(userId) {
    let db = await SQL.getDB();
    let data =  await db.all(`
        SELECT reviews.id, users.username, userId, businessId, 
        businesses.name AS businessName,rating, content, reviews.timestamp
        FROM reviews 
        JOIN users ON users.id=userId
        JOIN businesses ON businesses.id=businessId 
        WHERE userId = $1
        ORDER BY reviews.timestamp DESC`,[userId]);

    return data.map(mapReview);
  }

  /**
   * Get review for particular business made by user
   * @param {number} businessId 
   * @param {number} userID 
   * 
   * @return {Review} - review 
   */
  static async getByUserAndBusiness(userId, businessID) {
    let db = await SQL.getDB();
    let data =  await db.all(`
        SELECT reviews.id, users.username, userId, businessId, 
        businesses.name AS businessName,rating, content, reviews.timestamp
        FROM reviews 
        JOIN users ON users.id=userId
        JOIN businesses ON businesses.id=businessId 
        WHERE userId = $1 AND businessId = $2`,[userId, businessID]);

    return data.map(mapReview);
  }

  /**
   * Get a Reviews by businessId.
   * @param {number} businessId - id of business reviewed
   * @return {Review[]]} - found Reviews
   */
  static async getByBusiness(businessId, page) {
    let pageLength = 10;

    let db = await SQL.getDB();
    let numRows = await db.get(`
        SELECT COUNT(*) FROM reviews
        WHERE businessId = $1`, [businessId]); 
    numRows = numRows["COUNT(*)"];
    let totalPages = Math.ceil(numRows / pageLength); 
    if(page <= 0){
      page = 1;
    }
    if(page > totalPages){
      page = totalPages; 
    }
    let offset = (page - 1) * pageLength; 


    let data =  await db.all(`
        SELECT reviews.id, users.username, userId, businessId, 
        businesses.name AS businessName,rating, content, reviews.timestamp
        FROM reviews 
        JOIN users ON users.id=userId
        JOIN businesses ON businesses.id=businessId 
        WHERE businessId = $1
        ORDER BY reviews.timestamp DESC
        limit $2 offset $3`,[businessId, pageLength, offset]);

    db.close(); 

    return {"results" : data.map(mapReview), "page" : page, "totalPages" : totalPages};
  }

  /**
   * Get an overall rating for a business
   * @param {*} businessId 
   */
  static async getBusinessRating(businessId) {
    let db = await SQL.getDB();
    let ratingAvg = db.get(`SELECT ROUND(AVG(rating), 2) AS avg FROM reviews WHERE businessId = $1`, [businessId]);
    db.close();
    return ratingAvg;
  }

  /**
   * Add a Review if it contains <= 140 characters
   * @param {number} userId - id of Review creator
   * @param {number} businessId - id of business reviewed
   * @param {string} content - content of the Review
   * @param {number} parentId - id of parent freet. If !undefined, freet is a refreet. 
   * @return {Review | undefined} - created Review if it contains <= 140 characters
   *                               or Refreet if not already refreeted
   */
  static async create(userId , businessId, rating, content) {
    // console.log("GOT HERE");
    const db = await SQL.getDB();
    const res = await db.run(`
        INSERT INTO reviews (rating, content, userId, businessId, timestamp) 
        VALUES ($1, $2, $3, $4, strftime("%s", "now"))`, [rating, content, userId, businessId])
        .catch(SQL.parseError);

    db.close();
    console.log(res)

    if (!res.error) return Reviews.get(res.lastID);
  }

  /**
   * delete the specified Review.
   * @param {number} id - id of Review to find
   * @return {Review | undefined} object returned IF delete occured
   */
  static async delete(id) {
      let db = await SQL.getDB();
      let review = await Reviews.get(id);
      let res = await db.run('DELETE FROM reviews WHERE id = $1', [id]);
      db.close();
      return res.changes ? review : undefined;
  }

  /**
   * update the content of the specified Review.
   * @param {number} id - id of Review to find
   * @param {string} content - new version of content
   * @return {Review} returns the updated Review
   */
  static async update(id, rating, content) {
      let db = await SQL.getDB();

      let res = await db.run(`
        UPDATE reviews 
        SET rating = $1, content = $2
        WHERE id = $3`,
        [rating, content, id])
      .catch(SQL.parseError);

      db.close();
      if (!res.error) return Reviews.get(res.lastID);
  }

  static async getLikes(id) {
    let db = await SQL.getDB();
    let out =  await db.all(`
          SELECT userId AS id, users.username 
          FROM review_likes 
          JOIN users ON users.id=userId
          WHERE reviewId = ?
          ORDER BY id DESC`, [id]);

    db.close();
    return out;
  }

  static async like(userId, id) {
      let db = await SQL.getDB();
      let res = await db.run(`INSERT INTO review_likes (reviewId,  userId) VALUES (?, ?)`, [id, userId])
                  .catch(() => undefined);
      db.close();
      return Boolean(res);
  }

  static async unlike(userId, id) {
      let db = await SQL.getDB();
      let res = await db.run(`DELETE FROM review_likes WHERE reviewId = ? AND userId = ?`, [id, userId]);
      db.close();
      return Boolean(res.changes);
  }

  // -----------------------------------------------------------

  // /**
  //  * searches Review database by a query
  //  * @param {string} query - search query
  //  * @return {Review[]} all users whose username matches query.
  //  */
  // static async search(query) {
  //   let db = await SQL.getDB();
  //   let data = await db.all(`
  //       SELECT reviews.id, users.username, userId, businessId, rating, content, reviews.timestamp 
  //       FROM reviews 
  //       JOIN users ON users.id=userId
  //       WHERE content LIKE '%${query}%'
  //       OR users.username LIKE '%${query}%'
  //       ORDER BY reviews.timestamp DESC`);
  //   return data.map(mapReview);
  // } 
}

module.exports = Object.freeze(Reviews);