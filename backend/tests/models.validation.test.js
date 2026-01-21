jest.mock("../config/database", () => ({
  query: jest.fn().mockResolvedValue([[]])
}));

const comment = require("../models/comment.model");
const project = require("../models/project.model");
const user = require("../models/user.model");

describe("models validation", () => {
  test("comment.create rejects empty content", async () => {
    await expect(comment.create({ id: "1", backlog_item_id: "b1", user_id: "u1", content: "   " }))
      .rejects.toThrow("Comment content is required");
  });

  test("project.create rejects missing name", async () => {
    await expect(project.create({ id: "p1", description: "d" }))
      .rejects.toThrow("Project name is required");
  });

  test("project.update rejects invalid status", async () => {
    await expect(project.update("p1", { status: "BAD" }))
      .rejects.toThrow("Invalid project status");
  });

  test("user.create rejects missing email/password", async () => {
    await expect(user.create({ id: "u1", email: "", password: "" }))
      .rejects.toThrow("Email and password are required");
  });
});