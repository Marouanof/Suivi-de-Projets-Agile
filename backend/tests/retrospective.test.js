const retroModel = require('../models/retrospective.model');

describe('Retrospective Model', () => {
  test('findBySprintId retourne un tableau', async () => {
    const sprintId = 1; // adapte selon un id existant
    const [rows] = await retroModel.findBySprintId(sprintId);
    expect(Array.isArray(rows)).toBe(true);
  });
});