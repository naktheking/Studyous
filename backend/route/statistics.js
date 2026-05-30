import express from "express";
import User_account from "../models/user.js"

const router = express.Router();

router.get("/get-posts", async (req, res) => {
  try {
    const { username } = req.query;

    const poster = await User_account.findOne({
      username
    });

    res.json(poster);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;