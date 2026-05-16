import express from "express";
import Friends from "../models/friends.js";

const router = express.Router();

router.post("/send-request", async (req, res) => {
  try {
    const { username } = req.body;
    const post = await Friends.create({ username });
    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;