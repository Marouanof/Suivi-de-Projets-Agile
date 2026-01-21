const retroModel = require('../models/retrospective.model');
const db = require('../config/database');

describe('retrospective.model', () => {
  beforeEach(() => {
    db.query.mockResolvedValue([[]]);
  });

  test('findBySprintId sélectionne par sprint', async () => {
    await retroModel.findBySprintId('s1');
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM retrospectives WHERE sprint_id = ?', ['s1']);
  });

  test('createRetro applique un statut par défaut', async () => {
    await retroModel.createRetro({ id: 'r1', sprint_id: 's1', date: '2025-01-01', facilitator_id: 'u1' });
    const [, params] = db.query.mock.calls[0];
    expect(params).toEqual(['r1', 's1', '2025-01-01', 'DRAFT', 'u1']);
  });

  test('updateRetroStatus met à jour le statut', async () => {
    await retroModel.updateRetroStatus('r1', 'PUBLISHED');
    expect(db.query).toHaveBeenCalledWith('UPDATE retrospectives SET status = ? WHERE id = ?', ['PUBLISHED', 'r1']);
  });

  test('findAllByProject joint sprints et rétrospectives', async () => {
    await retroModel.findAllByProject('p1');
    const call = db.query.mock.calls[0];
    expect(call[0]).toContain('JOIN sprints');
    expect(call[1]).toEqual(['p1']);
  });

  test('createItem insère un item avec votes à 0', async () => {
    await retroModel.createItem({ id: 'i1', retrospective_id: 'r1', category: 'KEEP', text: 'Great job', author_id: 'u1' });
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO retro_items (id, retrospective_id, category, text, votes, author_id) VALUES (?, ?, ?, ?, 0, ?)',
      ['i1', 'r1', 'KEEP', 'Great job', 'u1']
    );
  });

  test('voteItem incrémente les votes', async () => {
    await retroModel.voteItem('i1');
    expect(db.query).toHaveBeenCalledWith('UPDATE retro_items SET votes = votes + 1 WHERE id = ?', ['i1']);
  });

  test('updateItemStatus met à jour la complétion', async () => {
    await retroModel.updateItemStatus('i1', true);
    expect(db.query).toHaveBeenCalledWith('UPDATE retro_items SET is_completed = ? WHERE id = ?', [true, 'i1']);
  });

  test('getTrendData regroupe les catégories', async () => {
    await retroModel.getTrendData('p9');
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('GROUP BY ri.category'), ['p9']);
  });
});