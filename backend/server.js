import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import accountRouter from "./route/account.js";
import postRouter from "./route/post.js";

dotenv.config();

const app = express();  
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.log(err));

app.use("/account", accountRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
