import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import accountRouter from "./routes/account.js";


const app = express();  
const PORT = 3000;


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());


// In-memory user storage
const users = {};


mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.log(err));


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
