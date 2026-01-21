const db = require('../config/database');
const utils = require('../models/utils');

describe('models/utils', () => {
  beforeEach(() => {
    db.query.mockResolvedValue([{}]);
  });

  test('shiftPositions incrémente à partir de la position donnée', async () => {
    await utils.shiftPositions('s1', 'TODO', 3, 1);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('position = position + 1'),
      ['s1', 'TODO', 3]
    );
  });

  test('shiftPositions décrémente quand direction est négative', async () => {
    await utils.shiftPositions('s1', 'DONE', 5, -1);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('position = position - 1'),
      ['s1', 'DONE', 5]
    );
  });

  test('reorderInSameColumn décale vers le bas', async () => {
    await utils.reorderInSameColumn('s1', 'IN_PROGRESS', 2, 4);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('position = position - 1'),
      ['s1', 'IN_PROGRESS', 2, 4]
    );
  });

  test('reorderInSameColumn décale vers le haut', async () => {
    await utils.reorderInSameColumn('s1', 'IN_PROGRESS', 5, 3);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('position = position + 1'),
      ['s1', 'IN_PROGRESS', 3, 5]
    );
  });

  test('reorderInSameColumn ne requête pas si positions identiques', async () => {
    const result = await utils.reorderInSameColumn('s1', 'IN_PROGRESS', 3, 3);
    expect(result).toBeUndefined();
    expect(db.query).not.toHaveBeenCalled();
  });

  test('removeFromColumn décrémente les positions supérieures', async () => {
    await utils.removeFromColumn('s1', 'DONE', 7);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('position = position - 1'),
      ['s1', 'DONE', 7]
    );
  });
});
