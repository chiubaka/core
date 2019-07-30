module.exports = {
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/forms/",
    "src/marketing/",
  ],
  preset: "ts-jest",
  setupFiles: [
    "<rootDir>/test/setup/setupFetchMock.ts",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
  ],
};
