const BacklogItem = require("../models/backlog.model");
const Sprint = require("../models/sprint.model");
const { v4: uuid } = require("uuid");
const db = require("../config/database");

const fetchItem = async (connection, id) => {
    const [items] = await connection.query("SELECT * FROM backlog_items WHERE id = ?", [id]);
    if (items.length === 0) throw new Error("Item not found");
    return items[0];
};

const ensureMember = async (connection, projectId, userId) => {
    const [member] = await connection.query(
        "SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?",
        [projectId, userId]
    );
    if (member.length === 0) throw new Error("Unauthorized: You are not a member of this project");
};

const ensureSprintMovable = async (connection, sprintId, errorMessage) => {
    if (!sprintId) return;
    const [sprints] = await connection.query("SELECT status FROM sprints WHERE id = ?", [sprintId]);
    if (sprints.length > 0 && sprints[0].status === "COMPLETED") {
        throw new Error(errorMessage);
    }
};

const reorderSameColumn = async (connection, sprintId, status, fromPos, toPos) => {
    if (fromPos < toPos) {
        return connection.query(
            "UPDATE backlog_items SET position = COALESCE(position, 0) - 1 WHERE sprint_id = ? AND status = ? AND position > ? AND position <= ?",
            [sprintId, status, fromPos, toPos]
        );
    }
    if (fromPos > toPos) {
        return connection.query(
            "UPDATE backlog_items SET position = COALESCE(position, 0) + 1 WHERE sprint_id = ? AND status = ? AND position >= ? AND position < ?",
            [sprintId, status, toPos, fromPos]
        );
    }
};

const moveAcrossColumns = async (connection, item, fromStatus, fromPos, finalSprintId, finalStatus, finalPosition) => {
    await connection.query(
        "UPDATE backlog_items SET position = COALESCE(position, 0) - 1 WHERE sprint_id = ? AND status = ? AND position > ?",
        [item.sprint_id, fromStatus, fromPos]
    );

    await connection.query(
        "UPDATE backlog_items SET position = COALESCE(position, 0) + 1 WHERE sprint_id = ? AND status = ? AND position >= ?",
        [finalSprintId, finalStatus, finalPosition]
    );
};

const computeTimestampUpdate = (fromStatus, finalStatus, startedAt) => {
    if (finalStatus === "IN_PROGRESS" && !startedAt) return ", started_at = CURRENT_TIMESTAMP";
    if (finalStatus === "DONE") return ", completed_at = CURRENT_TIMESTAMP";
    if (fromStatus === "DONE" && finalStatus !== "DONE") return ", completed_at = NULL";
    return "";
};

exports.getKanbanBoard = async (req, res) => {
    try {
        const { sprintId } = req.params;

        // Fetch project_id from sprint
        const [sprints] = await Sprint.findById(sprintId);
        if (sprints.length === 0) return res.status(404).json({ message: "Sprint not found" });
        const projectId = sprints[0].project_id;

        // Check membership
        const [member] = await BacklogItem.isMember(projectId, req.user.id);
        if (member.length === 0) return res.status(403).json({ message: "Unauthorized: You are not a member of this project" });

        const { assigned_to_id, type } = req.query;
        const [items] = await BacklogItem.findAllBySprint(sprintId, { assigned_to_id, type });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving Kanban board", error: err.message });
    }
};



exports.moveKanbanItem = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const toStatus = req.body.toStatus || req.body.status;
        const toPosition = req.body.toPosition !== undefined ? req.body.toPosition : req.body.position;
        const toSprintId = req.body.toSprintId || req.body.sprint_id;
        const item = await fetchItem(connection, id);
        await ensureMember(connection, item.project_id, req.user.id);
        await ensureSprintMovable(connection, item.sprint_id, "Cannot move items from a completed sprint");
        if (toSprintId && toSprintId !== item.sprint_id) {
            await ensureSprintMovable(connection, toSprintId, "Cannot move items to a completed sprint");
        }

        const fromStatus = item.status;
        const fromPos = item.position;
        const finalSprintId = toSprintId || item.sprint_id;
        const finalStatus = toStatus || fromStatus || "TODO";
        const finalPosition = toPosition !== undefined && toPosition !== null ? Number(toPosition) : fromPos || 0;

        if (fromStatus === finalStatus && item.sprint_id === finalSprintId) {
            await reorderSameColumn(connection, finalSprintId, finalStatus, fromPos, finalPosition);
        } else {
            await moveAcrossColumns(connection, item, fromStatus, fromPos, finalSprintId, finalStatus, finalPosition);
        }

        const timestampUpdate = computeTimestampUpdate(fromStatus, finalStatus, item.started_at);
        const [updateResult] = await connection.query(
            `UPDATE backlog_items SET status = ?, position = ?, sprint_id = ? ${timestampUpdate} WHERE id = ?`,
            [finalStatus, finalPosition, finalSprintId, id]
        );

        await connection.commit();

        const [updatedRows] = await connection.query("SELECT * FROM backlog_items WHERE id = ?", [id]);
        res.json({ message: "Item moved successfully", item: updatedRows[0], updated: updateResult.affectedRows });
    } catch (err) {
        await connection.rollback();
        console.error("DEBUG ERROR:", err.message);
        res.status(500).json({ message: "Error moving item", error: err.message });
    } finally {
        connection.release();
    }
};
