const projectModel = require('../models/project.model');

describe('Project Model', () => {
  test('findById retourne un projet', async () => {
    const projectId = 1; // adapte selon un id existant
    const [rows] = await projectModel.findById(projectId);
    expect(Array.isArray(rows)).toBe(true);
    // Optionnel : vérifier qu'un projet est bien retourné
    // expect(rows.length).toBeGreaterThan(0);
  });
});