import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema(
  {
    username: String
  },

  {timestamps: true}
);

export default mongoose.model("Friends", MessageSchema);