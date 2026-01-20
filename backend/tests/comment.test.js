const commentModel = require('../models/comment.model');

describe('Comment Model', () => {
  test('findByItem retourne un tableau', async () => {
    const backlogItemId = 1; // adapte selon un id existant
    const [rows] = await commentModel.findByItem(backlogItemId);
    expect(Array.isArray(rows)).toBe(true);
  });
});