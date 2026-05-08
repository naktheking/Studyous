import cors from "cors";
import express from "express"

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// In-memory user storage
const users = {};

// Sign up endpoint
app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  if (users[username]) {
    return res.status(400).json({ error: "Username already exists" });
  }

  users[username] = { password };

  res.status(201).json({ message: "Account created successfully" });
});


// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  res.json({ message: "Login successful", username });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});