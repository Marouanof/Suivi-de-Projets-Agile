// Central Jest setup: mock the DB layer globally to avoid real MySQL connections
jest.mock('../config/database', () => ({
  query: jest.fn(),
  close: jest.fn(),
}));

const db = require('../config/database');

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  if (db && typeof db.close === 'function') {
    await db.close();
  }
});
