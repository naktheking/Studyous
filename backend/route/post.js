import express from "express";
import Post from "../models/post.js";

const router = express.Router();

router.post("/create-post", async (req, res) => {
  try {
    const { title, location, date, startTime, endTime } = req.body;
    const post = await Post.create({ 
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