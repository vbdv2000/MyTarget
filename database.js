const mysql = require('mysql2/promise');

async function conectarDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mytarget'
  });
  return connection;
}

module.exports = { conectarDB };