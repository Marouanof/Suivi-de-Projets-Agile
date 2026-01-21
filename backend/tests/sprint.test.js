const sprintModel = require('../models/sprint.model');
const db = require('../config/database');

describe('sprint.model', () => {
  beforeEach(() => {
    db.query.mockResolvedValue([[]]);
  });

  test('findAllByProject filtre sur le projet', async () => {
    await sprintModel.findAllByProject('p1');
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE project_id = ?'),
      ['p1']
    );
  });

  test('create applique les valeurs par défaut', async () => {
    await sprintModel.create({ id: 's1', project_id: 'p1', name: 'Sprint 1', start_date: '2025-01-01', end_date: '2025-01-15' });
    const [, params] = db.query.mock.calls[0];
    expect(params).toEqual(['s1', 'p1', 'Sprint 1', '2025-01-01', '2025-01-15', 'PLANNING', 0, 1]);
  });

  test('update met à jour toutes les colonnes', async () => {
    await sprintModel.update('s1', { name: 'Sprint 2', start_date: '2025-02-01', end_date: '2025-02-14', status: 'ACTIVE', planned_velocity: 20, actual_velocity: 10, isActive: 1 });
    expect(db.query).toHaveBeenCalledWith(
      'UPDATE sprints SET name = ?, start_date = ?, end_date = ?, status = ?, planned_velocity = ?, actual_velocity = ?, isActive = ? WHERE id = ?',
      ['Sprint 2', '2025-02-01', '2025-02-14', 'ACTIVE', 20, 10, 1, 's1']
    );
  });

  test('updatePartial ignore les champs non permis', async () => {
    await sprintModel.updatePartial('s1', { name: 'Sprint 3', foo: 'bar', status: 'COMPLETED' });
    const [sql, params] = db.query.mock.calls[0];
    expect(sql).toBe('UPDATE sprints SET name = ?, status = ? WHERE id = ?');
    expect(params).toEqual(['Sprint 3', 'COMPLETED', 's1']);
  });

  test('updatePartial retourne undefined si aucun champ valide', async () => {
    const result = await sprintModel.updatePartial('s1', { foo: 'bar' });
    expect(result).toBeUndefined();
    expect(db.query).not.toHaveBeenCalled();
  });

  test('updateStatus rejette un statut inconnu', async () => {
    await expect(sprintModel.updateStatus('s1', 'BAD')).rejects.toThrow('Invalid status: BAD');
    expect(db.query).not.toHaveBeenCalled();
  });

  test('softDelete désactive le sprint', async () => {
    await sprintModel.softDelete('s1');
    expect(db.query).toHaveBeenCalledWith('UPDATE sprints SET isActive = 0 WHERE id = ?', ['s1']);
  });
});