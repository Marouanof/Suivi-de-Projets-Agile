jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('middlewares/auth', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    jest.clearAllMocks();
  });

  test('retourne 500 si le secret est absent', () => {
    delete process.env.JWT_SECRET;
    const req = { headers: {} };
    const res = createRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'JWT secret not configured' });
    expect(next).not.toHaveBeenCalled();
  });

  test('retourne 401 si le token manque', () => {
    const req = { headers: {} };
    const res = createRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  test('retourne 401 si le token est invalide', () => {
    jwt.verify.mockImplementation(() => { throw new Error('bad'); });
    const req = { headers: { authorization: 'Bearer bad' } };
    const res = createRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('appelle next avec un token valide', () => {
    const user = { id: 'u1', role: 'ADMIN' };
    jwt.verify.mockReturnValue(user);
    const req = { headers: { authorization: 'Bearer good' } };
    const res = createRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('good', 'secret');
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });
});

describe('middlewares/admin', () => {
  test('refuse l\'accès sans rôle ADMIN', () => {
    const req = { user: { role: 'USER' } };
    const res = createRes();
    const next = jest.fn();

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin access only' });
    expect(next).not.toHaveBeenCalled();
  });

  test('laisse passer un admin', () => {
    const req = { user: { role: 'ADMIN' } };
    const res = createRes();
    const next = jest.fn();

    adminMiddleware(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
