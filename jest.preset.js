const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  setupFiles: ['./setup-jest.ts'],
};
