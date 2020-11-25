const { initDB, getDB, parseError, UNIX} = require('./sqlite.js');
// const { initDB, getDB, parseError, UNIX} = require('./postgres.js');

// getDB returns a DatabaseConnection
// initDB starts a database and loads it with tables, if it already isn't loaded
// parseError takes specific err objects from postgres and sqlite and makes them the same style

/**
 * @typedef DatabaseConnection
 * 
 * @method get - returns a single object based on query. undefined otherwise.
 * @method all - returns all objects from a query. empty array otherwise.
 * @method run - used for DELETE, INSERT, and CREATE returns a response object with changes and lastID properties.
 * @method close - closes the database connection (not really mandatory for sqlite but probably for postgres).
 */

/**
 * create a blank array of input values for purposes of SQLite and postgres
 * 
 * list(1) => ($1)
 * list(3) => ($1, $2, $3)
 * list(n) => ($1, $2, $3 .... $n)
 * 
 * @param {number} size - expected size of SQL List
 */
function list(size) {
  let out = "";
  for (let x = 1 ; x <= size ; x++) {
    out += x != size ? `$${x}, ` : `$${x}`
  }
  return `(${out})`;
}

initDB();

module.exports = {
  getDB,
  parseError,
  UNIX,
  list
}