export default {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.spec.ts', '**/__tests__/**/*.test.ts'],
  testEnvironment: 'node',
}
