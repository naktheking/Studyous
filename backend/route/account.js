import express from "express";
import User_account from "../models/user.js";

const router = express.Router();

router.post("/create-account", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingAccount = await User_account.findOne({ username });

    if (existingAccount) {
      console.log("Account already created");
      return res.status(409).json({ error: "account already created" });
    }
    
    const account = await User_account.create({ username, password });
    res.status(201).json(account);
    console.log("Account created");

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});


router.get("/get-account", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User_account.findOne({ username });
    if(user){
      console.log("Account found sucessfully");
      res.json(user);
    } else {
      console.log("Account not found");
      res.json("user not found");
    }
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
