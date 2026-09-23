export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: ['@babel/preset-env']
    }]
  },
  moduleFileExtensions: ['js', 'mjs', 'json'],
};