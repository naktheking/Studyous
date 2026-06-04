import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import accountRouter from "./route/account.js";
import postRouter from "./route/post.js";
import friendRouter from "./route/friend.js";
import historyRouter from "./route/history.js"
import statsRouter from "./route/stats.js"
import session from "express-session";
import passport from "passport";
import authRouter from "./route/auth.js";

dotenv.config();

const app = express();  
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.log(err));

app.use("/account", accountRouter);
app.use("/post", postRouter);
app.use("/friend", friendRouter);
app.use("/history", historyRouter);
app.use("/stats", statsRouter);
app.use("/auth", authRouter);

export default app;