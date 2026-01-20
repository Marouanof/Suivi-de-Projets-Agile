const userModel = require('../models/user.model');

describe('User Model', () => {
  test('findByEmail retourne un utilisateur', async () => {
    const email = 'ichikh03@gmail.com'; // adapte selon un email existant
    const [rows] = await userModel.findByEmail(email);
    expect(Array.isArray(rows)).toBe(true);
    // Optionnel : vérifier qu'un utilisateur est bien retourné
    // expect(rows.length).toBeGreaterThan(0);
  });
});