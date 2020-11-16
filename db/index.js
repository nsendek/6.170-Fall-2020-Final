const { initDB, getDB, parseError} = require('./sqlite.js');
// const { initDB, getDB, parseError} = require('./postgres.js');

initDB();

module.exports = {
  getDB,
  parseError
}