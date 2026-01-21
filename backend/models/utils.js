const db = require("../config/database");

// direction: 1 (inc) or -1 (dec)
const shiftPositions = (sprintId, status, fromPos, direction) => {
  const op = direction > 0 ? "+" : "-";
  return db.query(
    `UPDATE backlog_items SET position = position ${op} 1 
     WHERE sprint_id = ? AND status = ? AND position >= ?`,
    [sprintId, status, fromPos]
  );
};

const reorderInSameColumn = (sprintId, status, fromPos, toPos) => {
  if (fromPos < toPos) {
    return db.query(
      `UPDATE backlog_items SET position = position - 1 
       WHERE sprint_id = ? AND status = ? AND position > ? AND position <= ?`,
      [sprintId, status, fromPos, toPos]
    );
  }
  if (fromPos > toPos) {
    return db.query(
      `UPDATE backlog_items SET position = position + 1 
       WHERE sprint_id = ? AND status = ? AND position >= ? AND position < ?`,
      [sprintId, status, toPos, fromPos]
    );
  }
  return Promise.resolve();
};

const removeFromColumn = (sprintId, status, fromPos) => {
  return db.query(
    `UPDATE backlog_items SET position = position - 1 
     WHERE sprint_id = ? AND status = ? AND position > ?`,
    [sprintId, status, fromPos]
  );
};

module.exports = {
  shiftPositions,
  reorderInSameColumn,
  removeFromColumn,
};
