//REMEMBER TO PUT IN AI REPORT
//OTHER FILES FOR AI REPORT: PACKAGE.JSON, JEST.CONFIG.JS, and JEST.SETUP.JS
export default {
  testDir: "./e2e",
  webServer: [
    {
      command: "cd .. && cd backend && npm start",
      url: "http://localhost:3000",
      reuseExistingServer: true
    },
    {
      command: "cd .. && cd frontend && npm run dev",
      url: "http://localhost:5173/",
      reuseExistingServer: true
    }
  ]
};