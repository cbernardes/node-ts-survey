module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  verbose: true,
  testMatch: [
    "<rootDir>/src/tests/**/*.test.ts"
  ]
  // clearCache: true,
};
