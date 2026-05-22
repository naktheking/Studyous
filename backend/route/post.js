import express from "express";
import Post from "../models/post.js";

const router = express.Router();

router.post("/create-post", async (req, res) => {
  try {
    console.log("got post");
    const { person, startTime, endTime, location, date } = req.body;
    const post = await Post.create({ person, startTime, endTime, location, date });
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