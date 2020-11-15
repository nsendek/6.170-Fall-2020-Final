const { initDB, getDB } = require('./sqlite.js');
// const { initDB, getDB } = require('./postgres.js');

initDB();

module.exports = {
  getDB
}