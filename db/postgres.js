const { Client } = require('pg');
require('dotenv').config(); // This allows us to use variables in .env file through process.env
const isProduction = process.env.NODE_ENV === 'production';

const LOCAL_DB_URL = ""; // TODO: set up postgresql

const client = new Client({
  connectionString: isProduction ? process.env.DATABASE_URL : LOCAL_DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function getDB() {
  await client.connect();
  return client;
}

// TODO
async function initDB() {
  let db = await getDB();

  // create tables if not exists
}

// initDB();

module.exports = {
  getDB,
  initDB
}