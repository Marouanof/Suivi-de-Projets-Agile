module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["config/**/*.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testMatch: ["**/tests/**/*.test.js"],
  testEnvironment: "node"
};
