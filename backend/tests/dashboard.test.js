const dashboardModel = require('../models/dashboard.model');

describe('Dashboard Model', () => {
  test('getMainMetrics retourne un objet', async () => {
    const projectId = 1; // adapte selon un id existant
    const [rows] = await dashboardModel.getMainMetrics(projectId);
    expect(Array.isArray(rows)).toBe(true);
    // Optionnel : vérifier qu'un objet est bien retourné
    // expect(rows.length).toBeGreaterThan(0);
  });
});