const db = require('../config/database');

afterAll(async () => {
  if (db && typeof db.close === 'function') {
    await db.close();
  }
});
