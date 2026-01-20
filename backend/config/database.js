const mysql = require("mysql2");

// Pool de connexions (RECOMMANDÉ)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ourJira_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Version promise pour async/await
module.exports = pool.promise();
