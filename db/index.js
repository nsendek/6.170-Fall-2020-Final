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
      password TEXT NOT NULL
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

async function createTagsTable() {
  let db = await getDB();

  await db.run(`CREATE TABLE IF NOT EXISTS tag_names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )`);
  await db.run(`CREATE TABLE IF NOT EXISTS tags (
      label TEXT NOT NULL,
      businessId INTEGER NOT NULL,

      PRIMARY KEY (label, businessId)
      FOREIGN KEY(label) REFERENCES tag_names(name) ON DELETE CASCADE
      FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
      )`);

  db.close();
}

async function createBadgesTable() {
  let db = await getDB();

  await db.run(`CREATE TABLE IF NOT EXISTS badge_names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )`);
  await db.run(`CREATE TABLE IF NOT EXISTS badges (
      label TEXT NOT NULL,
      businessId INTEGER NOT NULL,

      PRIMARY KEY (label, businessId)
      FOREIGN KEY(label) REFERENCES badge_names(name) ON DELETE CASCADE
      FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
      )`);

  db.close();
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
    await createUsersTable();
    await createBusinessTable();
    createReviewsTable();
    createBadgesTable();
    createTagsTable();
}

initDB();

module.exports = {
    getDB,
}