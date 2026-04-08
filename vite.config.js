const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    exclude: ["node_modules", "e2e"],
    reporters: ['json', 'default'],
    outputFile: 'test-results.json',
  },
});
