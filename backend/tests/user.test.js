jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
}));

const bcrypt = require('bcrypt');
const db = require('../config/database');
const userModel = require('../models/user.model');

describe('user.model', () => {
  beforeEach(() => {
    db.query.mockResolvedValue([{}]);
  });

  test('findByEmail interroge par email', async () => {
    await userModel.findByEmail('a@b.com');
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['a@b.com']);
  });

  test('create hash le mot de passe et met un rôle par défaut', async () => {
    await userModel.create({ id: 'u1', email: 'a@b.com', password: 'plain', first_name: 'A', last_name: 'B' });
    expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO users (id, email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['u1', 'a@b.com', 'hashed', 'A', 'B', 'USER']
    );
  });

  test('create ne rehash pas un mot de passe déjà hashé', async () => {
    await userModel.create({ id: 'u2', email: 'c@d.com', password: '$2hashed', role: 'ADMIN' });
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO users (id, email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['u2', 'c@d.com', '$2hashed', undefined, undefined, 'ADMIN']
    );
  });

  test('create rejette si email ou mot de passe manquent', async () => {
    await expect(userModel.create({ id: 'u3', email: '', password: '' })).rejects.toThrow('Email and password are required');
    expect(db.query).not.toHaveBeenCalled();
  });
});