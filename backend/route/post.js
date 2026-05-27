import express from "express";
import User_account from "../models/user.js";

const router = express.Router();

router.post("/create-post", async (req, res) => {
  try {
    console.log("got post");
    const {person, title, location, date, startTime, endTime } = req.body;
    
    console.log("Looking for user:", person);
    const user = await User_account.findOne({ username: person });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    user.posts.push({ title, location, date, startTime, endTime });
    await user.save();

    const createdPost = user.posts[user.posts.length - 1];
    res.json(createdPost);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-post", async (req, res) => {
  try {
    const { username, person } = req.query;
    const resolvedUsername = username || person;
    const user = await User_account.findOne({ username: resolvedUsername });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.json(user.posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;