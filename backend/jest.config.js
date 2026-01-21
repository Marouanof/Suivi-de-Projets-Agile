module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  testMatch: ["**/tests/**/*.test.js"],
  testEnvironment: "node"
};
