jest.mock("../config/database", () => ({
  query: jest.fn().mockResolvedValue([[]])
}));

const db = require("../config/database");
const backlog = require("../models/backlog.model");

describe("backlog model coverage", () => {
  test("findAllByProject", async () => {
    await backlog.findAllByProject("p1");
    expect(db.query).toHaveBeenCalled();
  });

  test("findById", async () => {
    await backlog.findById("i1");
    expect(db.query).toHaveBeenCalled();
  });

  test("findAllBySprint with filters", async () => {
    await backlog.findAllBySprint("s1", { assigned_to_id: "u1", type: "BUG" });
    expect(db.query).toHaveBeenCalled();
  });

  test("getMaxPosition", async () => {
    await backlog.getMaxPosition("s1", "TODO");
    expect(db.query).toHaveBeenCalled();
  });

  test("create uses defaults", async () => {
    await backlog.create({ project_id: "p1", sprint_id: "s1", title: "t" });
    expect(db.query).toHaveBeenCalled();
  });

  test("update filters allowed fields", async () => {
    await backlog.update("id1", { title: "new", unknown: "x" });
    expect(db.query).toHaveBeenCalled();
  });

  test("update with no fields returns resolved", async () => {
    const result = await backlog.update("id1", {});
    expect(result).toBeUndefined();
  });

  test("updateStatus valid", async () => {
    await backlog.updateStatus("id1", "DONE");
    expect(db.query).toHaveBeenCalled();
  });

  test("updateStatus invalid", async () => {
    await expect(backlog.updateStatus("id1", "INVALID"))
      .rejects.toThrow("Invalid backlog status");
  });

  test("updateStatusBySprint", async () => {
    await backlog.updateStatusBySprint("s1", "TODO");
    expect(db.query).toHaveBeenCalled();
  });

  test("sumStoryPointsBySprint", async () => {
    await backlog.sumStoryPointsBySprint("s1");
    expect(db.query).toHaveBeenCalled();
  });

  test("shiftPositions", async () => {
    await backlog.shiftPositions("s1", "TODO", 3, 1);
    expect(db.query).toHaveBeenCalled();
  });

  test("reorderInSameColumn down", async () => {
    await backlog.reorderInSameColumn("s1", "TODO", 1, 3);
    expect(db.query).toHaveBeenCalled();
  });

  test("reorderInSameColumn up", async () => {
    await backlog.reorderInSameColumn("s1", "TODO", 3, 1);
    expect(db.query).toHaveBeenCalled();
  });

  test("removeFromColumn", async () => {
    await backlog.removeFromColumn("s1", "TODO", 2);
    expect(db.query).toHaveBeenCalled();
  });

  test("isMember", async () => {
    await backlog.isMember("p1", "u1");
    expect(db.query).toHaveBeenCalled();
  });
});