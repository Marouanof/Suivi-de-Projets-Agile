const commentModel = require('../models/comment.model');
const db = require('../config/database');

describe('comment.model', () => {
  beforeEach(() => {
    db.query.mockResolvedValue([[]]);
  });

  test('create rejette un contenu vide', async () => {
    await expect(commentModel.create({ id: 'c1', backlog_item_id: 'b1', user_id: 'u1', content: '   ' }))
      .rejects.toThrow('Comment content is required');
    expect(db.query).not.toHaveBeenCalled();
  });

  test('create trim le contenu et insère', async () => {
    await commentModel.create({ id: 'c1', backlog_item_id: 'b1', user_id: 'u1', content: ' Hello ' });
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO backlog_item_comments (id, backlog_item_id, user_id, content) VALUES (?, ?, ?, ?)',
      ['c1', 'b1', 'u1', 'Hello']
    );
  });

  test('findByItem joint les utilisateurs et filtre par backlog_item_id', async () => {
    await commentModel.findByItem('b42');
    const [sql, params] = db.query.mock.calls[0];
    expect(sql).toContain('JOIN users');
    expect(params).toEqual(['b42']);
  });

  test('softDelete désactive le commentaire', async () => {
    await commentModel.softDelete('c9');
    expect(db.query).toHaveBeenCalledWith('UPDATE backlog_item_comments SET isActive = 0 WHERE id = ?', ['c9']);
  });
});