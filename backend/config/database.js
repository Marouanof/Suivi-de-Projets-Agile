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
const promisePool = pool.promise();

// Permettre la fermeture du pool (utile pour les tests Jest afin d'éviter les handles ouverts)
promisePool.close = () => pool.end();

module.exports = promisePool;
