import express from "express";
import User_account from "../models/user.js";

const router = express.Router();

router.post("/create-account", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log("before findOne");
    console.log(process.env.MONGO_URI);
    const existingAccount = await User_account.findOne({ username });
    console.log("after findOne");

    if (existingAccount) {
      return res.status(409).json({ error: "account already created" });
    }
    
    const account = await User_account.create({ username, password });
    return res.status(201).json(account);

  } catch (err) {
    return res.status(500).json({ error: err.message });
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

export default router;
