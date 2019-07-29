module.exports = {
  preset: "ts-jest",
  setupFiles: [
    "<rootDir>/test/setup/setupFetchMock.ts",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
  ],
};
