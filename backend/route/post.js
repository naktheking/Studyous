import express from "express";
import Post from "../models/post.js";
import User_account from "../models/user.js"

const router = express.Router();

router.post("/create-post", async (req, res) => {
  try {
    const { username, title, location, date, startTime, endTime } = req.body;

    const user = await User_account.findOne({username});

    const post = await Post.create({ 
      username: user.username,
      title, 
      location,
      date,
      startTime, 
      endTime
    });

    res.json(post);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-post", async (req, res) => {
  try {
    const post = await Post.find();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;