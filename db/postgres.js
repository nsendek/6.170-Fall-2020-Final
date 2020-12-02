const { Pool } = require('pg');
require('dotenv').config(); // This allows us to use variables in .env file through process.env
const isProduction = process.env.NODE_ENV === 'production';

const LOCAL_DB_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : LOCAL_DB_URL
});

async function createUsersTable() {
  let db = await getDB();

  await db.table(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, 
      username TEXT NOT NULL UNIQUE, 
      password TEXT NOT NULL
      )`);

  db.close();
}

async function createBusinessTable() {
  let db = await getDB();

  await db.table(`CREATE TABLE IF NOT EXISTS businesses (
      id SERIAL PRIMARY KEY,

      name TEXT,
      accountName TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      
      address TEXT,
      lat FLOAT,
      lng FLOAT,
      timestamp INTEGER
      )`);
  

  db.close();
}

async function createReviewTables() {
  let db = await getDB();

  await db.table(`CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      userId INTEGER NOT NULL,
      businessId INTEGER NOT NULL,
      content TEXT,
      rating INTEGER,
      timestamp INTEGER,

      CHECK (rating>0 AND rating<6),
      UNIQUE (userId, businessId),
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
      )`);

  await db.table(`CREATE TABLE IF NOT EXISTS review_likes (
    userId INTEGER NOT NULL,
    reviewId INTEGER NOT NULL,

    UNIQUE (userId, reviewId),
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(reviewId) REFERENCES reviews(id) ON DELETE CASCADE
    )`);

  db.close();
}

async function createBadgeTables() {
  let db = await getDB();

  await db.table(`CREATE TABLE IF NOT EXISTS badge_templates (
      label TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      CHECK(label NOT IN ('label', ''))
    )`);

  await db.table(`CREATE TABLE IF NOT EXISTS badges (
      id SERIAL PRIMARY KEY,
      label TEXT NOT NULL,
      businessId INTEGER NOT NULL,
      UNIQUE (label, businessId),
      FOREIGN KEY(label) REFERENCES badge_templates(label) ON DELETE CASCADE,
      FOREIGN KEY(businessId) REFERENCES businesses(id) ON DELETE CASCADE
    )`);

  await db.table(`CREATE TABLE IF NOT EXISTS badge_reacts (
      userId INTEGER NOT NULL,
      badgeId INTEGER NOT NULL,
      value INTEGER,

      UNIQUE (userId, badgeId),
      CHECK (value=1 OR value=-1),
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(badgeId) REFERENCES badges(id) ON DELETE CASCADE
    )`);

  db.close();
}

async function initDB() {
  await createUsersTable();
  await createBusinessTable();
  createReviewTables();
  createBadgeTables();
}

async function getDB() {
  const client =  await pool.connect();
  return {
    table : (query,values) => client.query(query,values),
    run : async (query,values) => { 
      let res = (await client.query(`${query} RETURNING *`,values)).rows[0]
      return {changes : 1, lastID : res.id}
      },
    get : async (query,values) => (await client.query(query,values)).rows[0],
    all : async (query,values) => (await client.query(query,values)).rows,
    close : () => client.release()
  };
}

/**
 * turn pstgres err into a returned object.
 * @param {Error} err 
 */
function parseError(err) {
  console.log(err)
  return {
    message : err.detail,
    code : err.code,
    error : err.name
  }
}

// IDK why but SQLite and Postgres have different waaays of getting unix time
const UNIX = () => "extract(epoch from now())";

module.exports = {
  getDB,
  initDB,
  parseError,
  UNIX
}