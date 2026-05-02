const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Hello from Node.js!");
});

// Example API route
app.get("/api/users", (req, res) => {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
  ];

  res.json(users);
});

// Example POST route
app.post("/api/users", (req, res) => {
  const newUser = req.body;

  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});