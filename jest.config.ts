module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-fetch-mock'],
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/tests"
  },
};