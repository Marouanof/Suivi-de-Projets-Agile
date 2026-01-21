const backlogModel = require('../models/backlog.model');
const db = require('../config/database');

describe('backlog.model', () => {
  beforeEach(() => {
    db.query.mockResolvedValue([[]]);
  });

  test('findAllByProject construit la requête attendue', async () => {
    await backlogModel.findAllByProject('proj-1');
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('project_id = ?'), ['proj-1']);
  });

  test('findAllBySprint ajoute les filtres fournis', async () => {
    await backlogModel.findAllBySprint('sprint-1', { assigned_to_id: 'user-2', type: 'BUG' });
    const [sql, params] = db.query.mock.calls[0];
    expect(sql).toContain('assigned_to_id = ?');
    expect(sql).toContain('type = ?');
    expect(params).toEqual(['sprint-1', 'user-2', 'BUG']);
  });

  test('create applique les valeurs par défaut', async () => {
    await backlogModel.create({ project_id: 'p', sprint_id: 's', title: 'T', description: 'D' });
    const [, params] = db.query.mock.calls[0];
    expect(params).toEqual(['p', 's', 'T', 'D', 'USER_STORY', 0, 0, 'BACKLOG', 0, undefined, undefined]);
  });

  test('update ignore les champs non autorisés et vides', async () => {
    await backlogModel.update('item-1', { title: 'New', unknown: 'x', sprint_id: undefined });
    const [sql, params] = db.query.mock.calls[0];
    expect(sql).toContain('title = ?');
    expect(sql).not.toContain('unknown');
    expect(params).toEqual(['New', 'item-1']);
  });

  test('update retourne undefined si aucun champ valable', async () => {
    const result = await backlogModel.update('item-1', { invalid: 'x' });
    expect(result).toBeUndefined();
    expect(db.query).not.toHaveBeenCalled();
  });

  test('updateStatus rejette un statut invalide', async () => {
    await expect(backlogModel.updateStatus('item-1', 'WRONG')).rejects.toThrow('Invalid backlog status');
    expect(db.query).not.toHaveBeenCalled();
  });

  test('updateStatus accepte un statut valide', async () => {
    await backlogModel.updateStatus('item-1', 'DONE');
    expect(db.query).toHaveBeenCalledWith('UPDATE backlog_items SET status = ? WHERE id = ?', ['DONE', 'item-1']);
  });

  test('sumStoryPointsBySprint cible le sprint fourni', async () => {
    await backlogModel.sumStoryPointsBySprint('sprint-42');
    expect(db.query).toHaveBeenCalledWith(
      "SELECT SUM(story_points) as total FROM backlog_items WHERE sprint_id = ? AND status = 'DONE'",
      ['sprint-42']
    );
  });
});