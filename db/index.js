const Database = require('sqlite-async');

async function createUsersTable(db) {
  db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT NOT NULL UNIQUE, 
      password TEXT NOT NULL,
      timestamp INTEGER
      )`);
}

async function createBusinessTable(db) {
  db.run(`CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT NOT NULL,
      password TEXT NOT NULL
      )`);
}

async function createReviewsTable(db) {
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
      userId INTEGER NOT NULL,
      businessId INTEGER NOT NULL,
      content TEXT,
      rating INTEGER,

      CHECK (rating>0 AND rating<6)
      PRIMARY KEY (userId, businessId)
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
      )`);
}

async function createTagsTable(db) {
  await db.run(`CREATE TABLE IF NOT EXISTS tag_names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS tags (
      label TEXT NOT NULL,
      businessId INTEGER NOT NULL,

      PRIMARY KEY (label, businessId)
      FOREIGN KEY(label) REFERENCES tag_names(name) ON DELETE CASCADE
      FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
      )`);
}

async function createBadgesTable(db) {
  await db.run(`CREATE TABLE IF NOT EXISTS badge_names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS badges (
      label TEXT NOT NULL,
      businessId INTEGER NOT NULL,

      PRIMARY KEY (label, businessId)
      FOREIGN KEY(label) REFERENCES badge_names(name) ON DELETE CASCADE
      FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
      )`);
}

/**
 * Returns a connection to the SQL database with "foreign_keys=on"
 */
async function getDB() {
    let db = await Database.open('Zelp.db');
    await db.run('PRAGMA foreign_keys=on');

    return db;
}

async function initDB() {
    let db = await Database.open('Zelp.db');

    await createUsersTable(db);
    await createBusinessTable(db);

    createReviewsTable(db);
    createBadgesTable(db);
    createTagsTable(db);

    db.close();
}

initDB();

module.exports = {
    getDB,
}