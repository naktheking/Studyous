import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    pendingFriendRequests: [String],
    friendList: [String]
  }
);

export default mongoose.model("User_account", UserSchema);
