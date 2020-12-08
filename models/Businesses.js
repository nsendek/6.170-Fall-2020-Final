const SQL = require('../db');
const axios = require('axios');
const Badges = require('./Badges');
// const Badges = require('../models/Badges');

/**
 * @typedef Business
 * @prop {number} id - the generated id for the business
 * @prop {string} name - the name of the business
 * @prop {string} address - the address of the business
 */


 /**
 * @class Businesses
 * Stores all Businesses in SQL database.
 * businesses table (id, name, address)
 */

class Businesses {

  static toString() {return "business";}

  /**
   * Confirm that the (accountName, password) pair given exists in the database.
   * @param {string} accountName
   * @param {string} password 
   * @return {Business | undefined} - the authenticated Business (minus the password)
   */    
  static async authenticate ( accountName, password ) {
    let db = await SQL.getDB();
    let business = await db.get(`
        SELECT id, name, accountName 
        FROM businesses 
        WHERE accountName = $1 AND password = $2`, [accountName, password]);
    db.close();
    return business;
  }

  /**
   * Confirm that business exists in the database.
   * @param {string | number} identifier - accountName or ID
   * @returns {boolean} whether the business exists or not
   */
  static async exists(identifier) {
    if (isNaN(identifier)) { // using accountName instead of ID
      let db = await SQL.getDB();
      let out = await db.get(`SELECT * FROM businesses WHERE accountName = $1`,[identifier]);
      db.close();
      return Boolean(out);
    }

    // identifer is ID
    return Boolean(await Businesses.get(identifier));
  }

  /**
   * Return an array of all of the Businesses.
   * @return {Business[]}
   */
  static async getAll(page, userBadges) {
    let pageLength = 10;

    let db = await SQL.getDB();
    let numRows = await db.get(`SELECT COUNT(*) FROM businesses`); 
    numRows = numRows["COUNT(*)"];
    let totalPages = Math.ceil(numRows / pageLength); 

    if(page <= 0){
      page = 1;
    }
    if(page > totalPages){
      page = totalPages; 
    }
    let offset = (page - 1) * pageLength; 

    // // I think this if-statement will be obsolete when we introduce sorting by overall metrics 
    // if(userBadges.length == 0){
    //   let business = await db.all(`
    //     SELECT id,name,address,lat,lng 
    //     FROM businesses 
    //     ORDER BY name ASC 
    //     limit $1 offset $2`, [pageLength, offset]);

    //   db.close(); 
    //   return {"results" : business, "page" : page, "totalPages" : totalPages};
    // } 
    // else{
    let business = await db.all(`
      SELECT id,name,address,lat,lng 
      FROM businesses 
      ORDER BY name ASC`); 

    let businessBadgeDictionary = {};

    let processBusiness = async (b) => {
      let subBadgeDictionary = {};
      let badges = await db.all(`SELECT id,label FROM badges WHERE businessId = $1`, [b.id]);
      let labelToID = {};
      badges.forEach( badge => {labelToID[badge.label] = badge.id;})

      await Promise.all(userBadges.map(async (badge) => { 
        subBadgeDictionary[badge] = {};
        subBadgeDictionary[badge].containsBadge = Boolean(labelToID[badge]);

        if(subBadgeDictionary[badge].containsBadge){
          let badgeId =  labelToID[badge];
          let stats = await Badges.getStats(badgeId);
          subBadgeDictionary[badge]["ratio"] = stats.ratio;
        }
      }))

      businessBadgeDictionary[b.id] = subBadgeDictionary; 
    }

    await Promise.all(business.map(b => Promise.resolve(processBusiness(b))));

    business.sort(this.sortBusinesses(userBadges, businessBadgeDictionary)); 

    db.close();
    return {"results" : business.slice(offset, offset + pageLength), "page" : page, "totalPages" : totalPages};
  }

  static sortBusinesses(userBadges, businessBadgeDictionary){
    return function(a, b){
      // sort by badge importance 
      // console.log("sorting"); 
      for (let idx = 0; idx < userBadges.length; idx++) {
        let badge = userBadges[idx];

        let a_badge = businessBadgeDictionary[a.id][badge]["containsBadge"]; 
        let b_badge = businessBadgeDictionary[b.id][badge]["containsBadge"]; 

        if (a_badge < b_badge) return 1; 
        if (a_badge > b_badge) return -1;

        if(a_badge == 1 && b_badge == 1){ // if they both contain the badge sort by badge ratio
          // console.log("i am comparing ratios"); 
          let a_ratio = businessBadgeDictionary[a.id][badge]["ratio"]; 
          let b_ratio = businessBadgeDictionary[b.id][badge]["ratio"]; 
          // console.log(a_ratio);
          // console.log(b_ratio); 
          if (a_ratio < b_ratio) return 1; 
          if (a_ratio > b_ratio) return -1;
        }
      }
      // if neither of them contain any of the badges then compare overall business rating
      // let a_rating = businessBadgeDictionary[a.id]["businessRating"]; 
      // let b_rating = businessBadgeDictionary[b.id]["businessRating"]; 
      // if (a_rating < b_rating) return 1; 
      // if (a_rating > b_rating) return -1;

      // sort the rest of the list randomly so that it's not always alphabetical
      return 0; // Math.round(Math.random()) == 1 ? 1 : -1; 
    }
  }

  /**
   * return a specific Business
   * @return {Business | undefined}
   */
  static async get(id) {
    let db = await SQL.getDB();
    let out = await db.get(`SELECT id,name,address,lat,lng FROM businesses WHERE id = $1`,[id]);
    db.close();
    return out;
  }

  /**
   * Return the business ID assoicated with a user account
   * @param {*} accountName 
   */
  static async getIDFromAccount(accountName) {
    let db = await SQL.getDB();
    let out = await db.get(`SELECT id FROM businesses WHERE accountName = $1`,[accountName]);
    db.close();
    return out;
  }

  /**
   * create a business account
   * @param {string} name - front facing name of business
   * @param {string} accountName - backend identifier of businiess  (because names can't be unique) 
   * @param {string} password - password of business account
   * @param {string} address - the address of the business 
   * @return {Business | undefined} - new Business (minus the password)
   */
  static async create(name, accountName, password, address) {
    let db = await SQL.getDB();

    // insert into business into database.
    let res = await db.run(`
        INSERT INTO businesses (name, accountName, password) 
        VALUES ($1, $2, $3)`
        ,[name, accountName, password])
      .catch(SQL.parseError);

    await this.updateAddress(res.lastID, address);

    db.close();

    if (!res.error) return Businesses.get(res.lastID);
  }

  /**
   * Removes an existing business.
   * @param {number} id - business ID
   * @return {Business | null} - deleted Business if business deleted else null
   */
  static async delete( id ) {
    let db = await SQL.getDB();
    let business = await Businesses.get(id);
    
    let res = await db.run('DELETE FROM businesses WHERE id = $1', [id]);

    db.close();
    return res.changes ? business : undefined;
  }

  /**
   * 
   * @param {*} id 
   * @param {*} newAccountName - new account Name 
   * @return {User | null} the altered User (minus password)
   */
  static async updateAccountName(id, newAccountName) {
    let out = null;
    let db = await SQL.getDB();
    let business = await Businesses.get(id);

    if (business) {
        let res = await db.run(`UPDATE businesses SET accountName = $1 WHERE id = $2`, [newAccountName, id]); 
        out =  res.changes ? business : null;
        if (out) out.accountName = newAccountName;
    }
    db.close();
    return out;
  }

  /**
   * change name
   * @param {number} id - business ID
   * @param {string} newName - new name
   * @return {User | null} the altered User (minus password)
   */
  static async updateName(id, newName) {
    let out = null;
    let db = await SQL.getDB();
    let business = await Businesses.get(id);

    if (business) {
        let res = await db.run(`UPDATE businesses SET name = $1 WHERE id = $2`, [newName, id]); 
        out =  res.changes ? business : null;
        if (out) out.name = newName;
    }
    db.close();
    return out;
  }

  /**
   * change password
   * @param {string} id - id of business
   * @param {string} newPassword - new password
   * @return {Business | null} the altered User (minus password)
   */
  static async updatePassword(id, newPassword) {
    let out = null;
    let db = await SQL.getDB();
    let business = await Businesses.get(id);
    if (business) {
        let res = await db.run(`UPDATE businesses SET password = $1 WHERE id = $2`, [newPassword, id]); 
        out = res.changes ? business : null;
    }
    db.close();
    return out;
  }

  /**
   * change/add address
   * @param {string} id - id of business
   * @param {string} address 
   */
  static async updateAddress(id, address) {
    let db = await SQL.getDB();
    let out = {address, lat : 0, lng : 0}

    // do geocoding of address to lat long
    let data = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", { 
      params : { 
          address : address,
          key : "AIzaSyDKOlyw5FKzfofKtyQ5jfKFuleqelf1nhQ",
        }
    })
      .then(data => data.data)
      .catch(err => err.response ? err.response : err);

    if (!data.results || !data.results[0]) return undefined;
    
    out.address = data.results[0].formatted_address;
    out.lat = data.results[0].geometry.location.lat;
    out.lng = data.results[0].geometry.location.lng;

    let res = await db.run(`UPDATE businesses 
      SET address = $1, lat = $2, lng = $3 
      WHERE id = $4`, [out.address, out.lat, out.lng, id])
      .catch(SQL.parseError);

    db.close();

    if (!res.error) return Businesses.get(id);
  }

  /**
   * searches Businesses database by a query
   * @param {string} query - search query
   * @return {Business[]} all Businesses whose name matches query.
   */
  static async search(query) {
    let db = await SQL.getDB();
    let data = await db.all(`
        SELECT id,name,address,lat,lng 
        FROM businesses 
        WHERE name LIKE '%${query}%'
        `);
    db.close();
    return data;
  }
}

module.exports = Object.freeze(Businesses);