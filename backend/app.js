import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import accountRouter from "./route/account.js";
import postRouter from "./route/post.js";
import friendRouter from "./route/friend.js";
import historyRouter from "./route/history.js"
import statsRouter from "./route/stats.js"

dotenv.config();

const app = express();  
app.use("/uploads", express.static("uploads"));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.status(200).send("OK");
}); //MAYBE REMOVE LATER

app.use("/account", accountRouter);
app.use("/post", postRouter);
app.use("/friend", friendRouter);
app.use("/history", historyRouter);
app.use("/stats", statsRouter);

export default app;