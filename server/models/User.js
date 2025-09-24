import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String }, // store shop name if you want
  },
  { timestamps: true }
);

// Create model
const User = mongoose.model("User", userSchema);


export default User;

