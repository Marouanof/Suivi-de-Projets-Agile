const dashboardModel = require('../models/dashboard.model');
const db = require('../config/database');

describe('dashboard.model', () => {
  beforeEach(() => {
    db.query.mockResolvedValue([[]]);
  });

  test('getMainMetrics calcule les agrégats', async () => {
    await dashboardModel.getMainMetrics('p1');
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SUM'), ['p1']);
  });

  test('getMemberWorkload agrège par membre', async () => {
    await dashboardModel.getMemberWorkload('p1');
    const call = db.query.mock.calls[0];
    expect(call[0]).toContain('project_members');
    expect(call[1]).toEqual(['p1', 'p1']);
  });

  test('getVelocityHistory récupère les derniers sprints complétés', async () => {
    await dashboardModel.getVelocityHistory('p2');
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('LIMIT 5'), ['p2']);
  });

  test('getAgileMetrics calcule lead et cycle time', async () => {
    await dashboardModel.getAgileMetrics('p3');
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('avg_lead_time_hours'), ['p3']);
  });

  test('getSprintOverview renvoie la synthèse des sprints', async () => {
    await dashboardModel.getSprintOverview('p4');
    const [sql, params] = db.query.mock.calls[0];
    expect(sql).toContain('GROUP BY s.id');
    expect(params).toEqual(['p4']);
  });
});