const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true }, // hashed password, asli nahi
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["manager", "dispatch", "guard"],
    required: true,
  },
  isActive: { type: Boolean, default: true }, // false karo toh access band
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
