const { Pool } = require('pg');
require('dotenv').config(); // This allows us to use variables in .env file through process.env
const isProduction = process.env.NODE_ENV === 'production';

const LOCAL_DB_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : LOCAL_DB_URL,
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

async function createUsersTable() {
  let db = await getDB();

  await db.create(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, 
      username TEXT NOT NULL UNIQUE, 
      password TEXT NOT NULL,
      timestamp INTEGER
      )`);

  db.close();
}

async function createBusinessTable() {
  let db = await getDB();

  await db.create(`CREATE TABLE IF NOT EXISTS businesses (
      id SERIAL PRIMARY KEY,
      name TEXT,

      address TEXT NOT NULL,
      accountName TEXT UNIQUE,
      password TEXT NOT NULL,
      
      lat INTEGER,
      lon INTEGER
      )`);

  db.close();
}

// TODO
async function initDB() {
  await createUsersTable();
  await createBusinessTable();
}

async function getDB() {
  const client =  await pool.connect();
  return {
    create : (query,values) => client.query(query,values),
    run : (query,values) => client.query(query,values),
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
  return {
    message : err.detail,
    code : err.code,
    error : err.name
  }
}

const UNIX = () => "extract(epoch from now())";

module.exports = {
  getDB,
  initDB,
  parseError,
  UNIX
}