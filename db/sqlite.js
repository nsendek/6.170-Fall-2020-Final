const Database = require('sqlite-async');

async function createUsersTable() {
  let db = await getDB();

  await db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT NOT NULL UNIQUE, 
      password TEXT NOT NULL,
      timestamp INTEGER
      )`);
      
  db.close();
}

async function createBusinessTable() {
  let db = await getDB();

  await db.run(`CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,

      address TEXT NOT NULL,
      accountName TEXT UNIQUE,
      password TEXT NOT NULL,
      
      lat INTEGER,
      lng INTEGER
      )`);

  db.close();
}

async function createReviewTables() {
  let db = await getDB();

  await db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      businessId INTEGER NOT NULL,
      content TEXT,
      rating INTEGER,
      timestamp INTEGER,

      CHECK (rating>0 AND rating<6)
      UNIQUE (userId, businessId)
      CONSTRAINT user_check FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      CONSTRAINT business_check FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
      )`);

  await db.run(`CREATE TABLE IF NOT EXISTS review_likes (
    userId INTEGER NOT NULL,
    reviewId INTEGER NOT NULL,

    UNIQUE (userId, reviewId)
    CONSTRAINT user_check FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    CONSTRAINT review_check FOREIGN KEY(reviewId) REFERENCES reviews(id) ON DELETE CASCADE
    )`);

  db.close();
}

async function createBadgeTables() {
  let db = await getDB();

  await db.run(`CREATE TABLE IF NOT EXISTS badge_templates (
      label TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      CHECK(label <> '')
    )`);

  await db.run(`CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      businessId INTEGER NOT NULL,
      UNIQUE (label, businessId)
      CONSTRAINT template_check FOREIGN KEY(label) REFERENCES badge_templates(label) ON DELETE CASCADE
      CONSTRAINT business_check FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
    )`);

  await db.run(`CREATE TABLE IF NOT EXISTS badge_reacts (
      userId INTEGER NOT NULL,
      badgeId INTEGER NOT NULL,
      value INTEGER,

      UNIQUE (userId, badgeId)
      CHECK (value=1 OR value=-1)
      CONSTRAINT user_check FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      CONSTRAINT badge_check FOREIGN KEY(badgeId) REFERENCES badges(id) ON DELETE CASCADE
    )`);

  db.close();
}

/**
 * Returns a connection to the SQL database with "foreign_keys=on"
 * adding SQLiteFormat so i can write in postgres syntax while still using SQLite
 */
async function getDB() {
    let db = await Database.open('Zelp.db');
    await db.run('PRAGMA foreign_keys=on');

    const SQLiteFormat = (q) => q.replace(/\$[0-9]+/gi,'?');

    return {
      run : (query,values) => db.run(SQLiteFormat(query),values),
      get : (query,values) => db.get(SQLiteFormat(query),values),
      all : (query,values) => db.all(SQLiteFormat(query),values),
      close : () => db.close()
    };
}

/**
 * turn sqlite err into a returned object.
 * @param {Error} err 
 */
function parseError(err) {
  // console.log(Object.assign({},err));
  return {
    message : err.message,
    code : err.errno,
    error : err.code
  }
}

async function initDB() {
    await createUsersTable();
    await createBusinessTable();

    createReviewTables();
    createBadgeTables();
}

// IDK why but SQLite and Postgres have different ways of getting unix time
const UNIX = () => `strftime("%s", "now")`;

module.exports = {
  getDB,
  initDB,
  parseError,
  UNIX
}