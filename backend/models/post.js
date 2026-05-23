import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    username: String,
    title: String,
    location: String,
    date: String,
    startTime: String,
    endTime: String
  },

  {timestamps: true}
);

export default mongoose.model("Post", PostSchema);
