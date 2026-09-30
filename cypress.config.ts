import { defineConfig } from 'cypress';

import setupNodeEvents from './cypress/plugins';

export default defineConfig({
  viewportHeight: 800,
  viewportWidth: 1280,
  projectId: 'vc6vw5',
  defaultCommandTimeout: 10000,
  execTimeout: 120000,
  video: true,
  // Skip the ffmpeg re-encode: it costs ~5s per spec and passing videos are deleted anyway.
  videoCompression: false,
  e2e: {
    // Register Node-side Cypress event handlers.
    setupNodeEvents(on, config) {
      return setupNodeEvents(on, config);
    },
    baseUrl: 'http://localhost:3005',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    downloadsFolder: 'cypress/downloads',
    numTestsKeptInMemory: 0,
    experimentalMemoryManagement: true
  }
});
