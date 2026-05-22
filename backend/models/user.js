import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    pendingFriendRequests: [String],
    friendList: [String]
  }
);

export default mongoose.model("User_account", MessageSchema);
