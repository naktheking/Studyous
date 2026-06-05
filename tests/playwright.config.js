/*this file is from AI*/
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