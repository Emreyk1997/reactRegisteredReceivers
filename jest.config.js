module.exports = {
  roots: ['<rootDir>/src'],
  transform: { '\\.(js|jsx)?$': 'babel-jest' },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/public/'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
