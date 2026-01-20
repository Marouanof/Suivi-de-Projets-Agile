const sprintModel = require('../models/sprint.model');

describe('Sprint Model', () => {
  test('findAllByProject retourne un tableau', async () => {
    const projectId = 1; // adapte selon un id existant
    const [rows] = await sprintModel.findAllByProject(projectId);
    expect(Array.isArray(rows)).toBe(true);
  });
});