import express from "express";
import User_account from "../models/user.js";

const router = express.Router();

router.post("/create-account", async (req, res) => {
  try {
    const { username, password } = req.body;
    const account = await User_account.create({ username, password });
  
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/get-account", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User_account.findOne({ username });
    if(user){
      res.json(user);
    } else {
      res.json("user not found");
    }
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// connect with friend given username
router.post("/connect-friends", async (req, res) => {
  try {
    const { username, friend_username } = req.body;

    const self = await User_account.findOne({ username });
    const friend = await User_account.findOne({ username: friend_username });

    // check if user and friend are valid usernames
    if (!self) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }

    // findOneAndUpdate() finds the user and updates the friend list
    // $addToSet prevents duplicate friends
    // new: true returns the updated document
    const account = await User_account.findOneAndUpdate(
      { username },
      { $addToSet: { friends: friend_username } },
      { new: true }
    );

    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;