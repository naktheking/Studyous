import express from "express";
import Post from "../models/post.js";
import User_account from "../models/user.js"

const router = express.Router();

router.get("/get-post/:person", async (req, res) => {
  try {
    const { person } = req.params;

    const posts = await Post.find({
      person
    });

    res.json(posts);
  } 
  catch (err) {
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