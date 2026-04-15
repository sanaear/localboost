module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  coverageThreshold: {
    global: {
      lines: 5
    }
  }
};