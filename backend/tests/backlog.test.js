// Tests essentiels pour le backlog

const backlogModel = require('../models/backlog.model');
const db = require('../config/database');

describe('Backlog Model', () => {
  // Test 1 : Connexion à la base de données
  test('La connexion à la base fonctionne', async () => {
    const [rows] = await db.query('SELECT 1+1 AS result');
    expect(rows[0].result).toBe(2);
  });

  // Test 2 : Création d'un backlog
  test('Créer un backlog retourne un résultat', async () => {
    // Génère un id unique (timestamp + random)
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
    const item = {
      id: uniqueId,
      project_id: '2372e798-44a7-46c4-8249-49cec4f5dfc2', // project_id fourni
      sprint_id: null,
      title: 'Test Backlog',
      description: 'Backlog de test',
      type: 'USER_STORY',
      story_points: 3,
      priority: 1,
      status: 'BACKLOG',
      position: 1,
      assigned_to_id: null,
      created_by_id: null
    };
    const db = require('../config/database');
    const [result] = await db.query(
      "INSERT INTO backlog_items (id, project_id, sprint_id, title, description, type, story_points, priority, status, position, assigned_to_id, created_by_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [item.id, item.project_id, item.sprint_id, item.title, item.description, item.type, item.story_points, item.priority, item.status, item.position, item.assigned_to_id, item.created_by_id]
    );
    expect(result.affectedRows).toBe(1);
    // Nettoyage : supprime le backlog créé
    await db.query("DELETE FROM backlog_items WHERE id = ?", [item.id]);
  });

  // Test 3 : Récupération de tous les backlogs d'un projet
  test('findAllByProject retourne un tableau', async () => {
    const projectId = 1; // adapte selon un project_id existant
    const [rows] = await backlogModel.findAllByProject(projectId);
    expect(Array.isArray(rows)).toBe(true);
  });
});