const projectModel = require('../models/project.model');
const db = require('../config/database');

describe('project.model', () => {
  beforeEach(() => {
    db.query.mockResolvedValue([[]]);
  });

  test('findAll récupère tous les projets actifs', async () => {
    await projectModel.findAll();
    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM projects WHERE isActive = 1 ORDER BY created_at DESC'
    );
  });

  test('findById ajoute le filtre id', async () => {
    await projectModel.findById('p1');
    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM projects WHERE id = ? AND isActive = 1',
      ['p1']
    );
  });

  test('create rejette si le nom est manquant', async () => {
    await expect(projectModel.create({ id: 'p1', description: 'd' })).rejects.toThrow('Project name is required');
    expect(db.query).not.toHaveBeenCalled();
  });

  test('create applique le statut PLANNING par défaut', async () => {
    await projectModel.create({ id: 'p1', name: 'My project', description: 'd', created_by: 'u1' });
    const [sql, params] = db.query.mock.calls[0];
    expect(sql).toContain('VALUES (?, ?, ?, ?, ?, \'PLANNING\'',);
    expect(params).toEqual(['p1', 'My project', 'd', undefined, undefined, 'u1']);
  });

  test('update rejette un statut invalide', async () => {
    await expect(projectModel.update('p1', { status: 'BROKEN' })).rejects.toThrow('Invalid project status');
    expect(db.query).not.toHaveBeenCalled();
  });

  test('update met à jour les champs fournis', async () => {
    await projectModel.update('p1', { name: 'New', description: 'Desc', start_date: '2025-01-01', end_date: '2025-02-01', status: 'ACTIVE', isActive: 1 });
    expect(db.query).toHaveBeenCalledWith(
      'UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?, isActive = ? WHERE id = ?',
      ['New', 'Desc', '2025-01-01', '2025-02-01', 'ACTIVE', 1, 'p1']
    );
  });

  test('findProjectsByUser récupère les projets du membre', async () => {
    await projectModel.findProjectsByUser('user-1');
    const call = db.query.mock.calls[0];
    expect(call[0]).toContain('WHERE pm.user_id = ?');
    expect(call[1]).toEqual(['user-1']);
  });

  test('addMember insère un membre', async () => {
    await projectModel.addMember({ id: 'm1', project_id: 'p1', user_id: 'u1', role: 'DEV' });
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO project_members (id, project_id, user_id, role) VALUES (?, ?, ?, ?)',
      ['m1', 'p1', 'u1', 'DEV']
    );
  });

  test('softDelete marque le projet inactif', async () => {
    await projectModel.softDelete('p1');
    expect(db.query).toHaveBeenCalledWith('UPDATE projects SET isActive = 0 WHERE id = ?', ['p1']);
  });
});