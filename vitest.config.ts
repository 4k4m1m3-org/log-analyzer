import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    /**
     * Tests run in Node environment.
     */
    environment: "node",

    /**
     * Test files location.
     */
    include: [
      "tests/**/*.test.ts",
    ],

    /**
     * Enable TypeScript source maps.
     */
    pool: "threads",

    /**
     * Clean mocks automatically.
     */
    clearMocks: true,

    /**
     * Show detailed output.
     */
    reporters: [
      "verbose",
    ],
  },
});
