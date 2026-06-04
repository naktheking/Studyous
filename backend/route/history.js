import express from "express";
import User_account from "../models/user.js"

const router = express.Router();

router.get("/get-posts", async (req, res) => {
  try {
    const { username } = req.query;

    const poster = await User_account.findOne({
      username
    });

    if (!poster) {
      console.log("User not found");
      return res.status(404).json({ error: "user not found" });
    }

    console.log("Posts retrieved successfully");
    res.json(poster);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;