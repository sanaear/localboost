module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  coverageThreshold: {
    global: {
      lines: 60
    }
  }
};