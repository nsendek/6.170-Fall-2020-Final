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
      lon INTEGER
      )`);

  db.close();
}

async function createReviewsTable() {
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
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
      )`);

  db.close();
}

async function createBadgeTables() {
  let db = await getDB();

  await db.run(`CREATE TABLE IF NOT EXISTS badge_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL
    )`);

  await db.run(`CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      businessId INTEGER NOT NULL,

      UNIQUE (type, businessId)
      FOREIGN KEY(type) REFERENCES badge_templates(label) ON DELETE CASCADE
      FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
    )`);

  await db.run(`CREATE TABLE IF NOT EXISTS badge_reacts (
      userId INTEGER NOT NULL,
      badgeId INTEGER NOT NULL,
      value INTEGER,

      UNIQUE (userId, badgeId)
      CHECK (value=1 OR value=-1)
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      FOREIGN KEY(badgeId) REFERENCES badges(id) ON DELETE CASCADE
    )`);

  db.close();
}

// TODO
async function createLikesTable() {
  let db = await getDB();
  await db.run(`CREATE TABLE IF NOT EXISTS review_likes (
      userId INTEGER NOT NULL,
      reviewId INTEGER NOT NULL,

      UNIQUE (userId, reviewId)
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      FOREIGN KEY(reviewId) REFERENCES reviews(id) ON DELETE CASCADE
      )`);

  db.close();
}

// async function createReactsTable() {
//   let db = await getDB();

//   db.close();
// }

// async function createReportsTable() {
// }

/**
 * Returns a connection to the SQL database with "foreign_keys=on"
 */
async function getDB() {
    let db = await Database.open('Zelp.db');
    await db.run('PRAGMA foreign_keys=on');

    return db;
}

async function initDB() {
    await createUsersTable();
    await createBusinessTable();
    createReviewsTable();


    createBadgeTables();
    createLikesTable();
}

module.exports = {
  getDB,
  initDB
}